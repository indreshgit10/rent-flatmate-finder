# System Design — Rent & Flatmate Finder

## Overview

The platform is a MERN-stack application that solves the hardest part of finding a flatmate: compatibility. Price and location are easy to filter for, but lifestyle fit is harder. This system uses an AI engine to quantify that fit as a score from 0–100, so tenants see listings ranked by relevance, not just recency.

The core flow is: owners post listings → tenants build profiles → AI scores each tenant-listing pair → tenants express interest → owners accept or decline → accepted pairs unlock a private real-time chat → emails notify users at each key moment.

This write-up covers the four main design areas: the compatibility scoring system, LLM integration with graceful fallback, real-time chat, and the notification flow.

---

## 1. Compatibility Scoring Design

### The Goal

Every tenant-listing pair gets a score from 0 to 100. Higher scores surface at the top of search results. The score is computed once and cached — not recalculated on every request.

### What Gets Scored

Three primary signals drive the score:

| Factor | Weight (Rule-based) | Notes |
|---|---|---|
| Budget | 40% | Full score if rent ≤ budgetMax; partial if close |
| Location | 30% | Case-insensitive substring match between listing location and tenant's preferred location |
| Move-in Date | 15% | Full score if tenant's move-in date ≥ listing's available-from date |
| Room Type | 10% | Exact match if tenant specified a preference; otherwise defaults to full score |
| Furnishing | 5% | Exact match if tenant specified a preference; otherwise defaults to full score |

Location and budget are weighted highest because they are the most common deal-breakers in real-world flat hunting.

### Caching Strategy

Scores are stored in a dedicated `CompatibilityScore` collection in MongoDB, keyed on a `(tenant, listing)` pair. Before triggering any AI call, `compatibilityService.js` checks if a score already exists for that pair:

```
GET /api/compatibility/:listingId
  → Check CompatibilityScore collection
  → If found: return immediately (no AI call)
  → If not found: compute, persist, return
```

This means the Gemini API is only ever called once per tenant-listing pair for the lifetime of both the listing and the profile. The cached document also stores the `source` field (`"ai"` or `"rule-based"`) so it is always clear how a score was derived.

---

## 2. LLM Integration and Fallback

### Primary Path: Google Gemini

When no cached score exists, `geminiService.js` constructs a prompt using the listing details and tenant profile, then calls the Gemini 1.5 Flash model. The prompt is designed to produce a single, parseable JSON object:

```json
{ "score": 85, "explanation": "The listing is in the tenant's preferred area and within budget." }
```

The model is explicitly instructed to return raw JSON with no markdown formatting. Before the result is accepted, the backend validates:
1. The response can be parsed as valid JSON.
2. The `score` field is a number between 0 and 100.
3. The `explanation` field is a non-empty string.

If any of these checks fail, the response is rejected — and the fallback takes over.

### Fallback Path: Rule-Based Scoring

`ruleBasedScoringService.js` implements the weighted heuristics described in the table above. It runs entirely in-process, with no external dependencies, so it never fails. The output is a score and a plain-English explanation generated from whichever factors matched (e.g., "Rule-based match (70%). Matches well on: budget, location.").

The result is saved with `source: "rule-based"` so engineers can monitor how often the AI is failing or unavailable in production.

### Why This Matters

The user never sees a broken or missing score. The scoring pipeline looks like this in practice:

```
AI available + valid response  →  score saved as source: "ai"
AI unavailable or bad response →  rule-based score saved as source: "rule-based"
Tenant has no profile          →  400 error returned (score cannot be computed)
```

The only way a user gets no score is if they haven't created a profile yet — which is intentional, not a failure state.

---

## 3. Real-Time Chat Implementation

### When Chat Becomes Available

Chat between a tenant and owner is only possible after an owner explicitly accepts an interest request. The `InterestRequest` document acts as the gatekeeper — the backend validates that `interest.status === 'accepted'` before allowing any message to be persisted or routed.

### Connection and Room Architecture

The Socket.io server is initialized alongside the Express HTTP server in `server.js`, sharing the same port. When a user opens the `/chat/:interestId` page, two things happen concurrently:

1. **REST call**: `GET /api/chat/:interestId` fetches the full message history from the `ChatMessage` collection in MongoDB. This populates the chat window before the socket connection is even established, so older messages load instantly.

2. **Socket connection**: The client connects to the Socket.io server with the user's JWT token in the `auth` field. It then immediately emits a `join_chat` event with the `interestId`, which the server uses to assign that socket to a named room (`socket.join(interestId)`).

Using the `interestId` as the room name means:
- Each accepted interest pair gets its own isolated room.
- Messages are never cross-broadcast between different conversations.
- The server does not need to maintain a separate mapping of users to rooms.

### Message Lifecycle

When a user sends a message, the client emits a `send_message` event with three fields: `interestId`, `senderId`, and `content`. On the server:

1. The `InterestRequest` is re-checked to confirm the chat is still `accepted`.
2. A `ChatMessage` document is created in MongoDB.
3. The saved message is populated with sender details (`name`, `role`) via Mongoose `.populate()`.
4. The populated message is broadcast to the room via `io.to(interestId).emit('receive_message', msg)`.

**Save-first, then broadcast** is the deliberate ordering here. If the database write fails, the message is never broadcast, so no client ever shows a message that isn't actually persisted. A page refresh will always show a consistent history.

### Disconnection and Cleanup

Socket.io handles disconnection cleanup internally. When a client disconnects (closes the tab, navigates away, loses connection), the server fires the `disconnect` event and Socket.io automatically removes that socket from all rooms it joined. There is no manual teardown logic in the codebase — this is by design to avoid memory leaks from custom room management code.

---

## 4. Notification Flow

### Overview of Triggers

There are three email events in the system:

| Event | Recipient | Trigger Condition |
|---|---|---|
| High Compatibility Interest | Owner | Tenant sends interest and cached score > 80 |
| Interest Accepted | Tenant | Owner clicks Accept |
| Interest Declined | Tenant | Owner clicks Decline |

### How Emails Are Sent

All emails go through `emailService.js`, which sits between the business logic in `interestService.js` and the actual Nodemailer transport in `mailer.js`. Each event has a dedicated HTML template function that takes the relevant variables (name, location, score, link, etc.) and returns a formatted HTML string.

The three template files are:
- `highCompatibilityInterest.js` — sent to the owner with the tenant's name, score, and AI explanation.
- `interestAccepted.js` — sent to the tenant with the owner's name, listing location, and a direct link to the chat room.
- `interestDeclined.js` — sent to the tenant with a polite decline message.

### Fire-and-Forget Pattern

Email calls are always fire-and-forget. The `interestService.js` calls email functions using `.catch()` chaining:

```js
emailService.sendHighCompatibilityAlert(owner, tenant, listing, score, explanation)
  .catch(err => console.error('Failed to send high compatibility alert:', err));
```

This means:
- The HTTP response returns immediately — the user never waits for an email to send.
- If the email fails (SMTP error, bad credentials, rate limit), the error is logged but the interest request still gets saved and the UI still updates correctly.
- Email delivery is best-effort, not a hard dependency.

### High Compatibility Check Logic

The score check for the owner alert happens **after** the `InterestRequest` is already saved to the database. The flow in `sendInterest()` is:

1. Validate tenant profile and listing exist.
2. Check for duplicate interest (reject with 409 if found).
3. Create the `InterestRequest` document.
4. In a `try-catch`, look up the `CompatibilityScore` for this tenant-listing pair.
5. If `score > 80`, fetch the owner's email and fire the alert.

The alert only fires if a `CompatibilityScore` already exists in the database — meaning it was computed when the tenant browsed the listing. This is intentional: if the tenant somehow sends an interest request without ever having viewed the listing (e.g., direct API call), no alert fires, which is the correct behaviour since a valid AI score would not be available.

---

## 5. Database Schema Design

The schema is designed around clean separation of concerns rather than embedding everything into large documents.

| Collection | Purpose | Key Index |
|---|---|---|
| `users` | Authentication and role storage | `email` (unique) |
| `tenantprofiles` | Tenant preference data | `tenant` (unique, ref User) |
| `listings` | Property listing data | `owner` (ref User), `isFilled`, `isHidden` |
| `compatibilityscores` | Cached AI/rule-based scores | Compound unique: `(tenant, listing)` |
| `interestrequests` | Interest state machine | Compound unique: `(tenant, listing)` prevents duplicates |
| `chatmessages` | Persisted chat history | `interestRequest` (ref InterestRequest) |

The compound unique index on `InterestRequest(tenant, listing)` is the database-level guarantee that duplicate interest requests are rejected, complementing the application-level check in `interestService.js`.

The compound unique index on `CompatibilityScore(tenant, listing)` prevents race conditions where two simultaneous requests might both find no cached score and both trigger an AI call, potentially creating two conflicting documents.

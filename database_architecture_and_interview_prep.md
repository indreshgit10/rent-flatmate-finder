# Database Architecture & Interview Prep: Rent Flatmate Finder

This document serves as a complete breakdown of the Polyglot Persistence architecture used in the Rent Flatmate Finder application. It is designed to help you thoroughly understand the system and defend your architectural choices in an engineering interview.

---

## 1. Architectural Overview: Polyglot Persistence

The application utilizes **Polyglot Persistence**, meaning it uses different database technologies to handle different types of data based on their specific strengths and access patterns.

### Why Polyglot Persistence?
No single database is perfect for every use case. 
- We use **MySQL (Relational)** for core domain data that requires strict structure, data integrity, and complex relational querying.
- We use **MongoDB (Document/NoSQL)** for unstructured, high-volume, or rapidly evolving data that benefits from flexible schemas and fast read/write speeds for nested JSON-like documents.

---

## 2. MySQL: The Relational Core (Normalized SQL)

The MySQL database acts as the strict "Source of Truth" for the application's core entities. The schema is highly normalized (primarily up to the 3rd Normal Form) to eliminate data redundancy and ensure data integrity via Foreign Keys.

### Entities and Relationships
*   **Users (1)** ⟷ **(0..1) TenantProfiles:** A one-to-one relationship. A user can optionally have a tenant profile detailing their renting preferences.
*   **Users (1)** ⟷ **(0..N) Listings:** A one-to-many relationship. A user (acting as a landlord) can post multiple property listings.
*   **Users (1)** ⟷ **(0..N) InterestRequests:** A one-to-many relationship. A user can send multiple requests to different listings.
*   **Listings (1)** ⟷ **(0..N) InterestRequests:** A one-to-many relationship. A single listing can receive requests from multiple users.

### SQL Normalized Schema Definition

```sql
-- Users Table (Core Identity)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('tenant', 'landlord', 'both') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TenantProfiles Table (Normalized out of Users)
CREATE TABLE TenantProfiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE NOT NULL, -- FK to Users.id
    preferred_location VARCHAR(255),
    budget_min INT DEFAULT 0,
    budget_max INT DEFAULT 100000,
    move_in_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Listings Table (Properties for rent)
CREATE TABLE Listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL, -- FK to Users.id
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    monthly_rent INT NOT NULL,
    is_filled BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- InterestRequests Table (The associative/join-like entity for matchmaking)
CREATE TABLE InterestRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL, -- FK to Users.id (The Tenant)
    listing_id INT NOT NULL, -- FK to Listings.id
    status ENUM('pending', 'accepted', 'declined') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES Listings(id) ON DELETE CASCADE
);
```

---

## 3. MongoDB: The Flexible Store (NoSQL)

MongoDB is used for data that is hierarchical, unstructured, or requires high-throughput reads/writes without the need for strict relational `JOIN`s.

### Entities and Relationships (Soft References)
Because MongoDB is a separate system, we use "Soft References" to link MongoDB documents back to MySQL entities (by storing the MySQL `id` as an integer field in MongoDB).

*   **ChatMessages / Messages:** High volume, rapidly growing data.
*   **Notifications:** Ephemeral, variable-structured alert data.

### MongoDB Schema Definitions (Mongoose)

```javascript
// ChatMessage.js (A thread of conversation between users)
const ChatMessageSchema = new mongoose.Schema({
  participants: [{
    type: Number, // SOFT REFERENCE to MySQL Users.id
    required: true
  }],
  listingId: {
    type: Number, // SOFT REFERENCE to MySQL Listings.id
  },
  lastMessageAt: { type: Date, default: Date.now }
});

// Message.js (Individual messages within a Chat Thread)
const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId, // Ref to ChatMessage collection
    ref: 'ChatMessage',
    required: true
  },
  senderId: {
    type: Number, // SOFT REFERENCE to MySQL Users.id
    required: true
  },
  text: { type: String, required: true },
  readBy: [{ type: Number }] // Array of MySQL Users.id
}, { timestamps: true });

// Notification.js (System alerts)
const NotificationSchema = new mongoose.Schema({
  userId: {
    type: Number, // SOFT REFERENCE to MySQL Users.id
    required: true
  },
  type: {
    type: String,
    enum: ['interest_received', 'interest_accepted', 'interest_declined', 'system_alert'],
    required: true
  },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed } // Flexible payload (e.g., listing ID, sender name)
}, { timestamps: true });
```

---

## 4. Interview Preparation: Defending Your Architecture

When presenting this project, interviewers will challenge your architectural choices. Here is how you defend them.

### Q1: "Why did you choose a Polyglot Persistence architecture instead of just sticking with one database?"
**Answer:** "I analyzed the access patterns and data structures of the application and realized that a single database would force compromises. The core domain (Users, Listings, Tenant Profiles) is highly relational. A user creates a listing, another user sends an interest request for that listing. Managing this in NoSQL leads to data duplication and painful manual cascading deletes. MySQL enforces this integrity natively. However, for features like Chat and Notifications, the data is highly variable, hierarchical, and write-heavy. Using MongoDB for chat allows me to store rich, nested documents and scale that specific, high-traffic feature independently without locking up my relational core."

### Q2: "Why use MySQL specifically for the core domain over MongoDB?"
**Answer:** "Three main reasons:
1. **Data Integrity & ACID Compliance:** If a User deletes their account, I need their TenantProfile, their Listings, and any Pending Interest Requests tied to them to be deleted immediately. MySQL's `ON DELETE CASCADE` handles this flawlessly at the database engine level, preventing orphaned data.
2. **Normalized Filtering:** Searching for a flatmate involves complex filters (e.g., 'Find all Listings where rent < X, location = Y, and join with the Owner's details'). SQL `JOIN`s are heavily optimized for querying across multiple normalized entities.
3. **Strict Schema:** The core domain rarely changes structure. Enforcing a strict schema prevents bad data from ever entering the system."

### Q3: "Why use MongoDB for Chat Messages and Notifications?"
**Answer:** "Chat systems are fundamentally document-oriented. A chat thread consists of an array of participants and a rapidly growing array of messages. Fetching a chat thread in MongoDB is extremely fast because it retrieves a single JSON document. If I used MySQL, I would have to `JOIN` a `Chats` table, a `ChatParticipants` mapping table, and a `Messages` table just to load one conversation. Additionally, Notifications often have variable payloads (`metadata: Mixed`). MongoDB allows me to store different types of notifications with different payload structures in the same collection without altering a strict SQL schema."

### Q4: "How do you handle relationships between a MySQL table and a MongoDB collection since they are separate systems?"
**Answer:** "I use 'Soft References'. In my MongoDB `Notification` document, I store `userId` as an integer, which corresponds to the Primary Key in the MySQL `Users` table. The application layer (Node.js/Express) acts as the bridge. When a user requests their notifications, the API identifies the user by their MySQL ID (extracted from their JWT token) and queries MongoDB for documents matching that integer ID. While this means I cannot rely on database-level Foreign Key constraints for these specific cross-DB relationships, it is a standard tradeoff in microservice and polyglot architectures, and it works perfectly because Chat and Notification data is non-critical compared to core transactional data."

### Q5: "What are the drawbacks of this Polyglot architecture?"
**Answer:** "The main drawback is operational complexity. It requires maintaining two separate database connections in the Node server, managing two different infrastructure deployments (or containers), and backing up two different systems. It also requires the developers to context-switch between writing SQL queries and Mongoose syntax. However, for a system meant to scale, isolating the high-volume unstructured data (chat) from the mission-critical structured data (listings/payments) makes the operational overhead worth it."

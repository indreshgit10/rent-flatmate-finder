const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { clientUrl, nodeEnv } = require('./config/env');

const app = express();

app.use(helmet());
app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/compatibility', require('./routes/compatibilityRoutes'));
app.use('/api/interests', require('./routes/interestRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;

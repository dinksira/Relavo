const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/clients.routes'));
app.use('/api/invoices', require('./routes/invoices.routes'));
app.use('/api/alerts',  require('./routes/alerts.routes'));
app.use('/api/ai',      require('./routes/ai.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'relavo-api' }));

module.exports = app;

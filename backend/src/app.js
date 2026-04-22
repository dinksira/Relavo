const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// 1. CORS - MUST BE FIRST
const allowedOrigins = [
  'https://relavo.vercel.app', 
  'https://www.relavo.vercel.app',
  'https://relavo.xyz', 
  'https://www.relavo.xyz',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                     /\.vercel\.app$/.test(origin) || 
                     /\.up\.railway\.app$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origin ${origin} not allowed`);
      callback(null, true); // Fallback: allow but log. Alternatively: callback(new Error('CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin',
    'X-Client-Info',
    'apikey'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// 2. Pre-flight
app.options('*', cors());

// 3. Other middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth.routes'));
app.use('/api/clients', require('./routes/clients.routes'));
app.use('/api/invoices', require('./routes/invoices.routes'));
app.use('/api/alerts',  require('./routes/alerts.routes'));
app.use('/api/ai',      require('./routes/ai.routes'));
app.use('/api/team',    require('./routes/team.routes'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'relavo-api' }));

module.exports = app;

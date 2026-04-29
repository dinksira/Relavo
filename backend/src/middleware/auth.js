const supabase = require('../config/supabase');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('[Auth] No Bearer token provided in headers.');
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    
    // Diagnostic: Check token existence (do NOT log full token in production)
    const tokenPreview = token ? `${token.substring(0, 8)}...${token.substring(token.length - 8)}` : 'null';
    console.debug(`[Auth] Verifying token: ${tokenPreview}`);

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error(`[Auth] Supabase verification failed:`, error?.message || 'User not found');
      if (error) console.error('[Auth] Full error details:', JSON.stringify(error));
      
      return res.status(401).json({ 
        error: "Unauthorized", 
        code: error?.code || 'AUTH_FAILED',
        message: error?.message || 'Invalid or expired session'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('CRITICAL: Auth Middleware Exception:', err);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;

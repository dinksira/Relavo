import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-relavo-surface flex flex-col items-center justify-center p-4">
      <div className="card w-full max-w-[400px] p-8 flex flex-col items-center">
        <Logo className="h-10 mb-8" />
        
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-sm font-medium text-relavo-text-secondary mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              className="input-field"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-relavo-text-secondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 mt-2">
            Sign in
          </button>
        </form>

        <p className="mt-8 text-sm text-relavo-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-relavo-blue hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
      
      <p className="mt-8 text-xs text-relavo-text-muted">
        &copy; {new Date().getFullYear()} relavo inc. All rights reserved.
      </p>
    </div>
  );
};

export default Login;

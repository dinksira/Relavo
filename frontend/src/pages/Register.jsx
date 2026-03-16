import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { User, Mail, Lock, ArrowRight, Zap, Target, Rocket } from 'lucide-react';
import heroImg from '../assets/images/hero.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    agency: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just navigate to dashboard
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left side: Visual/Marketing */}
      <div className="hidden lg:flex flex-1 bg-relavo-navy relative overflow-hidden items-center justify-center p-20">
         <div className="absolute inset-0 z-0">
            <img 
               src={heroImg} 
               alt="Abstract pulses" 
               className="w-full h-full object-cover opacity-40 mix-blend-overlay rotate-180"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-relavo-navy via-relavo-navy/90 to-relavo-blueDark/80" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
               <div className="w-20 h-20 bg-relavo-blue rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-relavo-blue/40">
                  <Rocket size={40} className="animate-float" />
               </div>
               
               <div className="space-y-6">
                  <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                    Scale your agency <br />
                    <span className="text-relavo-blue">without</span> the <br />
                    churn anxiety.
                  </h2>
                  <p className="text-xl text-white/60 font-medium leading-relaxed">
                    The only health monitoring platform built specifically for high-growth service businesses.
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="flex gap-6 items-start reveal">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-relavo-blue shrink-0 border border-white/10">
                       <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1 tracking-tight">Instant Setup</h4>
                        <p className="text-sm text-white/50 font-medium leading-relaxed">Sync your existing CRM or communication tools in under 5 minutes.</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-relavo-blue shrink-0 border border-white/10">
                       <Target size={24} />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-1 tracking-tight">Precision Scoring</h4>
                        <p className="text-sm text-white/50 font-medium leading-relaxed">Our AI detects behavioral shifts human account managers often miss.</p>
                    </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-[600px] flex flex-col p-8 md:p-16 xl:p-24 relative z-10 bg-white">
        <div className="mb-auto flex justify-between items-center">
          <Link to="/">
            <Logo className="h-8" />
          </Link>
          <p className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest hidden sm:block">Step 1 of 2</p>
        </div>

        <div className="max-w-[450px] w-full mx-auto my-12">
          <div className="space-y-3 mb-10">
            <h1 className="text-4xl font-black text-relavo-navy tracking-tight underline decoration-relavo-blue decoration-8 underline-offset-[-2px]">Start for free.</h1>
            <p className="text-relavo-text-secondary font-medium">Join the waitlist and get first access to the Relavo engine.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest ml-1">
                  Agency Name
                </label>
                <input
                  name="agency"
                  type="text"
                  required
                  placeholder="Flux Labs"
                  className="w-full px-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                  value={formData.agency}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest ml-1">
                Work Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-text-muted uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-relavo-text-muted group-focus-within:text-relavo-blue transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="At least 12 characters"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-relavo-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-relavo-blue/10 focus:border-relavo-blue font-medium transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
               <input type="checkbox" required className="mt-1 accent-relavo-blue" />
               <p className="text-xs text-relavo-text-secondary font-medium leading-relaxed">
                  I agree to the <a href="#" className="text-relavo-blue font-bold">Terms of Service</a> and acknowledge the <a href="#" className="text-relavo-blue font-bold">Privacy Policy</a>.
               </p>
            </div>

            <button type="submit" className="btn-premium w-full py-4 text-lg mt-4 shadow-xl shadow-relavo-blue/20">
              Create Agency Space <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-relavo-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-relavo-blue font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-auto pt-10 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-relavo-text-muted uppercase tracking-widest">
          <span>&copy; 2026 relavo inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-relavo-navy">Contact</a>
            <a href="#" className="hover:text-relavo-navy">API</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

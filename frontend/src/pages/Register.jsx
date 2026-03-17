import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { User, Mail, Lock, ArrowRight, Zap, Target, Rocket } from 'lucide-react';
import bgVideo from '../assets/BGAUTH.mp4';

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
            <video 
               autoPlay 
               loop 
               muted 
               playsInline
               className="w-full h-full object-cover opacity-60 scale-x-[-1]"
            >
               <source src={bgVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-bl from-relavo-navy via-relavo-navy/60 to-transparent" />
         </div>

         <div className="relative z-10 max-w-[500px] w-full">
            <div className="space-y-12">
                <div className="mb-10">
                   <Logo className="h-12 brightness-0 invert" showText={false} />
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Zap className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">Rapid Launch</p>
                     <p className="text-lg font-bold text-white tracking-tight">5 Min Setup</p>
                  </div>
                  <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl space-y-2">
                     <Target className="text-relavo-blue" size={24} />
                     <p className="text-xs font-black text-white/40 uppercase tracking-widest">AI Detection</p>
                     <p className="text-lg font-bold text-white tracking-tight">Precision Scoring</p>
                  </div>
                </div>
            </div>
         </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-[580px] flex flex-col p-8 md:p-12 relative z-10 bg-white shadow-2xl">
        <div className="mb-4 flex justify-between items-center">
          <Link to="/">
            <Logo className="h-7" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-relavo-blue animate-pulse" />
            <p className="text-[9px] font-black text-relavo-navy/40 uppercase tracking-[0.2em]">Live Waitlist</p>
          </div>
        </div>

        <div className="max-w-[400px] w-full mx-auto my-auto py-2">
          <div className="space-y-2 mb-10">
            <h1 className="text-3xl font-black text-relavo-navy tracking-tight">Start for free.</h1>
            <p className="text-relavo-text-secondary text-sm font-medium">Join the waitlist of 200+ agencies and get first access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Agency Name
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <input
                  name="agency"
                  type="text"
                  required
                  placeholder="e.g. Flux Labs"
                  className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.agency}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@agency.com"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-relavo-navy/40 uppercase tracking-[0.2em] ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-focus-within:bg-relavo-blue transition-all rounded-l-xl z-20" />
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-relavo-blue transition-colors z-10" size={17} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="At least 12 characters"
                  className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl focus:outline-none focus:border-relavo-blue focus:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.12)] font-bold transition-all text-sm placeholder:text-slate-300 text-relavo-navy"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
               <input type="checkbox" required className="accent-relavo-blue cursor-pointer h-4 w-4" />
               <p className="text-[10px] text-relavo-text-secondary font-medium leading-tight">
                  I agree to the <a href="#" className="text-relavo-blue font-black">Terms</a> and acknowledge the <a href="#" className="text-relavo-blue font-black">Privacy Policy</a>.
               </p>
            </div>

            <button type="submit" className="btn-premium w-full py-4 text-base mt-2 shadow-2xl shadow-relavo-blue/10 flex items-center justify-center gap-2 group/btn">
              Create Agency Space <ArrowRight size={20} className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-relavo-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-relavo-blue font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-black text-relavo-text-muted uppercase tracking-widest">
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

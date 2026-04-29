import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Zap, 
  MousePointer2, 
  MessageCircle,
  BarChart3,
  Globe,
  Star,
  Cpu,
  Lock,
  PieChart
} from 'lucide-react';
import Logo from '../components/Logo';
import useRevealOnScroll from '../hooks/useRevealOnScroll';
import LazyVideo from '../components/ui/LazyVideo';

import heroPoster from '../assets/images/hero.png';

// HD Card Images
import cardHealth from '../assets/images/card-health.png';
import cardAi from '../assets/images/card-ai.png';
import cardTeam from '../assets/images/card-team.png';
import cardPulse from '../assets/images/card-pulse.png';
import cardDashboard from '../assets/images/card-dashboard.png';
import cardIntegrations from '../assets/images/card-integrations.png';

// OPTIMIZATION: Using external CDN URLs for instant streaming.
// Transformations: q_auto (quality), f_auto (format/WebM), so_0 (instant start)
const VIDEO_URLS = {
  hero: "https://res.cloudinary.com/dpiaomto6/video/upload/q_auto,f_auto,so_0,w_1280/v1777448248/Blue_Abstract_u13zgp.mp4",
  relationship: "https://res.cloudinary.com/dpiaomto6/video/upload/q_auto,f_auto,so_0,w_800/v1777448242/Relationship_uvkkjq.mp4",
};

const LandingPage = () => {
  useRevealOnScroll();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setRotation({ x: (y - 0.5) * 10, y: (x - 0.5) * 10 });
  };

  return (
    <div className="min-h-screen bg-[#020617] overflow-x-hidden selection:bg-blue-500/30 text-white font-sans">
      <div className="fixed inset-0 bg-grid-white opacity-[0.03] pointer-events-none" />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <div className="max-w-[1240px] mx-auto flex items-center justify-between bg-white/5 backdrop-blur-2xl px-8 py-4 rounded-[28px] border border-white/10 shadow-2xl">
          <Logo className="h-6 brightness-0 invert" />
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-white/50">
            <a href="#intelligence" className="hover:text-white transition-colors">Intelligence</a>
            <a href="#features" className="hover:text-white transition-colors">Platform</a>
            <a href="#blueprint" className="hover:text-white transition-colors">The Blueprint</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-white/80 hover:text-white transition-colors">Log In</Link>
            <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              Secure Access
            </Link>
          </div>
        </div>
      </nav>

      {/* Refined Hero Section */}
      <header 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setRotation({ x: 0, y: 0 })}
        className="relative min-h-screen flex items-center pt-32 px-6 overflow-hidden"
      >
        <LazyVideo 
          src={VIDEO_URLS.hero} 
          overlayClassName="bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent"
        />

        <div className="max-w-[1240px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div 
            className="text-left transition-transform duration-200 ease-out"
            style={{ transform: `perspective(1000px) rotateX(${rotation.x * 0.5}deg) rotateY(${rotation.y * 0.5}deg)` }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 reveal">
              <Sparkles size={12} />
              The Intelligence Layer for Modern Agencies
            </div>
            
            <h1 className="text-4xl md:text-6xl font-semibold text-white mb-8 tracking-tight leading-[1.2] reveal">
              Defend your <br />
              agency revenue.
            </h1>
            
            <p className="text-lg text-slate-400 max-w-[540px] mb-12 font-normal leading-relaxed reveal" style={{ transitionDelay: '100ms' }}>
              Automate relationship monitoring across your entire portfolio. Relavo correlates communication gaps, invoice delays, and sentiment shifts to predict churn 14 days before it happens.
            </p>

            <div className="flex flex-col sm:flex-row items-start justify-start gap-6 reveal" style={{ transitionDelay: '200ms' }}>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-8 py-4 font-semibold text-base shadow-lg shadow-blue-500/10 flex items-center gap-3 transition-all hover:translate-y-[-1px] active:scale-95">
                Access your dashboard <ArrowRight size={18} />
              </Link>
            </div>
            
            {/* Minimal Social Proof */}
            <div className="mt-20 reveal opacity-30" style={{ transitionDelay: '300ms' }}>
               <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Trusted by global leaders</p>
               <div className="flex flex-wrap gap-12 grayscale invert">
                  <div className="text-lg font-black tracking-widest">DELTA</div>
                  <div className="text-lg font-black tracking-widest">NEXUS</div>
                  <div className="text-lg font-black tracking-widest">QUANTUM</div>
               </div>
            </div>
          </div>

          {/* Right side remains empty or for future visual depth */}
          <div className="hidden lg:block h-[600px]" />
        </div>
      </header>

      {/* Intelligence Showcase */}
      <section id="intelligence" className="py-40 px-6 relative">
         <div className="max-w-[1240px] mx-auto grid lg:grid-cols-2 gap-32 items-center">
            <div className="reveal">
               <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tight leading-[0.9]">
                 Engineered to catch <br />
                 <span className="text-blue-500">Silent Attrition.</span>
               </h2>
               <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                 Communication gaps. Sentiment shifts. Financial erraticism. <br />
                 Relavo correlates thousands of data points to predict churn 14 days before the email arrives.
               </p>
               
               <div className="space-y-6">
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group">
                     <div className="flex gap-6">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                           <Cpu size={28} />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-black text-white">Sentiment Synthesis</h4>
                           <p className="text-slate-500 font-medium">Automatic tone analysis of every interaction to detect frustration before it scales.</p>
                        </div>
                     </div>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group">
                     <div className="flex gap-6">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                           <PieChart size={28} />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-black text-white">Financial Exposure Tracking</h4>
                           <p className="text-slate-500 font-medium">Instantly visualize the exact MRR impact of at-risk accounts in real-time.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative reveal" style={{ transitionDelay: '200ms' }}>
               <div className="absolute -inset-4 bg-blue-500/20 blur-[100px] rounded-full" />
               <div className="relative bg-slate-900 border border-white/10 rounded-[48px] overflow-hidden shadow-2xl aspect-[4/5] lg:rotate-3 hover:rotate-0 transition-all duration-700">
                  <LazyVideo 
                    src={VIDEO_URLS.relationship} 
                    opacity="opacity-100"
                    mixBlendMode="normal"
                    overlayClassName="bg-gradient-to-t from-slate-950 via-transparent to-transparent"
                  />
                  <div className="absolute bottom-10 left-10 right-10 p-10 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                           <Activity size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Diagnostic</p>
                           <p className="text-lg font-black text-white">Predictive Health Analysis</p>
                        </div>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[72%] bg-blue-600" />
                     </div>
                     <p className="text-sm text-white/60 font-medium leading-relaxed italic">"Churn risk detected: Communication density dropped 40% below historical baseline."</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Product Feature Deck */}
      <section id="features" className="py-40 px-6 bg-[#03081a]">
         <div className="max-w-[1240px] mx-auto mb-24 reveal">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8">
               Everything <span className="text-blue-500 italic">Connected.</span>
            </h2>
            <p className="text-xl text-slate-500 max-w-[600px] font-medium leading-relaxed">
              Relavo integrates your entire agency ecosystem into a single health stream. One data source. Ultimate clarity.
            </p>
         </div>

         <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PremiumFeatureCard 
              icon={Zap} 
              title="Real-time Scoring" 
              desc="Weighted algorithms analyzing data every 24 hours."
              img={cardHealth}
            />
            <PremiumFeatureCard 
              icon={MessageCircle} 
              title="AI Summarization" 
              desc="Complex logs translated into 3-sentence briefings."
              img={cardAi}
            />
            <PremiumFeatureCard 
              icon={Globe} 
              title="Global Sync" 
              desc="Native integrations for Slack, Gmail, and Stripe."
              img={cardIntegrations}
            />
            <PremiumFeatureCard 
              icon={ShieldCheck} 
              title="Security Protocol" 
              desc="Enterprise-grade encryption for all client data."
              img={cardPulse}
            />
            <PremiumFeatureCard 
               icon={BarChart3} 
               title="Revenue Heatmaps" 
               desc="Visualizing portfolio risk by total MRR exposure."
               img={cardDashboard}
            />
            <PremiumFeatureCard 
               icon={Star} 
               title="Priority Matrix" 
               desc="AI-driven suggestions for re-engagement strategies."
               img={cardTeam}
            />
         </div>
      </section>

      {/* The Blueprint CTA */}
      <section id="blueprint" className="py-40 px-6">
         <div className="max-w-[1240px] mx-auto bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[64px] p-12 lg:p-32 relative overflow-hidden text-center reveal">
            <div className="absolute inset-0 bg-grid-white opacity-10" />
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/20 blur-[120px] rounded-full" />
            
            <div className="relative z-10 space-y-12">
               <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                 Defend <br /> Your Agency.
               </h2>
               <p className="text-2xl text-white/70 max-w-[600px] mx-auto font-medium">
                 Stop guessing. Start knowing. Relavo is your defensive layer against the silent churn killing your growth.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link to="/login" className="bg-white text-navy px-12 py-6 rounded-3xl font-black text-xl hover:scale-105 transition-all shadow-2xl">
                    Get Early Access
                  </Link>
                  <button className="bg-transparent text-white border-2 border-white/20 px-12 py-6 rounded-3xl font-black text-xl hover:bg-white/10 transition-all">
                    Book the Demo
                  </button>
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Protecting $4M+ in annual recurring revenue</p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-white/5 relative bg-[#020617]">
         <div className="max-w-[1240px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-20">
            <div className="col-span-2 space-y-8">
               <Logo className="h-6 brightness-0 invert" />
               <p className="text-slate-500 max-w-[320px] font-medium leading-relaxed">
                 The predictive relationship monitoring layer for elite agencies and high-growth services.
               </p>
               <div className="flex gap-4">
                  {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all cursor-pointer" />)}
               </div>
            </div>
            
            <div className="space-y-6">
               <h5 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Platform</h5>
               <ul className="space-y-4 text-slate-500 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">Intelligence Suite</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Security Protocol</li>
                  <li className="hover:text-white transition-colors cursor-pointer">API Integration</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Knowledge Hub</li>
               </ul>
            </div>
            
            <div className="space-y-6">
               <h5 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Company</h5>
               <ul className="space-y-4 text-slate-500 font-bold text-sm">
                  <li className="hover:text-white transition-colors cursor-pointer">Our Mission</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Service Terms</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Privacy Protocol</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
               </ul>
            </div>
         </div>
         
         <div className="max-w-[1240px] mx-auto mt-24 pt-12 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            <span>© 2026 relavo technologies inc.</span>
            <span>Made for Scale</span>
         </div>
      </footer>
    </div>
  );
};

const PremiumFeatureCard = ({ icon: Icon, title, desc, img }) => (
  <div className="group relative bg-white/5 border border-white/10 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all duration-500 flex flex-col h-full">
     <div className="h-64 relative overflow-hidden shrink-0">
        <img src={img} alt={title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03081a] via-transparent to-transparent" />
     </div>
     <div className="p-10 space-y-4 flex-1 flex flex-col justify-between relative z-10">
        <div className="space-y-4">
           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all">
              <Icon size={24} />
           </div>
           <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
           <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
        <div className="pt-6 border-t border-white/5 flex justify-between items-center">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Core Feature</span>
           <ArrowRight size={18} className="text-blue-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
        </div>
     </div>
  </div>
);

const Sparkles = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default LandingPage;

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
  Globe
} from 'lucide-react';
import Logo from '../components/Logo';
import useRevealOnScroll from '../hooks/useRevealOnScroll';

import heroImg from '../assets/images/hero.png';
import teamImg from '../assets/images/team.png';
import aiGlowImg from '../assets/images/ai-glow.png';
import heroVideo from '../assets/Blue_Abstract.mp4';
import relationshipVideo from '../assets/Relationship.mp4';

// HD Card Images
import cardHealth from '../assets/images/card-health.png';
import cardAi from '../assets/images/card-ai.png';
import cardTeam from '../assets/images/card-team.png';
import cardPulse from '../assets/images/card-pulse.png';
import cardDashboard from '../assets/images/card-dashboard.png';
import cardIntegrations from '../assets/images/card-integrations.png';

const LandingPage = () => {
  useRevealOnScroll();
  const [rotation, setRotation] = useState({ x: 1, y: -2 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center in percentage (-1 to 1)
    const moveX = (e.clientX - centerX) / (rect.width / 2);
    const moveY = (e.clientY - centerY) / (rect.height / 2);
    
    // Tilt intensity (max 15 degrees)
    const tiltX = -moveY * 15;
    const tiltY = moveX * 15;
    
    setRotation({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 1, y: -2 }); // Reset to slight default tilt
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-blue/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between bg-white/50 backdrop-blur-xl px-8 py-3 rounded-full border border-white/20 shadow-xl">
          <Logo className="h-7" />
          <div className="hidden lg:flex items-center gap-10 text-sm font-extrabold text-navy uppercase tracking-widest">
            <a href="#solutions" className="hover:text-blue transition-colors">Solutions</a>
            <a href="#ai-intelligence" className="hover:text-blue transition-colors">AI Intelligence</a>
            <a href="#resources" className="hover:text-blue transition-colors">Resources</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-black text-navy border-2 border-slate-200 rounded-xl hover:border-blue hover:text-blue cursor-pointer transition-all">Log in</Link>
            <Link to="/login" className="bg-navy hover:bg-blue text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-navy/20 transition-all">
              Get Early Access <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover scale-105"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          {/* Enhanced Premium Overlays for readability */}
          {/* Minimal dark overlay to make white text pop without hiding the video */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.95]">
              Don't lose clients <br />
              <span className="text-blue">silently.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-[600px] mb-10 font-medium">
              Relavo monitors 12+ health signals to detect at-risk clients <span className="text-white font-bold italic">before they churn.</span> It's the early warning system your agency needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
              <Link to="/login" className="bg-blue hover:bg-[#2563eb] text-white rounded-2xl px-10 py-5 font-black text-xl shadow-2xl shadow-blue/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.03]">
                Get Early Access <ArrowRight size={22} className="opacity-90" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="solutions" className="py-24 md:py-40 px-6">
        <div className="max-w-[1400px] mx-auto text-center reveal mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-navy mb-6 tracking-tight">Powerful enough for Enterprise. <br /> Built for <span className="text-blue italic">Small Teams.</span></h2>
          <p className="text-xl text-text-2 max-w-[800px] mx-auto font-medium">From real-time sentiment analysis to automated health scoring, Relavo gives you the tools usually reserved for unicorn companies.</p>
        </div>

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <FeatureCard 
             icon={Activity} 
             title="Real-time Health Scoring" 
             description="A proprietary weighted algorithm scoring every client from 0 to 100 every 24 hours based on communication, finances, and activity."
             delay="0ms"
             color="blue"
             image={cardHealth}
           />
           <FeatureCard 
             icon={MessageCircle} 
             title="AI Insight Generation" 
             description="Stop reading logs. Our AI-powered engine translates complex data patterns into 3-sentence plain English summaries."
             delay="100ms"
             color="indigo"
             image={cardAi}
           />
           <FeatureCard 
             icon={MousePointer2} 
             title="Smart Touchpoint Logger" 
             description="Log a call, meeting, or message in 2 seconds. Our system automatically correlates every touchpoint with client health."
             delay="200ms"
             color="emerald"
             image={cardTeam}
           />
           <FeatureCard 
             icon={BarChart3} 
             title="Revenue at Risk" 
             description="See exactly how much revenue is tied to your 'At Risk' clients. Prioritize your outreach by pure business impact."
             delay="300ms"
             color="rose"
             image={cardDashboard}
           />
           <FeatureCard 
             icon={ShieldCheck} 
             title="Sentiment Detection" 
             description="AI automatically scans the tone of recent interactions to flag frustration before it becomes an email complaint."
             delay="400ms"
             color="amber"
             image={cardPulse}
           />
           <FeatureCard 
             icon={Globe} 
             title="Integration Library" 
             description="Connect your Gmail, Slack, and Stripe for a unified view of your relationship health without finger-pointing."
             delay="500ms"
             color="violet"
             image={cardIntegrations}
           />
        </div>
      </section>

      {/* Showcase Section */}
      <section id="ai-intelligence" className="py-24 md:py-40 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={aiGlowImg} alt="AI analysis" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
           <div className="reveal">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Intelligence <br /><span className="text-blue">Informed </span> by Data.</h2>
              <div className="space-y-8">
                 <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-blue/20 rounded-2xl flex items-center justify-center text-blue shrink-0">
                       <Zap size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Automated Insights</h4>
                        <p className="text-white/60 leading-relaxed font-medium">Relavo's AI analyzes 30-day trends to identify subtle shifts in client behavior that human eyes often miss.</p>
                    </div>
                 </div>
                 <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 shrink-0">
                       <Mail size={24} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white mb-2">Re-engagement Drafter</h4>
                        <p className="text-white/60 leading-relaxed font-medium">One-click drafts for re-engagement emails, personalized using the exact reason the client is at risk.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="reveal flex justify-center lg:justify-end" style={{ transitionDelay: '300ms' }}>
              <div className="w-full max-w-[500px] bg-white rounded-[32px] overflow-hidden shadow-2xl rotate-3 scale-105 border border-slate-100">
                 <div className="h-80 relative overflow-hidden">
                    <video 
                       autoPlay 
                       loop 
                       muted 
                       playsInline 
                       className="w-full h-full object-cover"
                    >
                       <source src={relationshipVideo} type="video/mp4" />
                    </video>
                 </div>
                 <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue">
                          <Activity size={18} />
                       </div>
                       <h4 className="font-bold text-navy">Predictive Retention Engine</h4>
                    </div>
                    <p className="text-sm text-text-2 leading-relaxed font-medium">
                      Relavo analyzes communication gaps, sentiment shifts, and financial erraticism to predict churn <span className="text-navy font-bold">14 days</span> before it happens.
                    </p>
                    <div className="pt-4 border-t border-border-dark flex justify-between items-center">
                       <span className="text-xs font-bold text-text-3 uppercase">Early Detection Protocol</span>
                       <span className="text-blue font-bold text-sm">How it works &rarr;</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>


      {/* Resources Section */}
      <section id="resources" className="py-24 md:py-40 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="reveal">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full border border-slate-200 text-xs font-bold uppercase tracking-wider mb-6">
                Knowledge Hub
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-navy mb-8 tracking-tight">Intelligence at your <span className="text-blue italic">fingertips.</span></h2>
              <p className="text-xl text-text-2 leading-relaxed font-medium mb-12">Whether you need to integrate your existing stack or learn about AI-driven relationship management, our resources are designed to help you grow.</p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <a href="#" className="group relative rounded-[32px] bg-white border border-slate-100 hover:border-blue/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img src={cardIntegrations} alt="Integrations" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                  <div className="p-8 pt-4 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <h4 className="text-2xl font-black text-navy mb-3 tracking-tight group-hover:text-blue transition-colors">Integration Library</h4>
                      <p className="text-text-2 font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">Connect Gmail, Slack, Stripe and 50+ other tools in minutes.</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue">Explore Integrations</span>
                      <ArrowRight size={16} className="text-blue opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </div>
                  </div>
                </a>

                <a href="#" className="group relative rounded-[32px] bg-white border border-slate-100 hover:border-blue/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden shrink-0">
                    <img src={cardAi} alt="API Docs" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  </div>
                  <div className="p-8 pt-4 flex-1 flex flex-col justify-between relative z-10">
                    <div>
                      <h4 className="text-2xl font-black text-navy mb-3 tracking-tight group-hover:text-blue transition-colors">API Documentation</h4>
                      <p className="text-text-2 font-medium leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">Build custom automation using our robust REST API endpoints.</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy">Read Docs</span>
                      <ArrowRight size={16} className="text-navy opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </div>
                  </div>
                </a>
              </div>
            </div>
            
            <div className="reveal group relative" style={{ transitionDelay: '200ms' }}>
               {/* Premium Card Glow */}
               <div className="absolute -inset-1 bg-gradient-to-r from-blue to-indigo-600 rounded-[44px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
               
               <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col rounded-[40px] overflow-hidden shadow-2xl h-full border border-slate-700/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue/10 blur-[100px] pointer-events-none" />
                
                <div className="p-12 space-y-10 relative z-10 flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 bg-blue rounded-full animate-pulse" />
                       <h5 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">Featured Asset</h5>
                    </div>
                    <span className="bg-blue/10 text-blue font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-blue/20">v2.0 Update</span>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter">
                      The Modern Agency Guide to <span className="text-blue">Retention.</span>
                    </h3>
                    <p className="text-xl text-white/50 font-medium leading-relaxed max-w-[400px]">
                      Download our 42-page blueprint on how AI shifts relationship monitoring from reactive to predictive.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button className="w-full bg-blue hover:bg-blue-400 text-white rounded-2xl py-5 text-xl font-black tracking-tight group/btn shadow-xl shadow-blue/20 transition-all">
                       <span className="relative z-10 flex items-center justify-center gap-2">
                         Download Playbook 
                         <ArrowRight size={20} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                       </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-48 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto text-center reveal">
           <div className="flex items-center justify-center text-blue mx-auto mb-12">
              <Logo className="h-12" showText={false} />
           </div>
           <h2 className="text-6xl md:text-8xl font-black text-navy mb-10 tracking-tighter leading-[0.9]">
             Stop losing revenue to <br /> <span className="text-blue">silent churn.</span>
           </h2>
           <p className="text-2xl text-text-2 mb-12 font-medium max-w-[700px] mx-auto leading-relaxed">
             Join the waitlist of 200+ growth-focused agencies and small businesses.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="bg-blue hover:bg-[#2563eb] text-white rounded-2xl font-black text-xl py-5 px-12 shadow-2xl shadow-blue/30 flex items-center justify-center transition-all hover:scale-[1.03]">Get Early Access</Link>
              <button className="bg-white hover:bg-slate-50 text-navy border-[3px] border-slate-200 rounded-2xl font-black w-full sm:w-auto py-5 px-12 text-xl transition-all hover:border-slate-300 shadow-sm">Book a Demo</button>
           </div>
           <p className="mt-12 text-text-3 font-bold text-sm">No credit card required. Launching Q2 2026.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-slate-950 pt-32 pb-12 px-6 overflow-hidden">
         {/* Ambient Glows */}
         <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue/10 blur-[120px] rounded-full pointer-events-none" />
         <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

         <div className="max-w-[1400px] mx-auto relative z-10">
            <div className="grid lg:grid-cols-5 gap-16 mb-24">
               {/* Brand Column */}
               <div className="lg:col-span-2 space-y-8">
                  <Logo className="h-8 brightness-0 invert" />
                  <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-[320px]">
                    The AI-powered health monitoring layer for your small business client relationships.
                  </p>
               </div>

               {/* Links Columns */}
               <div className="grid grid-cols-2 lg:grid-cols-3 lg:col-span-3 gap-12">
                  <div className="space-y-8">
                     <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Product</h5>
                     <ul className="space-y-4">
                        {['Features', 'Integrations', 'AI Engine', 'Waitlist'].map(link => (
                          <li key={link}>
                            <a href="#" className="text-slate-400 font-medium hover:text-blue transition-colors flex items-center group">
                              {link}
                              <ArrowRight size={12} className="ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </a>
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Platform</h5>
                     <ul className="space-y-4">
                        {['Success Stories', 'Knowledge Hub', 'Documentation', 'API Reference'].map(link => (
                          <li key={link}>
                            <a href="#" className="text-slate-400 font-medium hover:text-white transition-colors flex items-center group">
                              {link}
                            </a>
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="space-y-8">
                    <h5 className="text-white font-black uppercase tracking-[0.2em] text-xs">Company</h5>
                    <ul className="space-y-4">
                       {['Our Mission', 'Careers', 'Contact', 'Privacy Policy'].map(link => (
                         <li key={link}>
                           <a href="#" className="text-slate-400 font-medium hover:text-white transition-colors">
                             {link}
                           </a>
                         </li>
                       ))}
                    </ul>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-6">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 relavo inc.</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay, color, image }) => {
  const colorMap = {
    blue: "from-blue-500/10 to-blue-600/5 text-blue-600 border-blue-200/30",
    indigo: "from-indigo-500/10 to-indigo-600/5 text-indigo-600 border-indigo-200/30",
    emerald: "from-emerald-500/10 to-emerald-600/5 text-emerald-600 border-emerald-200/30",
    rose: "from-rose-500/10 to-rose-600/5 text-rose-600 border-rose-200/30",
    amber: "from-amber-500/10 to-amber-600/5 text-amber-600 border-amber-200/30",
    violet: "from-violet-500/10 to-violet-600/5 text-violet-600 border-violet-200/30",
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div 
      className="group relative reveal overflow-hidden bg-white border border-slate-100 rounded-[32px] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:-translate-y-2 flex flex-col h-full" 
      style={{ transitionDelay: delay }}
    >
      {/* HD Image Header */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>
      
      <div className="relative z-10 p-10 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-navy tracking-tight group-hover:text-blue transition-colors">
              {title}
            </h3>
            <ArrowRight size={20} className="text-blue opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
          </div>
          <p className="text-text-2 font-medium leading-relaxed text-lg opacity-80 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        </div>

        {/* Bottom Detail */}
        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full bg-current ${scheme.split(' ')[2]}`} />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-3">Relavo Core Engine</span>
        </div>
      </div>

      {/* Decorative Background Mesh */}
      <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${scheme.split(' ').slice(0, 2).join(' ')} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
    </div>
  );
};

const Mail = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const Sparkles = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default LandingPage;

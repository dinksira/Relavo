import React from 'react';
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

const LandingPage = () => {
  useRevealOnScroll();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-relavo-blue/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between glass px-8 py-3 rounded-full border-white/40">
          <Logo className="h-7" />
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-relavo-navy">
            <a href="#features" className="hover:text-relavo-blue transition-colors">Features</a>
            <a href="#ai-logic" className="hover:text-relavo-blue transition-colors">AI Engine</a>
            <a href="#pricing" className="hover:text-relavo-blue transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-relavo-navy hover:text-relavo-blue pr-2 cursor-pointer transition-colors">Log in</Link>
            <Link to="/login" className="btn-premium px-6 py-2.5 text-sm">
              Start Building <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Abstract AI pulse" 
            className="w-full h-full object-cover opacity-100 mix-blend-multiply"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        <div className="max-w-[1400px] mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 bg-relavo-blueLight/50 text-relavo-blue px-4 py-1.5 rounded-full border border-relavo-blue/10 text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={14} className="animate-pulse" /> AI-Powered Relationship Health
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-relavo-navy mb-8 tracking-tighter leading-[0.95]">
              Don't lose clients <br />
              <span className="text-relavo-blue gradient-text">silently.</span>
            </h1>
            <p className="text-xl md:text-2xl text-relavo-text-secondary leading-relaxed max-w-[600px] mb-10 font-medium">
              Relavo monitors 12+ health signals to detect at-risk clients <span className="text-relavo-navy font-bold italic">before they churn.</span> It's the early warning system your agency needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/login" className="btn-premium w-full sm:w-auto text-lg scale-110">
                Get Early Access <ArrowRight size={20} />
              </Link>
              <div className="flex -space-x-3 items-center">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
                <span className="text-sm text-relavo-text-muted font-bold ml-6">Trusted by 200+ Agencies</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative reveal" style={{ transitionDelay: '200ms' }}>
             <div className="relative glass p-4 rounded-[32px] border-white/50 shadow-2xl animate-float">
                <div className="bg-relavo-navy rounded-[24px] overflow-hidden aspect-video relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-relavo-blue/20 to-transparent p-12">
                      <div className="flex justify-between items-start mb-12">
                        <div className="space-y-2">
                           <div className="h-2 w-32 bg-white/20 rounded-full" />
                           <div className="h-6 w-48 bg-white/40 rounded-full" />
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-relavo-danger flex items-center justify-center text-white font-black text-xl">
                           32%
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-relavo-danger w-[32%] rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                        </div>
                        <div className="flex justify-between text-white/40 text-[10px] uppercase font-bold tracking-widest">
                           <span>At Risk</span>
                           <span>Last Contact: 9 Days Ago</span>
                        </div>
                      </div>
                      <div className="mt-12 bg-white/5 border border-white/10 p-6 rounded-[20px] backdrop-blur-lg">
                        <div className="flex gap-4 items-center mb-4">
                           <Sparkles size={20} className="text-relavo-blue" />
                           <div className="h-2 w-24 bg-white/20 rounded-full" />
                        </div>
                        <div className="space-y-2 opacity-50">
                           <div className="h-2 w-full bg-white/10 rounded-full" />
                           <div className="h-2 w-[80%] bg-white/10 rounded-full" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
             {/* Decorative Elements */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-relavo-blue/20 blur-[80px] rounded-full" />
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-relavo-danger/10 blur-[100px] rounded-full" />
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section id="features" className="py-24 md:py-40 px-6">
        <div className="max-w-[1400px] mx-auto text-center reveal mb-20">
          <h2 className="text-5xl md:text-7xl font-bold text-relavo-navy mb-6 tracking-tight">Powerful enough for Enterprise. <br /> Built for <span className="text-relavo-blue italic">Small Teams.</span></h2>
          <p className="text-xl text-relavo-text-secondary max-w-[800px] mx-auto font-medium">From real-time sentiment analysis to automated health scoring, Relavo gives you the tools usually reserved for unicorn companies.</p>
        </div>

        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           <FeatureCard 
             icon={Activity} 
             title="Real-time Health Scoring" 
             description="A proprietary weighted algorithm scoring every client from 0 to 100 every 24 hours based on communication, finances, and activity."
             delay="0ms"
           />
           <FeatureCard 
             icon={MessageCircle} 
             title="AI Insight Generation" 
             description="Stop reading logs. Our Claude-powered engine translates complex data patterns into 3-sentence plain English summaries."
             delay="100ms"
           />
           <FeatureCard 
             icon={MousePointer2} 
             title="Smart Touchpoint Logger" 
             description="Log a call, meeting, or message in 2 seconds. Our system automatically correlates every touchpoint with client health."
             delay="200ms"
           />
           <FeatureCard 
             icon={BarChart3} 
             title="Revenue at Risk" 
             description="See exactly how much revenue is tied to your 'At Risk' clients. Prioritize your outreach by pure business impact."
             delay="300ms"
           />
           <FeatureCard 
             icon={ShieldCheck} 
             title="Sentiment Detection" 
             description="AI automatically scans the tone of recent interactions to flag frustration before it becomes an email complaint."
             delay="400ms"
           />
           <FeatureCard 
             icon={Globe} 
             title="Integration Library" 
             description="Connect your Gmail, Slack, and Stripe for a unified view of your relationship health without finger-pointing."
             delay="500ms"
           />
        </div>
      </section>

      {/* Showcase Section */}
      <section id="ai-logic" className="py-24 md:py-40 bg-relavo-navy relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={aiGlowImg} alt="AI analysis" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-relavo-navy via-transparent to-relavo-navy" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
           <div className="reveal">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Intelligence <br /><span className="text-relavo-blue">Informed </span> by Data.</h2>
              <div className="space-y-8">
                 <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-relavo-blue/20 rounded-2xl flex items-center justify-center text-relavo-blue shrink-0">
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
              <div className="w-full max-w-[500px] bg-white rounded-[32px] overflow-hidden shadow-2xl rotate-3 scale-105">
                 <img src={teamImg} alt="Team success" className="w-full h-80 object-cover" />
                 <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <ShieldCheck size={18} />
                       </div>
                       <h4 className="font-bold text-relavo-navy">Saved Relationship: Acme Corp</h4>
                    </div>
                    <p className="text-sm text-relavo-text-secondary leading-relaxed font-medium italic">
                      "Since implementing Relavo, we prevented 3 churns in our first month just by seeing the '9-day contact lag' alerts."
                    </p>
                    <div className="pt-4 border-t border-relavo-border flex justify-between items-center">
                       <span className="text-xs font-bold text-relavo-text-muted uppercase">Health improved +45%</span>
                       <span className="text-relavo-blue font-bold text-sm">Case Study &rarr;</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-48 px-6 bg-white">
        <div className="max-w-[1000px] mx-auto text-center reveal">
           <div className="w-20 h-20 bg-relavo-blue/10 rounded-3xl flex items-center justify-center text-relavo-blue mx-auto mb-10">
              <Logo className="h-6" showText={false} />
           </div>
           <h2 className="text-6xl md:text-8xl font-black text-relavo-navy mb-10 tracking-tighter leading-[0.9]">
             Stop losing revenue to <br /> <span className="text-relavo-blue">silent churn.</span>
           </h2>
           <p className="text-2xl text-relavo-text-secondary mb-12 font-medium max-w-[700px] mx-auto leading-relaxed">
             Join the waitlist of 200+ growth-focused agencies and small businesses.
           </p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/login" className="btn-premium w-full sm:w-auto text-xl py-5 px-12 scale-110">Get Early Access</Link>
              <button className="btn-premium-outline w-full sm:w-auto py-5 px-12 text-xl">Book a Demo</button>
           </div>
           <p className="mt-12 text-relavo-text-muted font-bold text-sm">No credit card required. Launching Q2 2026.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-relavo-surface pt-20 pb-10 px-6 border-t border-relavo-border">
         <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
               <Logo className="h-7 mb-6" />
               <p className="text-relavo-text-secondary max-w-[300px] font-medium leading-relaxed">
                 The AI-powered health monitoring layer for your small business client relationships.
               </p>
            </div>
            <div>
               <h5 className="font-bold text-relavo-navy mb-6">Product</h5>
               <ul className="space-y-4 text-sm font-medium text-relavo-text-secondary">
                  <li><a href="#" className="hover:text-relavo-blue">Features</a></li>
                  <li><a href="#" className="hover:text-relavo-blue">Integrations</a></li>
                  <li><a href="#" className="hover:text-relavo-blue">AI Service</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-relavo-navy mb-6">Company</h5>
               <ul className="space-y-4 text-sm font-medium text-relavo-text-secondary">
                  <li><a href="#" className="hover:text-relavo-blue">About</a></li>
                  <li><a href="#" className="hover:text-relavo-blue">Contact</a></li>
                  <li><a href="#" className="hover:text-relavo-blue">Blog</a></li>
               </ul>
            </div>
            <div>
               <h5 className="font-bold text-relavo-navy mb-6">Legal</h5>
               <ul className="space-y-4 text-sm font-medium text-relavo-text-secondary">
                  <li><a href="#" className="hover:text-relavo-blue">Privacy</a></li>
                  <li><a href="#" className="hover:text-relavo-blue">Terms</a></li>
               </ul>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto pt-10 border-t border-relavo-border flex justify-between items-center text-xs font-bold text-relavo-text-muted uppercase tracking-widest">
            <span>&copy; 2026 relavo inc.</span>
            <div className="flex gap-8">
               <a href="#" className="hover:text-relavo-blue">LinkedIn</a>
               <a href="#" className="hover:text-relavo-blue">Twitter</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div className="card-premium p-10 reveal flex flex-col gap-6" style={{ transitionDelay: delay }}>
    <div className="w-14 h-14 bg-relavo-blue/10 rounded-[20px] flex items-center justify-center text-relavo-blue shadow-sm">
      <Icon size={28} />
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-bold text-relavo-navy">{title}</h3>
      <p className="text-relavo-text-secondary font-medium leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const Mail = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const Sparkles = ({ className, size = 20 }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export default LandingPage;

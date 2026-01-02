import React, { useState, useEffect, useRef } from 'react';
import { EXPERIENCES, EDUCATION, GUEST_LECTURES, SKILLS, KEY_RESPONSIBILITIES, PROFILE_IMAGE } from './constants';
import SectionHeading from './components/SectionHeading';
import AIEnhancer from './components/AIEnhancer';
import { editImageWithAI } from './services/geminiService';

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // Profile Image State with Persistence
  const [profileImage, setProfileImage] = useState<string>(() => {
    const saved = localStorage.getItem('dr_praveena_profile_photo');
    return saved || PROFILE_IMAGE;
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Persistence side-effect
  useEffect(() => {
    if (profileImage && profileImage.startsWith('data:')) {
      localStorage.setItem('dr_praveena_profile_photo', profileImage);
    }
  }, [profileImage]);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle header background opacity/shadow
      setIsScrolled(window.scrollY > 50);
      
      // Detection logic for active section highlighting
      const sections = ['home', 'about', 'expertise', 'journey', 'academic', 'contact'];
      const scrollPosition = window.scrollY + 200; // Trigger point offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Defined navigation links with exact mapping to section IDs
  const navLinks = [
    { name: 'ABOUT', href: '#about', id: 'about' },
    { name: 'EXPERTISE', href: '#expertise', id: 'expertise' },
    { name: 'JOURNEY', href: '#journey', id: 'journey' },
    { name: 'ACADEMIC', href: '#academic', id: 'academic' },
    { name: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  // Programmatic scroll to ensure it works across all browsers/environments
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // Approximate height of the sticky nav
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIEditProfile = async () => {
    if (!profileImage || !editPrompt) return;
    setIsGenerating(true);
    setEditError(null);
    try {
      if (!profileImage.startsWith('data:')) {
        setEditError("Please upload your photo first to enable AI editing (local images only).");
        setIsGenerating(false);
        return;
      }

      const result = await editImageWithAI(profileImage, editPrompt);
      if (result) {
        setProfileImage(result);
        setIsEditingProfile(false);
        setEditPrompt("");
      } else {
        setEditError("AI returned no data. Try a different prompt.");
      }
    } catch (err) {
      setEditError("Failed to edit. Please check your AI configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation - Fixed at top */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')} className={`text-2xl transition-all duration-300 ${isScrolled ? 'text-emerald-theme' : 'text-white'}`}>
            <i className="fas fa-graduation-cap"></i>
          </a>
          
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8 lg:space-x-12">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`text-[11px] lg:text-[13px] font-bold uppercase tracking-[0.15em] transition-all relative group ${
                    isScrolled 
                      ? activeSection === link.id ? 'text-emerald-theme' : 'text-stone-600 hover:text-emerald-800' 
                      : activeSection === link.id ? 'text-white' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1.5 left-0 h-0.5 bg-current transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </a>
              ))}
            </div>
          </div>

          <button 
            className={`md:hidden text-2xl ${isScrolled ? 'text-emerald-theme' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-2xl absolute top-full left-0 right-0 p-8 flex flex-col space-y-6 border-t border-stone-100 animate-fade-in overflow-y-auto max-h-[80vh]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-bold tracking-widest border-b border-stone-50 pb-3 transition-colors ${
                  activeSection === link.id ? 'text-emerald-800' : 'text-stone-800'
                }`}
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative min-h-screen flex items-center overflow-hidden custom-gradient pt-20">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>
        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center py-12">
          <div className="text-white space-y-6 animate-fade-in order-2 md:order-1">
            <div className="inline-block px-4 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
              Academician & Administrator
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Dr. A. Praveena
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-emerald-50">
              Ph.D. in Chemistry | Senior Fellow | Professional Leader
            </p>
            <p className="max-w-xl text-lg text-emerald-100/80 leading-relaxed">
              Fostering environments where students achieve their intellectual, emotional, and social potential. 19+ years of expertise in higher education and administration.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="px-8 py-4 bg-white text-emerald-900 font-bold rounded-full hover:bg-stone-100 transition-all shadow-xl hover:-translate-y-1">
                View Portfolio
              </a>
              <div className="flex space-x-4 items-center">
                <a href="mailto:drpraveena2017@gmail.com" className="w-12 h-12 flex items-center justify-center bg-white/10 border border-white/30 rounded-full hover:bg-white hover:text-emerald-900 transition-all text-white">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center relative order-1 md:order-2">
            <div className="relative group w-full max-w-sm">
              <div className="absolute -inset-4 border border-white/10 rounded-2xl rotate-3 transition-transform duration-500"></div>
              <div className="absolute -inset-4 border border-white/20 rounded-2xl -rotate-3 transition-transform duration-500"></div>
              <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl bg-white/10">
                <img 
                  src={profileImage} 
                  alt="Dr. A. Praveena" 
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
                
                {/* Profile Edit Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-3 p-4 z-30">
                  <button 
                    onClick={() => profileFileInputRef.current?.click()}
                    className="w-full max-w-[160px] py-2 bg-white text-emerald-900 rounded-lg font-bold text-sm hover:bg-stone-100 transition-colors shadow-lg"
                  >
                    Upload Photo
                  </button>
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full max-w-[160px] py-2 bg-emerald-theme text-white rounded-lg font-bold text-sm hover:bg-emerald-900 transition-colors shadow-lg"
                  >
                    AI Edit Photo
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={profileFileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleProfileUpload} 
                />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl z-30 hidden sm:block border border-stone-100">
                <p className="text-emerald-900 font-bold text-sm">19+ Years</p>
                <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-fade-in">
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">AI Profile Enhancer</h3>
            <p className="text-stone-600 text-sm mb-6">Describe how you'd like Gemini to update your portrait. (e.g., "Add a library background with soft lighting")</p>
            
            <textarea 
              className="w-full p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-800 outline-none h-32 mb-6"
              placeholder="Describe your transformation..."
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
            />

            {editError && <p className="text-red-500 text-xs mb-4">{editError}</p>}

            <div className="flex space-x-3">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="flex-1 py-3 border border-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAIEditProfile}
                disabled={isGenerating || !editPrompt}
                className="flex-1 py-3 bg-emerald-theme text-white font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-lg disabled:opacity-50"
              >
                {isGenerating ? 'Enhancing...' : 'Transform'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT Section */}
      <section id="about" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading 
            title="About Me" 
            subtitle="Dr. Praveena is a dedicated educator with a Ph.D. in Chemistry and a passion for student development."
          />
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2 space-y-6">
              <p className="text-lg text-stone-700 leading-relaxed">
                With over 19 years of experience in higher education, I have transitioned from a specialized researcher in Chemistry to a holistic leader in student affairs and district-level educational fellowship. My journey is defined by a commitment to academic excellence and institutional development.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {KEY_RESPONSIBILITIES.map((res, i) => (
                  <div key={i} className="flex items-center space-x-3 text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <i className="fas fa-check-circle text-emerald-theme"></i>
                    <span className="text-sm font-medium">{res}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-theme p-10 rounded-3xl text-white shadow-xl">
              <h4 className="text-xl font-bold mb-6 border-b border-white/20 pb-4 text-center">Key Professional Stats</h4>
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-4xl font-bold">19+</div>
                  <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1">Years in Education</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">5+</div>
                  <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1">Major Guest Lectures</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">PhD</div>
                  <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mt-1">Anna University</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISE Section */}
      <section id="expertise" className="py-24 bg-stone-50 scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading title="Core Expertise" subtitle="Professional skills cultivated through years of academic and administrative leadership." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SKILLS.map((skillGroup, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all hover:-translate-y-1">
                <h3 className="text-xl font-bold text-stone-900 mb-6 flex items-center">
                  <span className="w-1.5 h-6 bg-emerald-theme mr-3 rounded-full"></span>
                  {skillGroup.category}
                </h3>
                <ul className="space-y-3">
                  {skillGroup.items.map((skill, i) => (
                    <li key={i} className="text-stone-600 flex items-center space-x-2 text-sm">
                      <i className="fas fa-arrow-right text-[10px] text-emerald-theme"></i>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Photo Lab (Secondary Section) */}
      <AIEnhancer />

      {/* JOURNEY Section */}
      <section id="journey" className="py-24 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading title="Professional Journey" subtitle="Detailed roles and responsibilities over 19+ years of service." />
          <div className="max-w-4xl mx-auto space-y-12">
            {EXPERIENCES.map((exp, idx) => (
              <div key={idx} className="relative pl-12 border-l-2 border-stone-100 pb-12 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-theme shadow-[0_0_0_4px_rgba(5,150,105,0.1)]"></div>
                <div className="bg-stone-50 p-8 rounded-2xl hover:bg-stone-100 transition-colors border border-stone-100 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{exp.role}</h3>
                      <p className="text-emerald-800 font-medium">{exp.company}</p>
                    </div>
                    <span className="px-4 py-1 bg-white border border-stone-200 rounded-full text-xs font-bold text-stone-500 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {exp.responsibilities.map((task, i) => (
                      <li key={i} className="text-stone-600 text-sm leading-relaxed flex items-start space-x-3">
                        <i className="fas fa-circle text-[6px] mt-2 text-emerald-theme/50"></i>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACADEMIC Section */}
      <section id="academic" className="py-24 bg-stone-900 text-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading title="Academic Credentials" subtitle="Education background, certifications, and research milestones." light />
          <div className="max-w-4xl mx-auto grid gap-6">
            {EDUCATION.map((edu, idx) => (
              <div key={idx} className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-emerald-300 font-medium">{edu.institution}</p>
                  {edu.grade && <p className="text-white/60 text-sm italic">{edu.grade}</p>}
                </div>
                <div className="text-right">
                  <div className="text-white/40 text-sm font-bold uppercase tracking-widest">{edu.completionDate}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-24">
            <h3 className="text-2xl font-serif font-bold text-center mb-12">Invited Talks & Lectures</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GUEST_LECTURES.map((lecture, i) => (
                <div key={i} className="bg-emerald-theme/10 border border-emerald-theme/20 p-6 rounded-xl hover:translate-y-[-4px] transition-transform">
                  <div className="text-emerald-400 font-bold text-sm mb-2">{lecture.year}</div>
                  <h4 className="text-lg font-bold mb-2">{lecture.title}</h4>
                  <p className="text-white/60 text-sm">{lecture.context}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT Section */}
      <footer id="contact" className="py-24 bg-white border-t border-stone-100 scroll-mt-20">
        <div className="container mx-auto px-6">
          <SectionHeading title="Get In Touch" subtitle="Let's connect for academic collaborations or professional leadership opportunities." />
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-left mb-16">
            <div className="space-y-8">
              <h4 className="text-2xl font-serif font-bold text-stone-900">Contact Information</h4>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-theme/5 text-emerald-theme">
                    <i className="fas fa-envelope text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Email Address</p>
                    <a href="mailto:drpraveena2017@gmail.com" className="text-stone-800 font-semibold hover:text-emerald-700 transition-colors">
                      drpraveena2017@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-theme/5 text-emerald-theme">
                    <i className="fas fa-map-marker-alt text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Location</p>
                    <p className="text-stone-800 font-semibold">Tamil Nadu, India</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-theme/5 text-emerald-theme">
                    <i className="fab fa-linkedin-in text-xl"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Professional Profile</p>
                    <a href="#" className="text-stone-800 font-semibold hover:text-emerald-700 transition-colors">
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simple Contact Form Placeholder */}
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <input type="text" placeholder="Your Name" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-800" />
                </div>
                <div>
                  <input type="email" placeholder="Your Email" className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-800" />
                </div>
                <div>
                  <textarea placeholder="Your Message" rows={4} className="w-full p-4 bg-white border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-800 resize-none"></textarea>
                </div>
                <button className="w-full py-4 bg-emerald-theme text-white font-bold rounded-xl shadow-lg hover:bg-emerald-900 transition-all">
                  Send Message
                </button>
              </form>
            </div>
          </div>
          
          <div className="text-center pt-12 border-t border-stone-100">
            <div className="text-3xl font-serif font-bold text-emerald-theme mb-6">
              Dr. A. Praveena
            </div>
            <p className="text-stone-400 text-sm font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Dr. A. Praveena. Professional Academic Portfolio. 19+ Years of Excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
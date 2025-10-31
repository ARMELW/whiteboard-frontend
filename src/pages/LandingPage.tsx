import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import {
  Sparkles,
  Video,
  Wand2,
  Zap,
  Users,
  Globe,
  ArrowRight,
  Check,
  Play,
  Palette,
  Music,
  Image as ImageIcon,
  PenTool,
  Pencil,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: PenTool,
      title: 'Dessinez vos idées',
      description:
        'Transformez vos concepts en animations doodle captivantes avec notre éditeur intuitif de type whiteboard.',
    },
    {
      icon: Wand2,
      title: 'IA créative',
      description:
        'Notre IA génère des illustrations, voix-off et musiques qui donnent vie à vos doodles.',
    },
    {
      icon: Palette,
      title: 'Styles artistiques',
      description:
        'Explorez une bibliothèque de styles sketch, hand-drawn et doodle pour personnaliser vos créations.',
    },
    {
      icon: Music,
      title: 'Audio immersif',
      description:
        'Synchronisez parfaitement voix, musique et effets sonores avec vos animations dessinées.',
    },
    {
      icon: Pencil,
      title: 'Animations fluides',
      description:
        'Créez des effets de dessin progressif, de révélation et de tracé automatique en quelques clics.',
    },
    {
      icon: Zap,
      title: 'Export instantané',
      description:
        'Exportez vos vidéos doodle en haute qualité, prêtes à être partagées sur tous vos canaux.',
    },
  ];

  const useCases = [
    {
      icon: Users,
      title: 'Explainer Videos',
      description: 'Créez des vidéos explicatives engageantes qui captivent votre audience.',
    },
    {
      icon: Globe,
      title: 'Formation & E-learning',
      description: 'Rendez vos contenus éducatifs mémorables avec des animations doodle.',
    },
    {
      icon: Play,
      title: 'Contenus viraux',
      description: 'Produisez des vidéos doodle percutantes pour réseaux sociaux et YouTube.',
    },
  ];

  const benefits = [
    'Interface créative, pensée pour les artistes et non-artistes',
    'Bibliothèque d\'illustrations et d\'assets dessinés à la main',
    'Effets de dessin progressif et animations fluides',
    'Templates doodle professionnels prêts à l\'emploi',
    'Synchronisation audio-visuelle parfaite',
    'Export en qualité studio, sans limite',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-blue-50/20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Doodle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <svg className="absolute top-20 left-10 w-32 h-32 text-amber-400/20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
            <path d="M 30 50 Q 40 30, 50 50 T 70 50" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <svg className="absolute top-40 right-20 w-40 h-40 text-blue-400/15 rotate-12" viewBox="0 0 100 100">
            <path d="M 10 50 L 30 30 L 50 50 L 70 20 L 90 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="30" cy="30" r="3" fill="currentColor" />
            <circle cx="70" cy="20" r="3" fill="currentColor" />
          </svg>
          <svg className="absolute bottom-40 left-1/4 w-24 h-24 text-purple-400/20 -rotate-12" viewBox="0 0 100 100">
            <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" rx="10" />
            <path d="M 35 50 L 50 35 L 65 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white border-2 border-dashed border-amber-400/40 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 mr-2" />
              <span className="text-sm font-medium text-amber-700">
                Votre espace créatif pour vidéos doodle
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Dessinez vos histoires,
              <br />
              <span 
                className="bg-gradient-to-r from-amber-600 via-orange-500 to-pink-600 bg-clip-text text-transparent"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              >
                animez vos idées
              </span>
            </h1>

            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Doodlio transforme vos concepts en <span className="font-semibold text-amber-700">vidéos doodle captivantes</span>.
              Créez des animations whiteboard, explainer videos et contenus visuels uniques avec notre
              plateforme pensée pour les créatifs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all border-2 border-amber-600/20"
              >
                Commencer à créer
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/subscription')}
                className="px-8 py-6 text-lg border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50"
              >
                <Play className="mr-2 w-5 h-5" />
                Voir des exemples
              </Button>
            </div>

            <p className="text-sm text-gray-600 flex items-center justify-center gap-4 flex-wrap">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Gratuit pour commencer
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Aucune carte requise
              </span>
            </p>
          </div>

          {/* Hero Image/Video Placeholder with Doodle Style */}
          <div className="mt-16 relative">
            <div 
              className="aspect-video bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-900 relative"
              role="img"
              aria-label="Aperçu de l'interface de création doodle Doodlio"
              style={{ 
                boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 relative">
                {/* Sketch Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="text-center relative z-10">
                  <div className="relative inline-block">
                    <Video className="w-24 h-24 text-amber-600 mx-auto mb-4" strokeWidth={2} />
                    <svg className="absolute -top-2 -right-2 w-8 h-8 text-orange-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p 
                    className="text-2xl text-gray-700 font-medium"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    Votre canvas créatif
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Dessinez • Animez • Partagez
                  </p>
                </div>

                {/* Decorative doodle elements */}
                <svg className="absolute top-8 left-8 w-16 h-16 text-amber-400/30" viewBox="0 0 50 50">
                  <path d="M 5 25 Q 15 15, 25 25 T 45 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="5" cy="25" r="2" fill="currentColor" />
                  <circle cx="45" cy="25" r="2" fill="currentColor" />
                </svg>
                <svg className="absolute bottom-8 right-8 w-20 h-20 text-blue-400/30" viewBox="0 0 50 50">
                  <path d="M 10 40 L 20 20 L 30 35 L 40 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="20" cy="20" r="2" fill="currentColor" />
                  <circle cx="30" cy="35" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
            
            {/* Hand-drawn style decorative elements */}
            <div className="absolute -top-8 -left-8 pointer-events-none" aria-hidden="true">
              <svg className="w-24 h-24 text-amber-400 opacity-60" viewBox="0 0 100 100">
                <path d="M 20 50 Q 30 20, 50 50 Q 70 80, 80 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="5,5" />
                <circle cx="20" cy="50" r="4" fill="currentColor" />
                <circle cx="80" cy="50" r="4" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute -bottom-8 -right-8 pointer-events-none" aria-hidden="true">
              <svg className="w-32 h-32 text-orange-400 opacity-50" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                <path d="M 50 15 L 50 85 M 15 50 L 85 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/30 relative">
        {/* Subtle background doodles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20" aria-hidden="true">
          <svg className="absolute top-10 right-10 w-24 h-24 text-amber-400" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4" />
          </svg>
          <svg className="absolute bottom-20 left-20 w-32 h-32 text-orange-400" viewBox="0 0 100 100">
            <path d="M 20 80 L 50 20 L 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <svg className="w-16 h-16 text-amber-500 mx-auto" viewBox="0 0 50 50" fill="none">
                <path d="M 15 25 Q 20 15, 25 25 Q 30 35, 35 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="25" r="2" fill="currentColor" />
                <circle cx="35" cy="25" r="2" fill="currentColor" />
              </svg>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              Tous les outils pour créer
            </h2>
            <p className="text-xl text-gray-700">
              Une boîte à outils complète pour donner vie à vos doodles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl hover:shadow-lg transition-all border-3 border-gray-900 relative group"
                  style={{ 
                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px, -2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0, 0)';
                    e.currentTarget.style.boxShadow = '4px 4px 0px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Decorative corner doodle */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 pointer-events-none">
                    <svg viewBox="0 0 30 30" className="text-amber-400">
                      <circle cx="15" cy="15" r="10" fill="currentColor" opacity="0.3" />
                      <circle cx="15" cy="15" r="3" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 border-2 border-amber-400/30 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-amber-700" strokeWidth={2} />
                  </div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        {/* Background doodle pattern */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 1000 1000">
            <defs>
              <pattern id="doodle-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <path d="M 20 20 Q 40 10, 60 20" stroke="currentColor" fill="none" strokeWidth="2" />
                <circle cx="80" cy="80" r="15" stroke="currentColor" fill="none" strokeWidth="2" />
                <path d="M 120 120 L 140 140 M 120 140 L 140 120" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#doodle-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
            >
              Parfait pour tous vos projets créatifs
            </h2>
            <p className="text-xl text-gray-700">
              Des entrepreneurs aux éducateurs, en passant par les créateurs de contenu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50 border-3 border-dashed border-amber-400/40 relative group hover:border-amber-500/60 transition-all"
                >
                  {/* Sketch-style corner accent */}
                  <svg className="absolute top-2 left-2 w-12 h-12 text-amber-400/40 group-hover:text-amber-500/60 transition-colors" viewBox="0 0 50 50">
                    <path d="M 5 5 L 15 5 M 5 5 L 5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute top-2 right-2 w-12 h-12 text-amber-400/40 group-hover:text-amber-500/60 transition-colors" viewBox="0 0 50 50">
                    <path d="M 45 5 L 35 5 M 45 5 L 45 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>

                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md border-2 border-gray-900 relative group-hover:scale-105 transition-transform"
                    style={{ boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.1)' }}
                  >
                    <Icon className="w-10 h-10 text-amber-600" strokeWidth={2} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full"></div>
                  </div>
                  <h3 
                    className="text-2xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    {useCase.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              >
                Pourquoi les créatifs adorent Doodlio
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Rejoignez des milliers d'artistes, marketeurs et éducateurs qui transforment
                leurs idées en <span className="font-bold text-amber-700">animations doodle captivantes</span>.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mr-3 mt-0.5 border-2 border-amber-400/40 group-hover:border-amber-500 transition-colors">
                      <Check className="w-4 h-4 text-amber-700" strokeWidth={3} />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Main illustration container with sketch style */}
              <div 
                className="aspect-square bg-white rounded-3xl shadow-xl border-4 border-gray-900 flex items-center justify-center relative overflow-hidden"
                role="img"
                aria-label="Illustration de l'univers créatif Doodlio"
                style={{ 
                  boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50"></div>
                
                {/* Doodle elements */}
                <div className="relative z-10 text-center p-8">
                  <div className="relative inline-block mb-6">
                    <Sparkles className="w-32 h-32 text-amber-600 mx-auto" strokeWidth={2} />
                    {/* Orbiting elements */}
                    <svg className="absolute -top-4 -right-4 w-12 h-12 text-orange-500" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="8" fill="currentColor" />
                      <path d="M 15 25 Q 20 15, 25 25 Q 30 35, 35 25" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <svg className="absolute -bottom-4 -left-4 w-10 h-10 text-pink-500" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="25" cy="25" r="3" fill="currentColor" />
                    </svg>
                  </div>
                  <p 
                    className="text-3xl text-gray-800 font-bold mb-2"
                    style={{ fontFamily: "'Kalam', cursive" }}
                  >
                    Créativité illimitée
                  </p>
                  <div className="flex items-center justify-center gap-2 text-amber-700">
                    <Pencil className="w-5 h-5" />
                    <span className="text-sm font-medium">Draw • Animate • Share</span>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <svg className="absolute top-4 left-4 w-16 h-16 text-amber-400/40" viewBox="0 0 50 50">
                  <path d="M 5 5 L 15 5 L 15 15 M 5 5 L 15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <svg className="absolute bottom-4 right-4 w-20 h-20 text-orange-400/40" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 25 10 L 25 40 M 10 25 L 40 25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>

              {/* Floating doodle accents */}
              <svg className="absolute -top-6 -left-6 w-16 h-16 text-amber-500 opacity-60 animate-pulse" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="currentColor" opacity="0.3" />
                <path d="M 10 25 Q 17.5 15, 25 25 T 40 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <svg className="absolute -bottom-4 -right-6 w-20 h-20 text-orange-500 opacity-50" viewBox="0 0 50 50">
                <path d="M 10 40 L 25 10 L 40 40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div 
            className="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500 rounded-3xl p-12 shadow-2xl border-4 border-gray-900 relative overflow-hidden"
            style={{ 
              boxShadow: '10px 10px 0px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Background doodle pattern */}
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                <path d="M 50 50 Q 100 30, 150 50" stroke="white" fill="none" strokeWidth="3" />
                <circle cx="300" cy="100" r="30" stroke="white" fill="none" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M 80 300 L 120 300 L 100 260 Z" stroke="white" fill="none" strokeWidth="3" />
                <path d="M 280 320 Q 320 300, 350 320" stroke="white" fill="none" strokeWidth="3" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-block mb-4">
                <svg className="w-16 h-16 text-white mx-auto" viewBox="0 0 50 50">
                  <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 15 25 L 35 25 M 25 15 L 25 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              
              <h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              >
                Prêt à dessiner votre histoire ?
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Lancez-vous dans la création de vidéos doodle dès maintenant.<br />
                C'est gratuit, simple et aucune carte bancaire n'est nécessaire.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/signup')}
                  className="bg-white hover:bg-gray-100 text-amber-700 px-8 py-6 text-lg font-bold border-3 border-gray-900 shadow-lg hover:shadow-xl transition-all"
                  style={{ 
                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Commencer à créer
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/pricing')}
                  className="border-3 border-white text-white hover:bg-white hover:text-amber-700 px-8 py-6 text-lg font-bold transition-all"
                >
                  Découvrir les tarifs
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Essai gratuit
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Sans engagement
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white relative overflow-hidden">
        {/* Subtle doodle accents in footer */}
        <div className="absolute inset-0 pointer-events-none opacity-5" aria-hidden="true">
          <svg className="absolute top-10 right-20 w-32 h-32" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
          <svg className="absolute bottom-10 left-20 w-24 h-24" viewBox="0 0 100 100">
            <path d="M 20 50 Q 40 30, 60 50 T 100 50" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center border-2 border-white/20"
                  style={{ boxShadow: '3px 3px 0px rgba(255, 255, 255, 0.1)' }}
                >
                  <Pencil className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <span 
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  Doodlio
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Votre canvas créatif pour des vidéos doodle exceptionnelles
              </p>
              <div className="mt-4 flex items-center gap-2 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Made with creativity</span>
              </div>
            </div>
            <div>
              <h4 
                className="font-bold mb-4 text-amber-400"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                Produit
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#docs" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-bold mb-4 text-amber-400"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                Entreprise
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-bold mb-4 text-amber-400"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                Légal
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#privacy" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-amber-400 transition-colors"></span>
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 50 50">
                <path d="M 10 25 Q 20 15, 30 25 Q 40 35, 45 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="10" cy="25" r="2" fill="currentColor" />
                <circle cx="45" cy="25" r="2" fill="currentColor" />
              </svg>
            </div>
            <p className="text-gray-400">
              &copy; 2025 Doodlio. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Créé avec <span className="text-red-400">❤</span> pour les créatifs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

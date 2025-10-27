import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { useAuthRedirect } from '@/app/auth';
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
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  useAuthRedirect();

  const features = [
    {
      icon: Video,
      title: 'Création vidéo intuitive',
      description:
        'Créez des vidéos professionnelles en quelques clics avec notre éditeur visuel simple et puissant.',
    },
    {
      icon: Wand2,
      title: 'IA générative',
      description:
        'Générez automatiquement des scripts, images, voix et musiques avec notre IA avancée.',
    },
    {
      icon: Palette,
      title: 'Templates personnalisables',
      description:
        'Choisissez parmi des centaines de templates professionnels et personnalisez-les à votre marque.',
    },
    {
      icon: Music,
      title: 'Bibliothèque audio',
      description:
        'Accédez à une vaste bibliothèque de musiques et d\'effets sonores libres de droits.',
    },
    {
      icon: ImageIcon,
      title: 'Assets illimités',
      description:
        'Téléchargez et gérez vos images, vidéos et autres ressources sans limite.',
    },
    {
      icon: Zap,
      title: 'Export ultra-rapide',
      description:
        'Exportez vos vidéos en HD, Full HD ou 4K en quelques minutes seulement.',
    },
  ];

  const useCases = [
    {
      icon: Users,
      title: 'Marketing & Communication',
      description: 'Créez des vidéos marketing impactantes pour vos campagnes.',
    },
    {
      icon: Globe,
      title: 'Éducation & Formation',
      description: 'Produisez du contenu éducatif engageant pour vos apprenants.',
    },
    {
      icon: Play,
      title: 'YouTube & Réseaux sociaux',
      description: 'Générez du contenu viral pour toutes les plateformes.',
    },
  ];

  const benefits = [
    'Interface intuitive, aucune compétence technique requise',
    'Collaboration en temps réel avec votre équipe',
    'Exports illimités en haute qualité',
    'Support prioritaire 7j/7',
    'Mises à jour régulières et nouvelles fonctionnalités',
    'Stockage cloud sécurisé',
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-600">
                Créez des vidéos professionnelles avec l'IA
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transformez vos idées en
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                vidéos captivantes
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Doodlio est la plateforme tout-en-un pour créer, éditer et exporter des vidéos
              professionnelles en quelques minutes. Alimentée par l'intelligence artificielle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/demo/subscription')}
                className="px-8 py-6 text-lg"
              >
                <Play className="mr-2 w-5 h-5" />
                Voir la démo
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              ✨ Aucune carte bancaire requise • 🎁 Essai gratuit de 14 jours
            </p>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="mt-16 relative">
            <div 
              className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
              role="img"
              aria-label="Aperçu de l'interface de l'éditeur vidéo Doodlio"
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    Aperçu de l'éditeur vidéo
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-gray-600">
              Des fonctionnalités puissantes pour créer des vidéos exceptionnelles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pour tous vos besoins
            </h2>
            <p className="text-xl text-gray-600">
              Que vous soyez entrepreneur, éducateur ou créateur de contenu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pourquoi choisir Doodlio ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rejoignez des milliers de créateurs qui font confiance à Doodlio pour
                transformer leurs idées en vidéos exceptionnelles.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div 
                className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center"
                role="img"
                aria-label="Illustration des fonctionnalités de Doodlio"
              >
                <div className="text-center">
                  <Sparkles className="w-32 h-32 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Illustration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à créer votre première vidéo ?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Commencez gratuitement dès aujourd'hui. Aucune carte bancaire requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-6 text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Voir les tarifs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Doodlio</span>
              </div>
              <p className="text-gray-400">
                Créez des vidéos professionnelles avec l'IA
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#docs" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    À propos
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-white transition-colors">
                    Carrières
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Doodlio. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

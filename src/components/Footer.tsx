import { Brain, Linkedin, Twitter, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-xl font-semibold text-white">Deep Thinkers</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transforming businesses through AI innovation, expert consulting, and
              end-to-end application development.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="hover:text-white transition-colors">AI Consulting</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">App Development</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Data Science</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Data Engineering</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Deep Thinkers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import {
  Code,
  Brain,
  Database,
  BarChart3,
  Smartphone,
  Server
} from 'lucide-react';

const services = [
  {
    icon: Brain,
    title: 'AI Consulting',
    description: 'Strategic AI advisory to help you identify opportunities and build a roadmap for AI integration in your business.',
  },
  {
    icon: Code,
    title: 'End-to-End App Development',
    description: 'Full-stack application development from concept to deployment, built with modern technologies and best practices.',
  },
  {
    icon: Smartphone,
    title: 'Web & Mobile UI',
    description: 'Beautiful, responsive user interfaces for web and mobile platforms that provide exceptional user experiences.',
  },
  {
    icon: Server,
    title: 'Backend Development',
    description: 'Robust, scalable backend systems with APIs, databases, and cloud infrastructure that power your applications.',
  },
  {
    icon: BarChart3,
    title: 'Data Science',
    description: 'Advanced analytics, machine learning models, and insights to help you make data-driven decisions.',
  },
  {
    icon: Database,
    title: 'Data Engineering',
    description: 'Build and maintain data pipelines, warehouses, and infrastructure for efficient data processing and storage.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive AI and software development solutions tailored to your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors">
                  <Icon className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

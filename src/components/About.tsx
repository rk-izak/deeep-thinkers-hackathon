import { Target, Users, Lightbulb, Award } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We are committed to helping businesses leverage AI to solve real problems and create value.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our team consists of experienced AI researchers, data scientists, and software engineers.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We stay ahead of the curve, implementing cutting-edge technologies and methodologies.',
  },
  {
    icon: Award,
    title: 'Quality Focused',
    description: 'We deliver production-ready solutions with high standards for code quality and performance.',
  },
];

export function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-6">
              Why Choose Deep Thinkers?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We are a team of passionate AI and software development professionals dedicated to
              transforming businesses through intelligent technology solutions.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From initial consultation to final deployment, we work closely with our clients to
              understand their unique challenges and deliver tailored solutions that drive measurable results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

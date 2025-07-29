// components/parts/Features/About.tsx
import React, { forwardRef } from 'react';
import { Users, Target, Heart, Zap } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const About = forwardRef<HTMLDivElement>((props, ref) => {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Building meaningful connections through exceptional event experiences that bring people together and create lasting memories.",
    },
    {
      icon: Target,
      title: "Innovation Driven",
      description: "Constantly evolving our platform with cutting-edge technology to deliver the best event management solutions.",
    },
    {
      icon: Heart,
      title: "Passion Led",
      description: "Dedicated to creating memorable moments that matter, with attention to every detail that makes events special.",
    },
    {
      icon: Zap,
      title: "Results Focused",
      description: "Delivering measurable success for every event through data-driven insights and powerful analytics tools.",
    },
  ];

  const stats = [
    { label: 'Events Hosted', value: '10K+' },
    { label: 'Happy Users', value: '50K+' },
    { label: 'Team Members', value: '100+' },
    { label: 'Countries', value: '30+' },
  ];

  return (
    <section 
      ref={ref}
      className="py-24 px-4 bg-muted/20"
    >
      <div className="container max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 section-header">
          <Badge variant="secondary" className="mb-4">
            About Us
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Transforming Events with{' '}
            <span className="text-muted-foreground">
              Innovation
            </span>
          </h2>
          
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground leading-relaxed">
            At EVENZIA, we&apos;re passionate about creating meaningful connections through 
            exceptional event experiences. Our platform combines cutting-edge technology 
            with intuitive design to make event management seamless and engaging.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 values-grid">
          {values.map((value, index) => (
            <Card
              key={index}
              className="group h-full border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-500 hover:shadow-lg hover:-translate-y-1 value-card"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors duration-300 mb-6">
                  {React.createElement(value.icon, {
                    className: "w-7 h-7 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  })}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-foreground/90 transition-colors">
                  {value.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats section */}
        <Card className="border-0 bg-background/60 backdrop-blur-sm stats-card">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Our Impact
              </h3>
              <p className="text-muted-foreground">
                Numbers that reflect our commitment to excellence
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center p-4 rounded-lg bg-muted/20 stat-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mission statement */}
        <div className="mt-16 text-center mission-statement">
          <Card className="border-0 bg-background/40 backdrop-blur-sm">
            <CardContent className="p-8">
              <blockquote className="text-lg md:text-xl text-foreground/90 italic leading-relaxed max-w-4xl mx-auto">
                &quot;Our mission is to democratize event management by providing powerful, 
                accessible tools that enable anyone to create extraordinary experiences.&quot;
              </blockquote>
              <div className="mt-6 text-sm text-muted-foreground">
                — The EVENZIA Team
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInCard {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeInStagger {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          animation: fadeInUp 0.8s ease-out;
        }

        .values-grid {
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .value-card {
          animation: slideInCard 0.6s ease-out both;
        }

        .stats-card {
          animation: slideIn 0.8s ease-out 0.6s both;
        }

        .stat-item {
          animation: fadeInStagger 0.6s ease-out both;
        }

        .mission-statement {
          animation: slideIn 0.8s ease-out 0.9s both;
        }
      `}</style>
    </section>
  );
});

About.displayName = 'About';

export default About;
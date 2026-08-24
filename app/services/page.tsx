import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  FlaskConical, 
  Home as HomeIcon, 
  FileText, 
  Stethoscope, 
  Laptop, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone,
  ShieldCheck,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export const metadata = {
  title: "Healthcare Services | Bharosa Lab",
  description: "Explore laboratory tests, doorstep sample collection, verified digital reports, and qualified online doctor consultations.",
};

interface ServiceItem {
  id: string;
  title: string;
  icon: any;
  iconColor: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isExternal: boolean;
}

const servicesList: ServiceItem[] = [
  {
    id: "diagnostic-lab-tests",
    title: "Diagnostic Laboratory Tests",
    icon: FlaskConical,
    iconColor: "text-teal-600 bg-teal-50 border-teal-100",
    description: "Discover available diagnostic tests and book laboratory services directly through the Bharosa Lab platform. Access a broad spectrum of pathology tests offered by verified partner laboratories.",
    features: [
      "Search and browse common and specialized medical tests",
      "Compare diagnostic offerings across partner laboratories",
      "Transparent booking process through the mobile app",
      "Centralized appointment and test management"
    ],
    ctaText: "Book via Mobile App",
    ctaLink: "https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab",
    isExternal: true
  },
  {
    id: "home-sample-collection",
    title: "Home Sample Collection",
    icon: HomeIcon,
    iconColor: "text-teal-600 bg-teal-50 border-teal-100",
    description: "For eligible diagnostic tests, avoid unnecessary travel and schedule trained phlebotomist visits to collect medical samples safely from the comfort of your home.",
    features: [
      "Request sample collection for eligible diagnostic profiles",
      "Scheduled visits tailored to patient convenience",
      "Professional sample handling and standard cold-chain safety",
      "Direct transit to partner laboratories for processing"
    ],
    ctaText: "Request Home Collection",
    ctaLink: "https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab",
    isExternal: true
  },
  {
    id: "digital-reports",
    title: "Digital Laboratory Reports",
    icon: FileText,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    description: "Laboratory reports are generated and uploaded directly by partner laboratories through the Lab Portal, making them accessible to patients digitally according to the platform workflow.",
    features: [
      "Access verified diagnostic test results anywhere, anytime",
      "Secure digital PDF storage within your patient account",
      "Share reports easily with consulting doctors and specialists",
      "Historic test tracking for ongoing healthcare monitoring"
    ],
    ctaText: "Get Mobile App",
    ctaLink: "https://play.google.com/store/apps/details?id=com.hamzacode.bharosalab",
    isExternal: true
  },
  {
    id: "doctor-consultation",
    title: "Live Doctor Consultation",
    icon: Stethoscope,
    iconColor: "text-teal-600 bg-teal-50 border-teal-100",
    description: "Connect with participating qualified doctors for online medical consultations to discuss health concerns, symptoms, and receive professional advice on diagnostic results.",
    features: [
      "Consult with qualified general practitioners and specialists",
      "Convenient tele-consultation channels",
      "Discuss lab test interpretations and follow-up guidance",
      "Review medical history in a secure digital space"
    ],
    ctaText: "Doctor Network Details",
    ctaLink: "/doctors",
    isExternal: false
  },
  {
    id: "partner-lab-portal",
    title: "Partner Laboratory Management Portal",
    icon: Laptop,
    iconColor: "text-[#1E3A5F] bg-blue-50 border-blue-100",
    description: "Partner laboratories receive a dedicated digital portal to manage their profile, diagnostic tests, incoming patient orders, report uploads, and Bharosa Lab earning metrics in one place.",
    features: [
      "Full control over laboratory profile, contact, and branding",
      "Catalog and test management with customizable pricing",
      "Real-time incoming test bookings and sample order processing",
      "Digital report upload interface directly to patient accounts",
      "Billing cycle tracking, order ledgers, and platform metrics"
    ],
    ctaText: "Partner Lab Login",
    ctaLink: "/login",
    isExternal: false
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Page Header */}
        <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A5F] tracking-tight">
              Our Healthcare Services
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Connecting diagnostic testing, home phlebotomy, digital reports, and medical consultations into one seamless platform.
            </p>
          </div>
        </section>

        {/* Services Deep Dive */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            {servicesList.map((service, index) => {
              const isEven = index % 2 === 1;
              const Icon = service.icon;

              return (
                <div 
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-sm ${
                    isEven ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  {/* Content Column */}
                  <div className={`space-y-6 ${isEven ? 'lg:col-span-7 lg:order-2' : 'lg:col-span-7'}`}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E3A5F] tracking-tight">
                      {service.title}
                    </h2>

                    <p className="text-slate-600 text-base leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2.5 pt-2">
                      {service.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      {service.isExternal ? (
                        <a
                          href={service.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                            <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                            <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                            <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
                          </svg>
                          <span>{service.ctaText}</span>
                        </a>
                      ) : (
                        <Link
                          href={service.ctaLink}
                          className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#1E3A5F] hover:bg-slate-900 rounded-xl transition-all shadow-md"
                        >
                          <span>{service.ctaText}</span>
                          <ArrowRight className="w-4 h-4 text-teal-400" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Visual / Feature Card Column */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                    <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md space-y-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${service.iconColor}`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-[#1E3A5F]">{service.title}</h3>
                        <p className="text-xs text-slate-500">
                          Integrated within the Bharosa Lab digital healthcare framework.
                        </p>
                      </div>
                      <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-teal-600" />
                          Verified Security
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-emerald-600" />
                          Direct Access
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 bg-[#1E3A5F] text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to access or offer diagnostic services?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Download the Bharosa Lab mobile app for patients, or sign in to your Partner Laboratory portal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 text-sm font-bold text-[#1E3A5F] bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center gap-2.5 active:scale-95"
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M4.06 2.15C3.76 2.47 3.59 2.97 3.59 3.63V20.37C3.59 21.03 3.76 21.53 4.06 21.85L4.13 21.92L13.51 12.54V12.46V12.38L4.13 3L4.06 2.15Z" fill="#00D3FF"/>
                  <path d="M16.63 15.66L13.51 12.54V12.38L16.63 9.26L16.73 9.32L20.43 11.42C21.49 12.02 21.49 13.01 20.43 13.61L16.73 15.71L16.63 15.66Z" fill="#FFD300"/>
                  <path d="M16.73 15.71L13.51 12.46L4.06 21.92C4.41 22.29 5.01 22.34 5.69 21.95L16.73 15.71Z" fill="#FF3A44"/>
                  <path d="M16.73 9.32L5.69 3.08C5.01 2.69 4.41 2.74 4.06 3.11L13.51 12.57L16.73 9.32Z" fill="#00E676"/>
                </svg>
                <span>Download Mobile App</span>
              </a>
              <Link
                href="/login"
                className="px-7 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-md"
              >
                Partner Laboratory Login
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

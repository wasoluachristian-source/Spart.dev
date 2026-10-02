import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import {
  GraduationCap,
  Clock,
  Award,
  CheckCircle,
  Mail,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  Download
} from 'lucide-react';
import { SecureCheckoutModal } from '../components/SecureCheckoutModal';

interface CoursesPageProps {
  setCurrentTab: (tab: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ setCurrentTab }) => {
  const { courses } = useApp();
  const [selectedCourseForPurchase, setSelectedCourseForPurchase] = useState<Course | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Formations &amp; Mentoring</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Formations Techniques Pratiques
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Des programmes complets pas à pas conçus pour vous transmettre le savoir-faire de l’industrie et bâtir des projets concrets.
        </p>

        {/* Quick link to code page */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setCurrentTab('download')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-800/50 text-cyan-300 hover:text-white text-xs font-semibold hover:border-cyan-500 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Déjà inscrit ? Télécharger les supports avec mon code unique</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden hover:border-cyan-500/40 transition duration-300 shadow-xl flex flex-col justify-between group"
          >
            <div>
              {/* Image banner */}
              <div className="relative aspect-[21/9] bg-slate-950 overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950/90 text-cyan-300 border border-cyan-800/50 backdrop-blur-md">
                    {course.level || 'Tous niveaux'}
                  </span>
                  {course.duration && (
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-950/90 text-slate-300 border border-slate-800 backdrop-blur-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {course.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition leading-snug">
                    {course.title}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-white">{course.price} €</span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {course.description}
                </p>

                {/* Syllabus */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Programme du cursus
                    </div>
                    <ul className="space-y-1.5">
                      {course.syllabus.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 sm:p-8 pt-0 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedCourseForPurchase(course)}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>S'inscrire &amp; Payer ({course.price} €)</span>
              </button>

              <button
                onClick={() => setCurrentTab('contact')}
                className="py-3 px-4 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Détails &amp; Question
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Secure Checkout Modal */}
      {selectedCourseForPurchase && (
        <SecureCheckoutModal
          isOpen={!!selectedCourseForPurchase}
          onClose={() => setSelectedCourseForPurchase(null)}
          item={{
            id: selectedCourseForPurchase.id,
            title: selectedCourseForPurchase.title,
            price: selectedCourseForPurchase.price,
            type: 'course',
            deliverableUrl: selectedCourseForPurchase.fileOrUrl,
            deliverableName: selectedCourseForPurchase.fileName || `${selectedCourseForPurchase.title}.pdf`,
          }}
        />
      )}
    </div>
  );
};

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
  Users
} from 'lucide-react';

interface CoursesPageProps {
  setCurrentTab: (tab: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ setCurrentTab }) => {
  const { courses } = useApp();

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
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-lg text-sm font-black bg-slate-950/90 text-white border border-slate-700 backdrop-blur-md">
                    {course.price} €
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Syllabus */}
                {course.syllabus && course.syllabus.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Programme de la formation :</span>
                    </h4>
                    <div className="space-y-2">
                      {course.syllabus.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 sm:p-8 pt-0 border-t border-slate-800/80 mt-6 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Inscriptions ouvertes
              </span>

              <button
                onClick={() => setCurrentTab('contact')}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition flex items-center gap-2 shadow-md shadow-cyan-950"
              >
                <span>S'inscrire / Me contacter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

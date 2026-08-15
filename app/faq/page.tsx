"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQAccordion from '../components/FAQAccordion';
import { allFaqs, faqCategories } from '@/lib/faqData';
import { Search, HelpCircle, ArrowRight, MessageCircle } from 'lucide-react';

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', ...faqCategories];

  const filteredFaqs = allFaqs.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      <Navbar />

      <main className="flex-1">
        
        {/* Header */}
        <section className="bg-gradient-to-b from-[#1E3A5F]/5 via-white to-white py-16 sm:py-20 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E3A5F] tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Find clear, verified answers to common questions regarding Bharosa Lab services, laboratory portals, consultations, and partnerships.
            </p>

            {/* Search Input */}
            <div className="max-w-xl mx-auto pt-4 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions (e.g. sample collection, portal, earnings)..."
                className="w-full px-5 py-4 pl-12 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:border-teal-500 text-sm"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-7.5" />
            </div>
          </div>
        </section>

        {/* Category Tabs & FAQ List */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1E3A5F] text-white shadow-md shadow-slate-900/15'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            {filteredFaqs.length > 0 ? (
              <FAQAccordion items={filteredFaqs} />
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-base font-semibold">No questions matched your search criteria.</p>
                <p className="text-xs text-slate-400">Try adjusting your keywords or category filter.</p>
              </div>
            )}

            {/* Direct Help Callout */}
            <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-slate-200 text-center space-y-4">
              <h3 className="text-lg font-bold text-[#1E3A5F]">Still have a question?</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Our support team is available to assist you with any questions or technical guidance.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all"
                >
                  Contact Support
                </Link>
                <a
                  href="https://wa.me/923141811158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: 03141811158</span>
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

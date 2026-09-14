"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, 
  Loader2, Sparkles, Tag, Layers, Stethoscope, ChevronRight, 
  X, RefreshCw, Copy, Check, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface GlobalHealthPackage {
  id: string;
  title: string;
  urdu_title?: string;
  badge?: string;
  discount_percentage?: number;
  price?: number;
  original_price?: number;
  description: string;
  test_tokens: string;
  tests_included: string[];
  is_active: boolean;
  created_at?: string;
}

const DEFAULT_GLOBAL_PACKAGES: GlobalHealthPackage[] = [
  {
    id: 'pkg_basic_checkup',
    title: 'Basic Health Checkup',
    urdu_title: 'بنیادی صحت چیک اپ',
    badge: '20% OFF',
    discount_percentage: 20,
    price: 1800,
    original_price: 2250,
    description: 'Essential wellness checkup covering full blood count, sugar level, and kidney/urine health.',
    test_tokens: 'cbc,sugar,urine',
    tests_included: ['CBC (Complete Blood Count)', 'Fasting Blood Sugar', 'Urine R/E'],
    is_active: true
  },
  {
    id: 'pkg_diabetes_care',
    title: 'Diabetes Screening Package',
    urdu_title: 'شوگر / ذیابیطس کیئر پیکج',
    badge: 'Special Care',
    discount_percentage: 15,
    price: 2400,
    original_price: 2850,
    description: 'Comprehensive 3-month average glucose control and lipid/cholesterol profiling.',
    test_tokens: 'hba1c,sugar,lipid',
    tests_included: ['HbA1c (3-Month Sugar)', 'Fasting Glucose', 'Lipid Profile (Cholesterol)'],
    is_active: true
  },
  {
    id: 'pkg_premarital_wedding',
    title: 'Wedding / Pre-Marital Package',
    urdu_title: 'شادی سے قبل ضروری اسکریننگ',
    badge: 'Essential',
    discount_percentage: 25,
    price: 3200,
    original_price: 4200,
    description: 'Critical screening for genetic thalassemia traits, viral hepatitis B/C, and blood grouping.',
    test_tokens: 'cbc,blood-group,hepatitis',
    tests_included: ['Thalassemia Screen / CBC', 'Blood Group & Rh Factor', 'Hepatitis B & C'],
    is_active: true
  },
  {
    id: 'pkg_vital_organs',
    title: 'Liver & Kidney Vital Profile',
    urdu_title: 'جگر اور گردوں کا مکمل چیک اپ',
    badge: 'Vital Check',
    discount_percentage: 18,
    price: 2900,
    original_price: 3550,
    description: 'Complete assessment of liver enzymes, kidney function, creatinine, and urine chemistry.',
    test_tokens: 'lft,rft,urine',
    tests_included: ['LFT (Liver Function Test)', 'RFT (Renal / Creatinine)', 'Urine Routine (R/E)'],
    is_active: true
  }
];

export default function SuperAdminPackagesPage() {
  const [packages, setPackages] = useState<GlobalHealthPackage[]>([]);
  const [masterTests, setMasterTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [showSqlNotice, setShowSqlNotice] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [urduTitle, setUrduTitle] = useState('');
  const [badge, setBadge] = useState('20% OFF');
  const [discountPercentage, setDiscountPercentage] = useState(20);
  const [price, setPrice] = useState<number | string>('');
  const [originalPrice, setOriginalPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [customTestInput, setCustomTestInput] = useState('');

  // 1. Fetch Packages and Master Tests
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch master tests catalog
      const { data: testsData } = await supabase
        .from('master_tests')
        .select('id, title, category')
        .order('title', { ascending: true });

      if (testsData) setMasterTests(testsData);

      // Fetch packages from app_settings
      const { data: appSettings, error: appErr } = await supabase
        .from('app_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (appSettings && appSettings.health_packages) {
        let parsed = appSettings.health_packages;
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch (e) {}
        }
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPackages(parsed);
          return;
        }
      }

      // If no custom packages saved yet, initialize with default 4 packages
      setPackages(DEFAULT_GLOBAL_PACKAGES);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load packages data.");
      setPackages(DEFAULT_GLOBAL_PACKAGES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Modal for New Package
  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setUrduTitle('');
    setBadge('20% OFF');
    setDiscountPercentage(20);
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setSelectedTests([]);
    setIsActive(true);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (pkg: GlobalHealthPackage) => {
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setUrduTitle(pkg.urdu_title || '');
    const disc = pkg.discount_percentage ?? 20;
    let initialBadge = pkg.badge || `${disc}% OFF`;
    if (pkg.discount_percentage && (!initialBadge || initialBadge.includes('%'))) {
      initialBadge = `${pkg.discount_percentage}% OFF`;
    }
    setBadge(initialBadge);
    setDiscountPercentage(disc);
    setPrice(pkg.price || '');
    setOriginalPrice(pkg.original_price || '');
    setDescription(pkg.description);
    setSelectedTests(pkg.tests_included || []);
    setIsActive(pkg.is_active !== false);
    setShowModal(true);
  };

  // Toggle Test Selection
  const toggleTest = (testTitle: string) => {
    if (selectedTests.includes(testTitle)) {
      setSelectedTests(selectedTests.filter(t => t !== testTitle));
    } else {
      setSelectedTests([...selectedTests, testTitle]);
    }
  };

  // Add Custom Test
  const handleAddCustomTest = () => {
    const trimmed = customTestInput.trim();
    if (!trimmed) return;
    if (!selectedTests.includes(trimmed)) {
      setSelectedTests([...selectedTests, trimmed]);
    }
    setCustomTestInput('');
  };

  // Save / Update Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a package title.");
      return;
    }
    if (selectedTests.length === 0) {
      toast.error("Please select at least 1 test included in this package.");
      return;
    }

    setIsSaving(true);
    try {
      const testTokens = selectedTests
        .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'))
        .join(',');

      const disc = Number(discountPercentage) || 0;
      let finalBadge = badge.trim();
      if (disc > 0 && (!finalBadge || finalBadge.includes('%'))) {
        finalBadge = `${disc}% OFF`;
      }

      const newPkg: GlobalHealthPackage = {
        id: editingId || `pkg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: title.trim(),
        urdu_title: urduTitle.trim(),
        badge: finalBadge || `${disc}% OFF`,
        discount_percentage: disc,
        price: price ? Number(price) : undefined,
        original_price: originalPrice ? Number(originalPrice) : undefined,
        description: description.trim() || `${selectedTests.join(', ')} complete package.`,
        test_tokens: testTokens,
        tests_included: selectedTests,
        is_active: isActive,
        created_at: new Date().toISOString()
      };

      let updatedList: GlobalHealthPackage[];
      if (editingId) {
        updatedList = packages.map(p => p.id === editingId ? newPkg : p);
      } else {
        updatedList = [newPkg, ...packages];
      }

      // Save to Supabase app_settings
      const { error: updateErr } = await supabase
        .from('app_settings')
        .update({ health_packages: JSON.stringify(updatedList) })
        .eq('id', 1);

      if (updateErr) {
        if (updateErr.message?.includes('health_packages')) {
          setShowSqlNotice(true);
          toast.error("Column 'health_packages' needs to be added in Supabase SQL.");
          setPackages(updatedList);
          setShowModal(false);
          return;
        }
        throw updateErr;
      }

      setPackages(updatedList);
      setShowModal(false);
      toast.success(editingId ? "Package updated live!" : "New package published live to mobile app!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Package
  const handleDelete = async (pkgId: string) => {
    if (!confirm("Are you sure you want to delete this global package? It will be removed from the patient mobile app.")) return;

    try {
      const updatedList = packages.filter(p => p.id !== pkgId);
      const { error } = await supabase
        .from('app_settings')
        .update({ health_packages: JSON.stringify(updatedList) })
        .eq('id', 1);

      if (error && !error.message?.includes('health_packages')) throw error;

      setPackages(updatedList);
      toast.success("Package deleted.");
    } catch (err: any) {
      toast.error("Failed to delete package: " + err.message);
    }
  };

  // Reset to Default
  const handleResetToDefaults = async () => {
    if (!confirm("Reset all packages to the default 4 mobile app packages?")) return;
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ health_packages: JSON.stringify(DEFAULT_GLOBAL_PACKAGES) })
        .eq('id', 1);

      if (error && !error.message?.includes('health_packages')) throw error;
      setPackages(DEFAULT_GLOBAL_PACKAGES);
      toast.success("Reset to default packages successfully!");
    } catch (err: any) {
      toast.error("Failed to reset: " + err.message);
    }
  };

  const copySqlCode = () => {
    navigator.clipboard.writeText("ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS health_packages jsonb;");
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
    toast.success("SQL command copied to clipboard!");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Package size={26} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Global Health Packages
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Create & edit health packages shown in the patient mobile app
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors"
          >
            <RefreshCw size={14} />
            Reset Defaults
          </button>
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            Create Global Package
          </button>
        </div>
      </div>

      {/* SQL Migration Notice if needed */}
      {showSqlNotice && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <div>
              <p className="text-xs font-bold text-amber-900">
                1-Time Supabase SQL Setup Required to persist in DB:
              </p>
              <code className="text-[11px] font-mono bg-amber-100/80 text-amber-900 px-2 py-0.5 rounded mt-0.5 inline-block">
                ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS health_packages jsonb;
              </code>
            </div>
          </div>
          <button
            onClick={copySqlCode}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            {sqlCopied ? <Check size={14} /> : <Copy size={14} />}
            {sqlCopied ? "Copied!" : "Copy SQL"}
          </button>
        </div>
      )}

      {/* Packages Grid */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-3" />
          <p className="text-xs text-gray-500 font-bold">Loading health packages...</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-12 text-center max-w-xl mx-auto">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900 mb-1">No Packages Configured</h3>
          <p className="text-xs text-gray-500 mb-5">Click below to restore standard packages or create a custom one.</p>
          <button
            onClick={handleResetToDefaults}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl"
          >
            Restore Default Packages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 border transition-all ${
                pkg.is_active ? 'border-gray-200 shadow-sm hover:shadow-md' : 'border-gray-100 opacity-60 bg-gray-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">
                      {pkg.urdu_title || 'خصوصی پیکج'}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {pkg.badge || 'Offer'}
                    </span>
                    {!pkg.is_active && (
                      <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 leading-snug">
                    {pkg.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Edit Package"
                  >
                    <Edit3 size={17} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Package"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {pkg.description}
              </p>

              {/* Price Row if provided */}
              {pkg.price ? (
                <div className="flex items-baseline gap-2 mb-4 bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-500">Package Price:</span>
                  <span className="text-lg font-black text-emerald-600">Rs. {pkg.price.toLocaleString()}</span>
                  {pkg.original_price && pkg.original_price > pkg.price && (
                    <span className="text-xs text-gray-400 line-through font-medium">
                      Rs. {pkg.original_price.toLocaleString()}
                    </span>
                  )}
                  {pkg.discount_percentage ? (
                    <span className="ml-auto bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded border border-red-200">
                      {pkg.discount_percentage}% OFF
                    </span>
                  ) : null}
                </div>
              ) : null}

              {/* Tests Included */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                  Tests Included ({pkg.tests_included.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.tests_included.map((tName, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800"
                    >
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      {tName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Booking Tokens Tokenized String */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100 font-mono">
                <span>Tokens: <strong className="text-gray-600">{pkg.test_tokens}</strong></span>
                <span className="text-[10px] text-blue-600 font-bold font-sans">Live in Mobile App</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 my-8">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    {editingId ? 'Edit Global Health Package' : 'Create Global Health Package'}
                  </h3>
                  <p className="text-xs text-gray-500">Configure details shown on mobile app home screen & packages list</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Title & Urdu Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Package Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Executive Full Body Checkup"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Urdu Title (اردو عنوان)
                  </label>
                  <input
                    type="text"
                    value={urduTitle}
                    onChange={(e) => setUrduTitle(e.target.value)}
                    placeholder="مثلاً مکمل ہیلتھ اسکریننگ"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none text-right font-sans"
                  />
                </div>
              </div>

              {/* Badge & Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Discount Badge Tag
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. 25% OFF, Special Care"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={discountPercentage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDiscountPercentage(val);
                      if (!badge || badge.includes('%')) {
                        setBadge(`${val}% OFF`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Pricing (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Package Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Original Price Before Discount (Rs.)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 3200"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                  Package Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what health conditions or wellness goals this bundle covers..."
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              {/* Tests Selection from Master Catalog */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                    Select Included Tests ({selectedTests.length} selected) *
                  </label>
                  <span className="text-[11px] text-gray-400">Click chips to toggle</span>
                </div>

                <div className="max-h-44 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-wrap gap-2 mb-3">
                  {masterTests.map((t) => {
                    const isSelected = selectedTests.includes(t.title);
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => toggleTest(t.title)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        {t.title}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Test Name Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTestInput}
                    onChange={(e) => setCustomTestInput(e.target.value)}
                    placeholder="Or type custom test name (e.g. Urine R/E, Fasting Blood Sugar)..."
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:border-blue-500 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTest}
                    className="px-3.5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                  >
                    Add Test
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <span className="text-xs font-black text-gray-900">Active Status</span>
                  <p className="text-[11px] text-gray-400">If inactive, package will be hidden from mobile users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={(e) => setIsActive(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? "Save Changes" : "Publish Package Live"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

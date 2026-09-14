"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, Plus, Trash2, Edit3, CheckCircle2, AlertCircle, 
  Loader2, Sparkles, Tag, Layers, Stethoscope, ChevronRight, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface HealthPackageItem {
  id: string;
  title: string;
  urdu_title?: string;
  badge?: string;
  discount_percentage?: number;
  price: number;
  original_price?: number;
  description: string;
  test_tokens: string;
  tests_included: string[];
  is_active: boolean;
  created_at: string;
}

export interface LabTestOption {
  id: string;
  test_id: string;
  price: number;
  title: string;
}

export default function PackagesManagerPage() {
  const [lab, setLab] = useState<any>(null);
  const [packages, setPackages] = useState<HealthPackageItem[]>([]);
  const [availableTests, setAvailableTests] = useState<LabTestOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  // 1. Fetch Lab and its Tests & Packages
  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data: labData, error: labErr } = await supabase
        .from('labs')
        .select('*')
        .eq('owner_id', session.user.id)
        .single();

      if (labErr || !labData) {
        toast.error("Lab profile not found.");
        setIsLoading(false);
        return;
      }

      setLab(labData);

      // Load Packages from lab_images JSON storage or health_packages table
      let loadedPkgs: HealthPackageItem[] = [];
      try {
        if (labData.lab_images) {
          const parsed = typeof labData.lab_images === 'string' 
            ? JSON.parse(labData.lab_images) 
            : labData.lab_images;
          if (Array.isArray(parsed)) {
            loadedPkgs = parsed;
          }
        }
      } catch (e) {
        console.warn("Could not parse lab_images as packages:", e);
      }
      setPackages(loadedPkgs);

      // Fetch Lab's registered tests to select from
      const { data: testsData } = await supabase
        .from('lab_tests')
        .select('id, test_id, price, master_tests ( title )')
        .eq('lab_id', labData.id);

      if (testsData) {
        const mappedTests: LabTestOption[] = testsData.map((t: any) => ({
          id: t.id,
          test_id: t.test_id,
          price: t.price,
          title: t.master_tests?.title || 'Unknown Test'
        }));
        setAvailableTests(mappedTests);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load packages.");
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
    setBadge('25% OFF');
    setDiscountPercentage(25);
    setPrice('');
    setOriginalPrice('');
    setDescription('');
    setSelectedTests([]);
    setIsActive(true);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (pkg: HealthPackageItem) => {
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setUrduTitle(pkg.urdu_title || '');
    setBadge(pkg.badge || 'Special Offer');
    setDiscountPercentage(pkg.discount_percentage || 20);
    setPrice(pkg.price);
    setOriginalPrice(pkg.original_price || '');
    setDescription(pkg.description);
    setSelectedTests(pkg.tests_included || []);
    setIsActive(pkg.is_active);
    setShowModal(true);
  };

  // Toggle Test Selection
  const toggleTest = (testTitle: string, testPrice: number) => {
    let updated: string[];
    if (selectedTests.includes(testTitle)) {
      updated = selectedTests.filter(t => t !== testTitle);
    } else {
      updated = [...selectedTests, testTitle];
    }
    setSelectedTests(updated);

    // Auto calculate original price sum
    const sumOriginal = availableTests
      .filter(t => updated.includes(t.title))
      .reduce((sum, t) => sum + t.price, 0);

    setOriginalPrice(sumOriginal);
    if (sumOriginal > 0 && discountPercentage > 0) {
      const discounted = Math.round(sumOriginal * (1 - discountPercentage / 100));
      setPrice(discounted);
    }
  };

  // Save / Update Package
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a package title.");
      return;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Please enter a valid package price.");
      return;
    }
    if (selectedTests.length === 0) {
      toast.error("Please select at least 1 test included in this package.");
      return;
    }

    setIsSaving(true);
    try {
      // Create tokens string from selected test titles
      const testTokens = selectedTests
        .map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'))
        .join(',');

      const newPkg: HealthPackageItem = {
        id: editingId || `pkg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        title: title.trim(),
        urdu_title: urduTitle.trim(),
        badge: badge.trim() || 'Special Package',
        discount_percentage: Number(discountPercentage) || 0,
        price: Number(price),
        original_price: Number(originalPrice) || Number(price),
        description: description.trim() || `${selectedTests.join(', ')} complete package deal.`,
        test_tokens: testTokens,
        tests_included: selectedTests,
        is_active: isActive,
        created_at: new Date().toISOString()
      };

      let updatedList: HealthPackageItem[];
      if (editingId) {
        updatedList = packages.map(p => p.id === editingId ? newPkg : p);
      } else {
        updatedList = [newPkg, ...packages];
      }

      // Save to Supabase
      const { error: updateErr } = await supabase
        .from('labs')
        .update({ lab_images: JSON.stringify(updatedList) })
        .eq('id', lab.id);

      if (updateErr) throw updateErr;

      setPackages(updatedList);
      setShowModal(false);
      toast.success(editingId ? "Health package updated!" : "Health package published live to mobile app!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save package: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Package
  const handleDelete = async (pkgId: string) => {
    if (!confirm("Are you sure you want to delete this package? It will no longer be visible in the patient app.")) return;

    try {
      const updatedList = packages.filter(p => p.id !== pkgId);
      const { error } = await supabase
        .from('labs')
        .update({ lab_images: JSON.stringify(updatedList) })
        .eq('id', lab.id);

      if (error) throw error;
      setPackages(updatedList);
      toast.success("Package deleted.");
    } catch (err: any) {
      console.error(err);
      toast.error("Could not delete package.");
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (pkg: HealthPackageItem) => {
    try {
      const updatedList = packages.map(p => 
        p.id === pkg.id ? { ...p, is_active: !p.is_active } : p
      );
      const { error } = await supabase
        .from('labs')
        .update({ lab_images: JSON.stringify(updatedList) })
        .eq('id', lab.id);

      if (error) throw error;
      setPackages(updatedList);
      toast.success(pkg.is_active ? "Package deactivated." : "Package activated live!");
    } catch (err: any) {
      toast.error("Status update failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!lab) {
    return <div className="text-center mt-20 text-red-500 font-bold">Please setup your lab profile first!</div>;
  }

  return (
    <div className="max-w-[1300px] mx-auto pb-16 px-4 sm:p-6 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Patient App Feature</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Health Packages & Bundles Manager
            </h1>
            <p className="text-blue-100 text-sm mt-1 max-w-xl">
              Create discounted test bundles for your lab. Packages appear directly on the patient mobile app home screen and dedicated Health Packages catalog.
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="bg-white text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      {/* Packages Grid / List */}
      {packages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Packages Created Yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Bundle your tests together (e.g. CBC + Sugar + LFT) at a special discount to attract 3x more bookings from patients!
          </p>
          <button
            onClick={handleOpenNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Package</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-3xl border ${pkg.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden`}
            >
              <div className="p-6">
                {/* Top Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {pkg.badge || 'Special Offer'}
                  </span>
                  <button
                    onClick={() => handleToggleActive(pkg)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                      pkg.is_active 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}
                  >
                    {pkg.is_active ? '● Live on App' : '○ Inactive'}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-lg font-black text-gray-900 leading-snug">
                  {pkg.title}
                </h3>
                {pkg.urdu_title && (
                  <p className="text-xs font-bold text-gray-400 mt-0.5" dir="rtl">
                    {pkg.urdu_title}
                  </p>
                )}

                <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-blue-700">
                    Rs. {pkg.price.toLocaleString()}
                  </span>
                  {pkg.original_price && pkg.original_price > pkg.price && (
                    <span className="text-sm text-gray-400 line-through font-medium">
                      Rs. {pkg.original_price.toLocaleString()}
                    </span>
                  )}
                  {pkg.discount_percentage ? (
                    <span className="text-xs font-bold text-emerald-600">
                      ({pkg.discount_percentage}% OFF)
                    </span>
                  ) : null}
                </div>

                {/* Tests Included */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Tests Included ({pkg.tests_included.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {pkg.tests_included.map((tName, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 text-gray-700 text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-gray-50/70 px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Package</span>
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editingId ? 'Edit Health Package' : 'Create New Health Package'}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  This bundle will be shown to patients with 1-tap booking in the mobile app.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePackage} className="overflow-y-auto flex-1 py-4 space-y-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Package Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Basic Health Checkup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Urdu Title (اردو نام)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    placeholder="مثلاً: بنیادی صحت چیک اپ"
                    value={urduTitle}
                    onChange={(e) => setUrduTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs text-right font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Offer Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25% OFF / Popular"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    placeholder="20"
                    value={discountPercentage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDiscountPercentage(val);
                      if (!badge || badge.includes('%')) {
                        setBadge(`${val}% OFF`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Package Price (Rs.) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-blue-500 rounded-xl text-sm font-black text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Package Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Essential wellness checkup covering full blood count, sugar, and kidney health..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white outline-none shadow-xs resize-none"
                />
              </div>

              {/* Select Included Tests */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-800">
                    Select Tests Included in this Bundle ({selectedTests.length} Selected) *
                  </label>
                  {originalPrice ? (
                    <span className="text-xs text-gray-500 font-medium">
                      Individual Total: <strong className="text-gray-800">Rs. {Number(originalPrice).toLocaleString()}</strong>
                    </span>
                  ) : null}
                </div>

                {availableTests.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    Please add tests in "My Tests & Prices" first so you can bundle them into packages!
                  </p>
                ) : (
                  <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                    {availableTests.map((t) => {
                      const isSelected = selectedTests.includes(t.title);
                      return (
                        <div
                          key={t.id}
                          onClick={() => toggleTest(t.title, t.price)}
                          className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between border transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs' 
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              readOnly 
                              className="rounded text-blue-600 focus:ring-blue-500" 
                            />
                            <span className="text-xs font-bold">{t.title}</span>
                          </div>
                          <span className="text-xs font-extrabold text-gray-600">
                            Rs. {t.price}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status Switch */}
              <div className="pt-2 flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-800">Live Status</p>
                  <p className="text-[11px] text-gray-500">Make this package immediately visible in patient app</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {isActive ? 'Live' : 'Hidden'}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{editingId ? 'Update Package' : 'Publish Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

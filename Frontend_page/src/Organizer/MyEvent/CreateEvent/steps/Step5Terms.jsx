import React, { useEffect, useState } from "react";
import { getPolicies, createPolicy } from "../../../../Services/api";
import { useSelector } from "react-redux";
import { Plus, X, CheckCircle, Trash2, Eye, ChevronRight, Info, Edit3 } from "lucide-react";

const Step5Terms = ({ formData, setFormData }) => {
  const [policyData, setPolicyData] = useState({});
  const [policyGroup, setPolicyGroup] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewDescription, setViewDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [newPolicy, setNewPolicy] = useState({
    policy_name: "",
    policy_type: "",
    policy_group: "",
    description: "",
    status: "Active"
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const Redexorganizer = useSelector((state) => state.user);
  const storedUser = {
    id: sessionStorage.getItem("userId"),
    name: sessionStorage.getItem("userName"),
  };

  const organizer = Redexorganizer?.id ? Redexorganizer : storedUser;

  useEffect(() => {
    if (organizer?.id) {
      fetchPolicies();
    }
  }, [organizer?.id]);

  const fetchPolicies = async () => {
    try {
      const res = await getPolicies(organizer.id);
      const policies = res.data || [];
      const grouped = {};

      policies.forEach((item) => {
        const group = item.policy_group;
        const type = item.policy_type;
        const name = item.policy_name;
        const desc = item.description;

        if (!grouped[group]) grouped[group] = {};
        if (!grouped[group][type]) grouped[group][type] = {};

        grouped[group][type][name] = desc;
      });

      setPolicyData(grouped);
    } catch (error) {
      console.error("Failed to load policies", error);
      showNotification("Failed to load policies", "error");
    }
  };

  const showNotification = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const addPolicy = () => {
    if (!policyGroup || !policyType || !policyName) {
      showNotification("Please select all fields", "error");
      return;
    }

    const description = policyData[policyGroup][policyType][policyName] || "";
    const newPolicyItem = { policyGroup, policyType, policyName, description, isDefault };
    const existing = formData.terms || [];

    const isDuplicate = existing.some(
      (p) =>
        p.policyGroup === policyGroup &&
        p.policyType === policyType &&
        p.policyName === policyName
    );

    if (isDuplicate && editingIndex === null) {
      showNotification("Policy already added to selection", "error");
      return;
    }

    if (editingIndex !== null) {
      const updatedTerms = [...formData.terms];
      updatedTerms[editingIndex] = newPolicyItem;
      setFormData({ ...formData, terms: updatedTerms });
      setEditingIndex(null);
      showNotification("Policy updated successfully!");
    } else {
      setFormData({
        ...formData,
        terms: [...existing, newPolicyItem],
      });
      showNotification("Policy added to selection!");
    }

    resetForm();
  };

  const resetForm = () => {
    setPolicyGroup("");
    setPolicyType("");
    setPolicyName("");
    setIsDefault(false);
    setEditingIndex(null);
  };

  const removePolicy = (index) => {
    const updatedTerms = formData.terms.filter((_, i) => i !== index);
    setFormData({ ...formData, terms: updatedTerms });
    showNotification("Policy removed from selection", "error");
  };

  const editPolicy = (index) => {
    const policy = formData.terms[index];
    setPolicyGroup(policy.policyGroup);
    setPolicyType(policy.policyType);
    setPolicyName(policy.policyName);
    setIsDefault(policy.isDefault || false);
    setEditingIndex(index);
    showNotification("You can now edit the selected policy", "success");
  };

  const handleCreatePolicy = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newPolicy.policy_name.trim()) errors.policy_name = "Policy name is required";
    if (!newPolicy.policy_type) errors.policy_type = "Policy Type is required";
    if (!newPolicy.policy_group) errors.policy_group = "Policy Group is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setLoading(true);
      await createPolicy({ ...newPolicy, organizer_id: organizer.id });
      await fetchPolicies();
      showNotification("Policy created successfully!");
      setShowAddModal(false);
      setNewPolicy({ policy_name: "", policy_type: "", policy_group: "", description: "", status: "Active" });
      setFieldErrors({});
    } catch (error) {
      console.error("Failed to create policy", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTerms = (formData.terms || []).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((formData.terms || []).length / itemsPerPage);

  const cardClasses = "bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-1";
  const selectClasses = "w-full px-6 py-4 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none text-sm font-bold text-slate-700 transition-all cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed";

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-10 right-10 z-[3000] px-8 py-5 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 flex items-center gap-4 border-l-8 ${toast.type === "success" ? "bg-white text-emerald-600 border-emerald-500 shadow-emerald-100" : "bg-white text-rose-600 border-rose-500 shadow-rose-100"
          }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
            {toast.type === "success" ? <CheckCircle size={20} /> : <Info size={20} />}
          </div>
          <p className="font-bold tracking-tight">{toast.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT SECTION: PREMIUM SELECTION FORM */}
        <div className={`${cardClasses} flex flex-col md:h-[calc(110vh-290px)] md:overflow-y-auto custom-scrollbar pr-2`}>
          <div className="flex justify-between items-center mb-8 border-l-4 border-purple-500 pl-5">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Terms & Conditions</h2>
              <p className="text-[10px] font-bold text-slate-400  mt-1 tracking-widest">Select and configure event policies</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-3 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-full transition-all duration-500 shadow-sm group"
              title="Add New Policy to Master"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <label className={labelClasses}>Policy Group <span className="text-red-500">*</span></label>
              <div className="relative group">
                <select
                  value={policyGroup}
                  onChange={(e) => {
                    setPolicyGroup(e.target.value);
                    setPolicyType("");
                    setPolicyName("");
                  }}
                  className={selectClasses}
                >
                  <option value="">Select Group</option>
                  {Object.keys(policyData).map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-purple-500 transition-colors">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Policy Type <span className="text-red-500">*</span></label>
              <div className="relative group">
                <select
                  value={policyType}
                  onChange={(e) => {
                    setPolicyType(e.target.value);
                    setPolicyName("");
                  }}
                  className={selectClasses}
                  disabled={!policyGroup}
                >
                  <option value="">Select Type</option>
                  {policyGroup && Object.keys(policyData[policyGroup] || {}).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClasses}>Policy Name <span className="text-red-500">*</span></label>
              <div className="relative group">
                <select
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className={selectClasses}
                  disabled={!policyType}
                >
                  <option value="">Select Policy</option>
                  {policyGroup && policyType && Object.keys(policyData[policyGroup][policyType] || {}).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50/50 rounded-2xl border border-purple-100 transition-all hover:bg-purple-50 group">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-5 h-5 rounded-md border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer transition-all"
                />
              </div>
              <label htmlFor="isDefault" className="text-sm font-black text-slate-700 cursor-pointer select-none tracking-tight">
                Set as Default Policy
              </label>
            </div>

            <div className="pt-6">
              <button
                onClick={addPolicy}
                disabled={!policyGroup || !policyType || !policyName}
                className="w-full py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-black rounded-full shadow-xl shadow-purple-100 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
              >
                {editingIndex !== null ? <Edit3 size={18} /> : <Plus size={18} />}
                {editingIndex !== null ? "Update Policy" : "Add to Selection"}
              </button>
              {editingIndex !== null && (
                <button
                  onClick={resetForm}
                  className="w-full mt-4 py-2 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: PREMIUM PREVIEW TABLE */}
        <div className={`${cardClasses} flex flex-col lg:h-[calc(110vh-290px)] lg:overflow-y-auto custom-scrollbar pr-2`}>
          <div className="flex justify-between items-center mb-8 border-l-4 border-indigo-500 pl-5">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Preview</h2>
              <p className="text-[10px] font-bold text-slate-400  mt-1 tracking-widest">Review added policies</p>
            </div>
          </div>

          <div className="flex-1 bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest text-center w-16">Action</th>
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest">Group</th>
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest">Name</th>
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest">Type</th>
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest text-center">Info</th>
                    <th className="px-6 py-4 font-black text-[10px] tracking-widest text-center">Default</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentTerms.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-300">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Info size={32} />
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest">No policies selected</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentTerms.map((p, i) => {
                      const realIndex = indexOfFirstItem + i;
                      return (
                        <tr key={realIndex} className="group hover:bg-slate-50/80 transition-all duration-300">
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => editPolicy(realIndex)}
                                className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => removePolicy(realIndex)}
                                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-black text-slate-800 leading-tight">{p.policyGroup}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs font-bold text-slate-600 leading-tight">{p.policyName}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-tighter">
                              {p.policyType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setViewDescription(p.description);
                                setShowViewModal(true);
                              }}
                              className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <input
                                type="checkbox"
                                checked={p.isDefault || false}
                                onChange={(e) => {
                                  const updatedTerms = [...formData.terms];
                                  updatedTerms[realIndex] = { ...updatedTerms[realIndex], isDefault: e.target.checked };
                                  setFormData({ ...formData, terms: updatedTerms });
                                }}
                                className="w-4 h-4 rounded border-slate-200 text-purple-600 focus:ring-purple-500 cursor-pointer transition-all"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            
          </div>
        </div>
      </div>

      {/* MODAL: VIEW DESCRIPTION */}
      {showViewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex justify-center items-center z-[5000] p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 px-10 py-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Policy Insight</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Detailed terms overview</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            <div className="p-10">
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-purple-100 opacity-50"><Info size={40} /></div>
                <p className="relative z-10 text-sm font-medium text-slate-600 leading-relaxed italic bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                  "{viewDescription || "No detailed description provided for this specific policy."}"
                </p>
              </div>
            </div>
            <div className="px-10 py-6 bg-slate-50 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-8 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 transition-all">
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW POLICY (RE-PREMIUMIZED) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-[5000] p-4">
          <div className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center px-12 py-8 bg-slate-50 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight ">Master Policy Creator</h2>
                <p className="text-[10px] font-bold text-slate-400  tracking-[0.2em] mt-1">Register new criteria in your database</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 shadow-sm border border-slate-100 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="p-12 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Policy Name</label>
                  <input
                    value={newPolicy.policy_name}
                    onChange={(e) => setNewPolicy({ ...newPolicy, policy_name: e.target.value })}
                    className="w-full px-6 py-4 rounded-full bg-slate-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 shadow-inner"
                    placeholder="e.g. Exhibitor Safety"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Policy Type</label>
                  <select
                    value={newPolicy.policy_type}
                    onChange={(e) => setNewPolicy({ ...newPolicy, policy_type: e.target.value })}
                    className="w-full px-6 py-4 rounded-full bg-slate-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 shadow-inner appearance-none"
                  >
                    <option value="">Select Category</option>
                    <option>Exhibitor</option>
                    <option>Visitor</option>
                    <option>Vendor</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Policy Group</label>
                  <select
                    value={newPolicy.policy_group}
                    onChange={(e) => setNewPolicy({ ...newPolicy, policy_group: e.target.value })}
                    className="w-full px-6 py-4 rounded-full bg-slate-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-bold text-slate-700 shadow-inner appearance-none"
                  >
                    <option value="">Select Grouping</option>
                    <option>Cancellation Policy</option>
                    <option>Refund Policy</option>
                    <option>Safety Policy</option>
                    <option>Privacy Policy</option>
                    <option>Payment Policy</option>
                    <option>Paper Submission Guidelines</option>
                    <option>Registration Policy</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Detailed Description</label>
                  <textarea
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })}
                    rows="4"
                    className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-slate-600 shadow-inner resize-none leading-relaxed"
                    placeholder="Elaborate on the policy details here..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-5 pt-8">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-8 py-2 text-[10px] font-black text-slate-300 hover:text-slate-600  tracking-[0.2em] transition-all">
                  Discard
                </button>
                <button type="submit" disabled={loading} className="px-12 py-4 bg-slate-900 text-white rounded-full font-black text-xs  tracking-widest shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                  {loading ? "Synching..." : "Register Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5Terms;
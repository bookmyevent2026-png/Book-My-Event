import React, { useState } from "react";
import { Trash2, Edit, X } from "lucide-react";

const Step7FoodProvision = ({ formData, setFormData }) => {
  const foodItems = formData.foodProvision?.items || [];

  const [catererName, setCatererName] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [foodType, setFoodType] = useState("Veg");
  const [priceINR, setPriceINR] = useState("");
  const [priceUSD, setPriceUSD] = useState("");
  const [menuDetails, setMenuDetails] = useState("");

  const [warning, setWarning] = useState({ show: false, message: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null });
  const [editModal, setEditModal] = useState({ isOpen: false, index: null, data: {} });

  const showModal = (msg) => {
    setWarning({ show: true, message: msg });
    setTimeout(() => setWarning({ show: false, message: "" }), 5000);
  };

  const addFoodItem = () => {
    if (!catererName.trim()) return showModal("Caterer/Stall Name is required");
    if (!mealType) return showModal("Meal Type is required");
    if (!foodType) return showModal("Food Type is required");
    if (!priceINR || priceINR === "0") return showModal("Price in INR is required");

    const newItem = {
      catererName,
      mealType,
      foodType,
      priceINR,
      priceUSD: priceUSD || "0",
      menuDetails,
    };

    const updatedItems = [...foodItems, newItem];

    setFormData({
      ...formData,
      foodProvision: {
        ...formData.foodProvision,
        items: updatedItems,
      },
    });

    setCatererName("");
    setMealType("Breakfast");
    setFoodType("Veg");
    setPriceINR("");
    setPriceUSD("");
    setMenuDetails("");
  };

  const openEdit = (index) => {
    const item = foodItems[index];
    setEditModal({
      isOpen: true,
      index,
      data: { ...item },
    });
  };

  const handleUpdate = () => {
    const { data, index } = editModal;
    if (!data.catererName?.trim()) return showModal("Caterer Name is required");
    if (!data.priceINR || data.priceINR === "0") return showModal("Price in INR is required");

    const updatedItems = [...foodItems];
    updatedItems[index] = data;

    setFormData({
      ...formData,
      foodProvision: {
        ...formData.foodProvision,
        items: updatedItems,
      },
    });
    setEditModal({ isOpen: false, index: null, data: {} });
  };

  const handleDeleteConfirm = () => {
    const { index } = deleteModal;
    if (index === null) return;

    const updatedItems = foodItems.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      foodProvision: {
        ...formData.foodProvision,
        items: updatedItems,
      },
    });
    setDeleteModal({ isOpen: false, index: null });
  };

  const inputClasses =
    "w-full h-[45px] px-6 py-2 rounded-full bg-white border border-gray-200 text-gray-800 transition-all duration-200 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-400 text-sm";
  const selectClasses = `${inputClasses} appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill="%236b7280" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>')] bg-no-repeat bg-[right_1rem_center] cursor-pointer`;
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2 ml-4";
  const cardClasses = "bg-white p-6 rounded-3xl shadow-sm border border-gray-100";
  const sectionTitleClasses = "text-xl font-bold text-gray-800 mb-6 border-l-4 border-purple-500 pl-4";
  const tableHeaderClasses = "bg-gray-50 text-gray-600 text-[12px] font-bold  tracking-wider p-4 text-left border-b border-gray-100";
  const tableCellClasses = "p-4 text-sm text-gray-700 border-b border-gray-50";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE: FORM */}
        <div className={`${cardClasses} space-y-4 md:h-[calc(100vh-290px)] md:overflow-y-auto custom-scrollbar pr-1`}>
          <h2 className={sectionTitleClasses}>Food Provision Details</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
              <div className="sm:col-span-2">
                <label className={labelClasses}>Caterer / Stall Name <span className="text-red-500">*</span></label>
                <input
                  maxLength={50}
                  placeholder="e.g. Royal Caterers"
                  value={catererName}
                  onChange={(e) => setCatererName(e.target.value)}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Meal Type <span className="text-red-500">*</span></label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className={selectClasses}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="High Tea">High Tea</option>
                  <option value="All Day">All Day</option>
                </select>
              </div>

              <div>
                <label className={labelClasses}>Food Type <span className="text-red-500">*</span></label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className={selectClasses}
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-6 sm:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-500 ml-4">Price In INR <span className="text-red-500">*</span></label>
                  <input
                    placeholder="₹ 0.00"
                    value={priceINR}
                    maxLength={10}
                    onChange={(e) => setPriceINR(e.target.value.replace(/[^0-9.]/g, ""))}
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-bold text-gray-500 ml-4">Price In USD</label>
                  <input
                    placeholder="$ 0.00"
                    value={priceUSD}
                    maxLength={10}
                    onChange={(e) => setPriceUSD(e.target.value.replace(/[^0-9.]/g, ""))}
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            <div className="px-2 sm:col-span-2">
              <label className={labelClasses}>Menu Details / Included Items</label>
              <textarea
                placeholder="e.g. Rice, Dal, Roti, Paneer Butter Masala, Sweet"
                value={menuDetails}
                onChange={(e) => setMenuDetails(e.target.value)}
                rows={3}
                className={`${inputClasses} h-auto py-3 rounded-2xl resize-none`}
              />
            </div>

            <div className="pt-4 border-t border-gray-100 sm:col-span-2">
              <button
                onClick={addFoodItem}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-full shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Confirm & Add Food Provision
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: SUMMARY TABLE */}
        <div className="space-y-8">
          <div className={cardClasses}>
            <h2 className={sectionTitleClasses}>Food Provision Summary</h2>
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className={tableHeaderClasses}>Action</th>
                      <th className={tableHeaderClasses}>Caterer</th>
                      <th className={tableHeaderClasses}>Meal & Type</th>
                      <th className={tableHeaderClasses}>Price (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foodItems.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-12 text-center text-gray-400 italic bg-gray-50/30">
                          No food provisions added yet. Fill the form on the left.
                        </td>
                      </tr>
                    ) : (
                      foodItems.map((item, index) => (
                        <tr key={index} className="hover:bg-indigo-50/50 transition-colors duration-200 group">
                          <td className="p-4 border-b border-gray-50 flex gap-3">
                            <button
                              onClick={() => openEdit(index)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteModal({ isOpen: true, index })}
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                          <td className={`${tableCellClasses} font-semibold text-purple-700`}>{item.catererName}</td>
                          <td className={tableCellClasses}>
                            <span className="font-bold block text-gray-800">{item.mealType}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.foodType === 'Veg' ? 'bg-green-100 text-green-700' : item.foodType === 'Non-Veg' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                              {item.foodType}
                            </span>
                          </td>
                          <td className={`${tableCellClasses} font-bold`}>{item.priceINR}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WARNING TOAST */}
      {warning.show && (
        <div className="fixed bottom-6 right-6 z-[110] animate-in slide-in-from-right-full duration-500">
          <div className="bg-[#ff8a3d] text-white p-5 rounded-xl shadow-2xl flex items-start gap-4 max-w-sm relative overflow-hidden group border-l-8 border-orange-600/30">
            <div className="flex-1 pr-6">
              <h3 className="font-bold text-lg mb-1 leading-tight">Warning</h3>
              <p className="text-sm font-medium opacity-95">{warning.message}</p>
            </div>
            <button
              onClick={() => setWarning({ show: false, message: "" })}
              className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-indigo-600 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">Edit Food Provision</h3>
              <button onClick={() => setEditModal({ isOpen: false, index: null, data: {} })} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                value={editModal.data.catererName || ""}
                onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, catererName: e.target.value } }))}
                className={inputClasses}
                placeholder="Caterer Name"
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={editModal.data.mealType || ""}
                  onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, mealType: e.target.value } }))}
                  className={selectClasses}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="High Tea">High Tea</option>
                  <option value="All Day">All Day</option>
                </select>
                <select
                  value={editModal.data.foodType || ""}
                  onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, foodType: e.target.value } }))}
                  className={selectClasses}
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={editModal.data.priceINR || ""}
                  onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, priceINR: e.target.value.replace(/[^0-9.]/g, "") } }))}
                  className={inputClasses}
                  placeholder="Price INR"
                />
                <input
                  value={editModal.data.priceUSD || ""}
                  onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, priceUSD: e.target.value.replace(/[^0-9.]/g, "") } }))}
                  className={inputClasses}
                  placeholder="Price USD"
                />
              </div>
              <textarea
                value={editModal.data.menuDetails || ""}
                onChange={(e) => setEditModal(prev => ({ ...prev, data: { ...prev.data, menuDetails: e.target.value } }))}
                className={`${inputClasses} h-auto py-3 rounded-2xl resize-none`}
                placeholder="Menu Details"
                rows={3}
              />
              <button onClick={handleUpdate} className="w-full py-3 bg-indigo-600 text-white rounded-full font-bold">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Delete Food Provision</h3>
            <p className="text-sm text-gray-600">Are you sure you want to remove this item?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, index: null })}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-full font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-600 text-white rounded-full font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step7FoodProvision;
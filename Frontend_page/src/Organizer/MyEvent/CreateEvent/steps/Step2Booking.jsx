import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X } from "lucide-react";
import CustomTimePicker from "../TimePickerClock";

const Step2Booking = ({ formData, setFormData }) => {
  const [taxSearch, setTaxSearch] = useState("");
  const [isTaxDropdownOpen, setIsTaxDropdownOpen] = useState(false);
  const taxDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taxDropdownRef.current && !taxDropdownRef.current.contains(event.target)) {
        setIsTaxDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const taxOptions = [
    "Ticket - CGST",
    "Ticket - SGST",
    "Ticket - IGST",
    "Food - GST"
  ];

  const handleTaxToggle = (tax) => {
    const currentTaxes = formData.booking?.taxes || [];
    let newTaxes;
    if (currentTaxes.includes(tax)) {
      newTaxes = currentTaxes.filter(t => t !== tax);
    } else {
      newTaxes = [...currentTaxes, tax];
    }
    setFormData({
      ...formData,
      booking: {
        ...formData.booking,
        taxes: newTaxes
      }
    });
  };

  const handleSelectAllTaxes = () => {
    const currentTaxes = formData.booking?.taxes || [];
    const filteredOptions = taxOptions.filter(t => t.toLowerCase().includes(taxSearch.toLowerCase()));
    
    // If all currently visible options are selected, deselect them
    const allVisibleSelected = filteredOptions.every(t => currentTaxes.includes(t));
    
    let newTaxes;
    if (allVisibleSelected) {
      newTaxes = currentTaxes.filter(t => !filteredOptions.includes(t));
    } else {
      const toAdd = filteredOptions.filter(t => !currentTaxes.includes(t));
      newTaxes = [...currentTaxes, ...toAdd];
    }

    setFormData({
      ...formData,
      booking: { ...formData.booking, taxes: newTaxes }
    });
  };

  const formatDate = (date) => {
    if (!date) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`; // DD/MM/YYYY
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for chargeType
    if (name === "chargeType") {
      let updatedData = {
        ...formData,
        booking: {
          ...formData.booking,
          chargeType: value,
        },
      };
      console.log("Updated Booking Data:", formData);

      // If Free or Donation → clear paid fields
      if (value === "Free" || value === "Donation") {
        updatedData.booking = {
          ...updatedData.booking,
          includeTax: false,
          razorpayKey: "",
          priceType: "",
          currency: "",
          earlyBirdExpire: "",
          earlyBirdExpireDate: "",
          earlyBirdExpireTime: ""
        };
      }

      setFormData(updatedData);
      return;
    }

    // Special handling for includeTax
    if (name === "includeTax") {
      if (!checked) {
        setIsTaxDropdownOpen(false);
        setTaxSearch("");
      }
      setFormData({
        ...formData,
        booking: {
          ...formData.booking,
          includeTax: checked,
          taxes: [],
        },
      });
      return;
    }

    setFormData({
      ...formData,
      booking: {
        ...formData.booking,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  const isPaid = formData.booking?.chargeType === "Paid";

  useEffect(() => {
    if (formData.booking?.earlyBirdExpireDate && formData.booking?.earlyBirdExpireTime) {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const dateParts = formData.booking.earlyBirdExpireDate.split("/");
      if (dateParts.length === 3) {
        const yyyymmdd = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        // Convert HH:MM AM/PM to 24hr HH:MM
        let [time, modifier] = formData.booking.earlyBirdExpireTime.split(" ");
        let [hours, minutes] = time.split(":");
        if (hours === "12") hours = "00";
        if (modifier === "PM") hours = parseInt(hours, 10) + 12;
        const formattedTime = `${String(hours).padStart(2, "0")}:${minutes}`;

        const combined = `${yyyymmdd}T${formattedTime}`;

        if (formData.booking.earlyBirdExpire !== combined) {
          setFormData(prev => ({
            ...prev,
            booking: {
              ...prev.booking,
              earlyBirdExpire: combined
            }
          }));
        }
      }
    }
  }, [formData.booking?.earlyBirdExpireDate, formData.booking?.earlyBirdExpireTime]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50/50 rounded-2xl">
      {/* LEFT SECTION */}
      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 md:h-[calc(100vh-290px)] md:overflow-y-auto custom-scrollbar pr-2 ">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Booking Information</h2>
        </div>

        {/* Booking Dates */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
             When does your Booking Start for the event? <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            {/* START DATE */}
            <div className="space-y-1.5">
              <div className="relative group w-full">
                <DatePicker
                  selected={
                    formData.booking?.bookingStartDate
                      ? new Date(
                        formData.booking.bookingStartDate
                          .split("/")
                          .reverse()
                          .join("-"),
                      )
                      : null
                  }
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      booking: {
                        ...formData.booking,
                        bookingStartDate: formatDate(date),
                      },
                    });
                  }}
                  openToDate={new Date()}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText=" Booking Start Date"
                  className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm cursor-pointer"
                  wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
              </div>
            </div>

            {/* END DATE */}
            <div className="space-y-1.5">
              <div className="relative group w-full">
                <DatePicker
                  selected={
                    formData.booking?.bookingEndDate
                      ? new Date(
                        formData.booking.bookingEndDate
                          .split("/")
                          .reverse()
                          .join("-"),
                      )
                      : null
                  }
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      booking: {
                        ...formData.booking,
                        bookingEndDate: formatDate(date),
                      },
                    });
                  }}
                  openToDate={new Date()}
                  minDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText=" Booking End Date"
                  className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm cursor-pointer"
                  wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div className="group mb-6">
  <h2 className="text-xl font-bold text-gray-800 mb-4">
    Registration Information
  </h2>

  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
    What's the Capacity for Your Event? <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    name="capacity"
    placeholder="Max Capacity"
    inputMode="numeric"
    maxLength={5}
    value={formData.booking?.capacity || ""}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        handleChange(e);
      }
    }}
    onKeyDown={(e) => {
      if (["e", "E", "+", "-", "."].includes(e.key)) {
        e.preventDefault();
      }
    }}
    className="w-full h-16 bg-gray-50 border-0 ring-1 ring-gray-200 px-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-lg"
  />
</div>
        {/* Pass Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Pass Configuration
          </label>
          <div className="flex bg-gray-50 p-1 rounded-xl ring-1 ring-gray-200">
            {["Single Pass", "Group Pass"].map((opt) => (
              <label key={opt} className="flex-1">
                <input
                  type="radio"
                  name="passType"
                  value={opt}
                  className="hidden peer"
                  checked={formData.booking?.passType === opt}
                  onChange={handleChange}
                />
                <div className="text-center py-3 rounded-xl transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-lg text-gray-500 text-xs font-bold tracking-widest">
                  {opt}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Display On Pass */}
        {formData.booking?.passType === "Single Pass" && (
          <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 space-y-4 animate-fadeIn">
            <label className="block text-sm font-bold text-indigo-900 ml-1">
              Customize Ticket Fields
            </label>

            {[
              {
                id: "title",
                label: "Title",
                type: "titleType",
                selection: "titleSelection",
              },
              {
                id: "designation",
                label: "Designation",
                type: "designationType",
                selection: "designationSelection",
              },
              {
                id: "company",
                label: "Company",
                type: "companyType",
                selection: "companySelection",
              },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    name={field.id}
                    placeholder={field.label}
                    value={formData.booking?.[field.id] || ""}
                    className="flex-1 bg-white border-0 ring-1 ring-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    onChange={handleChange}
                  />
                  <div className="flex bg-white ring-1 ring-gray-200 rounded-lg p-1">
                    {["Editable", "Selection"].map((mode) => (
                      <label key={mode} className="cursor-pointer">
                        <input
                          type="radio"
                          name={field.type}
                          value={mode}
                          className="hidden peer"
                          onChange={handleChange}
                          checked={formData.booking?.[field.type] === mode}
                        />
                        <div className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight text-gray-400 peer-checked:bg-indigo-600 peer-checked:text-white transition-all">
                          {mode}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.booking?.[field.type] === "Selection" && (
                  <input
                    name={field.selection}
                    placeholder="Enter options (comma separated)"
                    value={formData.booking?.[field.selection] || ""}
                    className="w-full bg-white border-0 ring-1 ring-indigo-200 p-2 rounded-lg text-xs italic outline-none focus:ring-2 focus:ring-indigo-400"
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Entry Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
            Entry Permissions
          </label>
          <div className="flex bg-gray-50 p-1 rounded-xl ring-1 ring-gray-200">
            {["Single Entry", "Multi Entry"].map((opt) => (
              <label key={opt} className="flex-1">
                <input
                  type="radio"
                  name="entryType"
                  value={opt}
                  className="hidden peer"
                  checked={formData.booking?.entryType === opt}
                  onChange={handleChange}
                />
                <div className="text-center py-3 rounded-xl transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-lg text-gray-500 text-xs font-bold tracking-widest">
                  {opt}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 md:h-[calc(100vh-290px)] md:overflow-y-auto custom-scrollbar pr-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-amber-50 rounded-lg">
            <span className="text-xl text-amber-600 font-bold">₹</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Price Information</h2>
        </div>

        {/* Charge Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 ml-1">
           How much do You Want to Charge for Passes?  <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-1.5 rounded-2xl ring-1 ring-gray-200">
            {["Paid", "Free", "Donation"].map((opt) => (
              <label key={opt} className="cursor-pointer">
                <input
                  type="radio"
                  name="chargeType"
                  value={opt}
                  className="hidden peer"
                  checked={formData.booking?.chargeType === opt}
                  onChange={handleChange}
                />
                <div className="text-center py-3 rounded-xl transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:shadow-lg text-gray-500 text-xs font-bold tracking-widest">
                  {opt}
                </div>
              </label>
            ))}
          </div>
        </div>
         <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  name="includeTax"
                  checked={formData.booking?.includeTax || false}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-3 text-sm font-bold text-amber-900">
                  Include GST/Tax
                </span>
              </label>

        <div className="space-y-4 pt-2">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Max Number of Passes Allowed/Person<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="maxPass"
              placeholder="Max Passes / Person"
              value={formData.booking?.maxPass || ""}
              inputMode="numeric"
              maxLength={5}
              onChange={(e) => {
                let value = e.target.value;

                // ✅ allow only digits OR empty
                value = value.replace(/\D/g, "");

                handleChange({
                  target: {
                    name: "maxPass",
                    value,
                  },
                });
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">
              Razorpay API Key
            </label>
            <input
              name="razorpayKey"
              placeholder="rzp_live_..."
              value={formData.booking?.razorpayKey || ""}
              onChange={handleChange}
              className="w-full bg-gray-50 border-0 ring-1 ring-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-mono text-sm"
            />
          </div>

          {/* ONLY PAID */}
          {isPaid && (
            <div className="space-y-4 p-5 bg-amber-50/30 rounded-2xl border border-amber-100 animate-slideDown">


              <div className="grid grid-cols-2 gap-4">
                <div className={formData.booking?.includeTax ? "col-span-2 space-y-1.5" : "space-y-1.5"}>
                  <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                    Price Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priceType"
                    value={formData.booking?.priceType || ""}
                    onChange={handleChange}
                    className="w-full bg-white border-0 ring-1 ring-amber-200 p-2.5 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Tier</option>
                    <option>National</option>
                    <option>International</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                    Currency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currency"
                    value={formData.booking?.currency || ""}
                    onChange={handleChange}
                    className="w-full bg-white border-0 ring-1 ring-amber-200 p-2.5 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Currency</option>
                    <option value="INR (₹)">Indian Rupee - INR (₹)</option>
                    <option value="USD ($)">US Dollar - USD ($)</option>
                  </select>
                </div>

                {formData.booking?.includeTax && (
                  <div className="space-y-1.5 relative" ref={taxDropdownRef}>
                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                      Select Tax <span className="text-red-500">*</span>
                    </label>
                    <div 
                      className="w-full bg-white border-0 ring-1 ring-amber-200 p-2.5 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm flex items-center justify-between cursor-pointer h-[42px]"
                      onClick={() => setIsTaxDropdownOpen(!isTaxDropdownOpen)}
                    >
                      <span className="truncate text-gray-600 text-sm">
                        {(formData.booking?.taxes || []).length > 0 
                          ? (formData.booking?.taxes || []).join(", ") 
                          : "Select Tax"}
                      </span>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTaxDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>

                    {isTaxDropdownOpen && (
                      <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        {/* Search header */}
                        <div className="p-3 border-b border-gray-100 flex items-center gap-3 bg-white">
                          <input
                            type="checkbox"
                            checked={
                              taxOptions.filter(t => t.toLowerCase().includes(taxSearch.toLowerCase())).length > 0 &&
                              taxOptions.filter(t => t.toLowerCase().includes(taxSearch.toLowerCase()))
                                .every(t => (formData.booking?.taxes || []).includes(t))
                            }
                            onChange={handleSelectAllTaxes}
                            className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <div className="flex-1 flex items-center px-3 py-1.5 border border-amber-200 rounded-lg focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500 transition-all bg-white">
                            <input 
                              type="text" 
                              value={taxSearch}
                              onChange={(e) => setTaxSearch(e.target.value)}
                              placeholder="Search Tax..."
                              className="w-full text-sm outline-none bg-transparent text-gray-700"
                            />
                            <svg className="w-4 h-4 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsTaxDropdownOpen(false); 
                              setTaxSearch(''); 
                            }} 
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <X size={18} />
                          </button>
                        </div>

                        {/* Options */}
                        <div className="max-h-60 overflow-y-auto bg-white">
                          {taxOptions.filter(t => t.toLowerCase().includes(taxSearch.toLowerCase())).map((tax) => (
                            <label key={tax} className="flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors hover:bg-amber-50 bg-white">
                              <input
                                type="checkbox"
                                checked={(formData.booking?.taxes || []).includes(tax)}
                                onChange={() => handleTaxToggle(tax)}
                                className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700 font-medium">{tax}</span>
                            </label>
                          ))}
                          {taxOptions.filter(t => t.toLowerCase().includes(taxSearch.toLowerCase())).length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500 bg-white">No options found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-amber-900 ml-1">
                  When does your Early Bird amount need to Expire for the event? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                      Cutoff Date
                    </label>
                    <div className="relative group">
                      <DatePicker
                        selected={
                          formData.booking?.earlyBirdExpireDate
                            ? new Date(
                              formData.booking.earlyBirdExpireDate
                                .split("/")
                                .reverse()
                                .join("-")
                            )
                            : null
                        }
                        onChange={(date) => {
                          setFormData({
                            ...formData,
                            booking: {
                              ...formData.booking,
                              earlyBirdExpireDate: formatDate(date),
                            },
                          });
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/YYYY"
                        className="w-full bg-white border-0 ring-1 ring-amber-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm cursor-pointer"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-amber-700 uppercase tracking-wider ml-1">
                      Cutoff Time
                    </label>
                    <CustomTimePicker
                      value={formData.booking?.earlyBirdExpireTime || ""}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          booking: {
                            ...prev.booking,
                            earlyBirdExpireTime: value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2Booking;
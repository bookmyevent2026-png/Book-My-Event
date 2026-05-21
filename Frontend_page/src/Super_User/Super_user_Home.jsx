import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Rocket,
  Calendar,
  Clock,
  Ticket,
  Users,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  LayoutGrid,
  Grid,
  LayoutList,
  List,
  Menu,
} from "lucide-react";
import { Eye, CheckCircle, AlertCircle, Trash2, ShieldCheck, ShieldX, History } from "lucide-react";
import MediaRenderer from "../components/MediaRenderer";

import { useLocation } from "react-router-dom";
import {
  getAllEvents,
  updateEventStatus,
  getFullEventDetails,
  deleteEvent,
} from "../Services/api";

/* 🎨 ENHANCED IMAGE SLIDER */
const ImageSlider = ({ images = [] }) => {
  const sliderImages =
    images.length === 1
      ? [...images, ...images, ...images]
      : [...images, ...images];

  return (
    <div className="relative w-32 h-24 overflow-hidden rounded-2xl shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent z-10"></div>
      <div className="flex animate-scroll">
        {sliderImages.map((img, i) => (
          <MediaRenderer
            key={i}
            src={img.url ? img.url : img}
            type={img.type ? img.type : null}
            className="w-32 h-24 object-cover flex-shrink-0 transition-transform duration-300"
          />
        ))}
      </div>
    </div>
  );
};

/* STEPPER STEPS CONFIGURATION - BASE STEPS */
const GET_STEPS = (fullData) => {
  const steps = [
    { id: 1, name: "Details", icon: "📋" },
    { id: 2, name: "Booking", icon: "🎫" },
  ];

  if (fullData?.eventDetails?.food === 1 || fullData?.eventDetails?.food === true || fullData?.eventDetails?.food === "true") {
    steps.push({ id: 9, name: "Food", icon: "🍱" });
  }

  if (fullData?.eventDetails?.vehicle_pass === 1 || fullData?.eventDetails?.vehicle_pass === true || fullData?.eventDetails?.vehicle_pass === "true") {
    steps.push({ id: 10, name: "Vehicle", icon: "🚗" });
  }

  steps.push(
    { id: 3, name: "Stalls", icon: "🏪" },
    { id: 4, name: "Documents", icon: "📄" },
    { id: 5, name: "Terms", icon: "📜" },
    { id: 6, name: "Vendors", icon: "🤝" },
    { id: 7, name: "Sponsors", icon: "💎" },
    { id: 8, name: "Guests", icon: "⭐" }
  );

  return steps;
};


/* 🛠️ FORMATTING HELPERS */
const formatTime = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour}:${m} ${ampm}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  // If it's a full GMT string like "Wed, 06 May 2026 00:00:00 GMT"
  // we take only "Wed, 06 May 2026"
  const parts = dateString.split(" ");
  if (parts.length >= 4) {
    return parts.slice(0, 4).join(" ");
  }
  return dateString;
};


/* STEP CONTENT COMPONENT */
const StepContent = ({ step, fullData }) => {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Event Name
              </label>
              <p className="text-xl font-light text-gray-900 group-hover:text-teal-700 transition">
                {fullData?.eventDetails?.event_name || "-"}
              </p>
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Category
              </label>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded-full text-sm font-medium">
                {fullData?.eventDetails?.category || "-"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Venue
              </label>
              <p className="text-lg font-light text-gray-800">
                {fullData?.eventDetails?.venue || "-"}
              </p>
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-teal-600 mb-2 uppercase tracking-wider">
                Address
              </label>
              <p className="text-lg font-light text-gray-800">
                {fullData?.eventDetails?.address || "-"}
              </p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-teal-100/50">
            <label className="block text-xs font-semibold text-teal-600 mb-3 uppercase tracking-wider">
              Description
            </label>
            <p className="text-gray-700 font-light leading-relaxed">
              {fullData?.eventDetails?.description || "-"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">
                Start Date
              </p>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(fullData?.eventDetails?.start_date)}
              </p>
            </div>
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">
                Start Time
              </p>
              <p className="text-lg font-medium text-gray-900">
                {fullData?.eventDetails?.start_time}
              </p>
            </div>
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">
                End Date
              </p>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(fullData?.eventDetails?.end_date)}
              </p>
            </div>
            <div className="hover:transform hover:scale-105 transition duration-300">
              <p className="text-xs text-teal-600 font-semibold mb-1 uppercase tracking-wider">
                End Time
              </p>
              <p className="text-lg font-medium text-gray-900">
                {fullData?.eventDetails?.end_time || "-"}
              </p>
            </div>
          </div>

        </div>
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Capacity
              </label>
              <p className="text-4xl font-bold">
                {fullData?.booking?.capacity || "0"}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Registered
              </label>
              <p className="text-4xl font-bold">
                {fullData?.booking?.registered || "0"}
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition duration-500"></div>
              <label className="block text-xs font-semibold mb-3 uppercase tracking-wider opacity-90">
                Available
              </label>
              <p className="text-4xl font-bold">
                {(fullData?.booking?.capacity || 0) -
                  (fullData?.booking?.registered || 0)}
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
            <label className="block text-xs font-semibold text-teal-600 mb-3 uppercase tracking-wider">
              Booking Status
            </label>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${(fullData?.booking?.status || fullData?.eventDetails?.status) === "APPROVED" ? "bg-emerald-500" :
                (fullData?.booking?.status || fullData?.eventDetails?.status) === "REJECTED" ? "bg-rose-500" :
                  "bg-amber-500"
                }`}></div>
              <p className="text-lg font-medium text-gray-900">
                {fullData?.booking?.status || fullData?.eventDetails?.status || "Pending"}
              </p>
            </div>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="space-y-4">
          {fullData?.layout?.stalls && fullData.layout.stalls.length > 0 ? (
            fullData.layout.stalls.map((stall, i) => (
              <div
                key={i}
                className="group relative p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 transition duration-300"></div>
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {stall.stall_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Size:{" "}
                      <span className="font-medium">{stall.size || "N/A"}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
                      ₹{stall.price_inr || "0"}
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                      {stall.status || "Available"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">
              No stalls available
            </p>
          )}
        </div>
      );

    case 4:
      return (
        <div className="space-y-4">
          {fullData?.documents?.docs && fullData.documents.docs.length > 0 ? (
            fullData.documents.docs.map((doc, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition transform">
                      📄
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {doc.doc_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        Doc #{doc.doc_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-700 font-semibold text-sm rounded-full">
                      {doc.status || "Verified"}
                    </span>
                    {doc.file_url && (
                      <button
                        onClick={() => window.setDocPreview(doc.file_url)}
                        className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all duration-200"
                        title="View Document"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No documents found for this event.</p>
          )}
        </div>
      );


    case 5:
      return (
        <div className="space-y-4">
          {fullData?.terms && fullData.terms.length > 0 ? (
            fullData.terms.map((term, i) => (
              <div
                key={i}
                className="group p-6 border-l-4 border-teal-500 bg-gradient-to-r from-slate-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {term.policy_group}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {term.policy_type}
                    </p>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {term.description || "Policy details"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No terms defined</p>
          )}
        </div>
      );

    case 6:
      return (
        <div className="space-y-4">
          {fullData?.vendors && fullData.vendors.length > 0 ? (
            fullData.vendors.map((vendor, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {vendor.vendor_name || "Vendor"}
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-teal-600">✉</span>
                        {vendor.contact_email || "No email"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-teal-600">📞</span>
                        {vendor.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 font-bold text-xs rounded-full uppercase tracking-wider">
                    {vendor.status || "Active"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No vendors found for this event.</p>
          )}
        </div>
      );

    case 7:
      return (
        <div className="space-y-4">
          {fullData?.sponsors && fullData.sponsors.length > 0 ? (
            fullData.sponsors.map((sponsor, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-amber-400 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {sponsor.sponsor_name || "Sponsor"}
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-amber-600 font-bold">Type:</span>
                        {sponsor.sponsorship_type || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-amber-600">✉</span>
                        {sponsor.contact_email || sponsor.email || "No email"}
                      </p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 font-bold text-xs rounded-full uppercase tracking-wider">
                    Sponsor
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No sponsors found for this event.</p>
          )}
        </div>
      );

    case 8:
      return (
        <div className="space-y-4">
          {fullData?.guests && fullData.guests.length > 0 ? (
            fullData.guests.map((guest, i) => (
              <div
                key={i}
                className="group p-5 border-2 border-gray-200 rounded-2xl hover:border-purple-400 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-white"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition duration-300 shadow-inner">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-xl">
                      {guest.guest_name || "Guest Name"}
                    </p>
                    <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mt-1">
                      {guest.designation || "Speaker/Guest"}
                    </p>
                    <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
                      <span className="text-purple-600">📞</span>
                      {guest.contact || "No contact info"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No special guests found for this event.</p>
          )}
        </div>
      );

    case 9:
      return (
        <div className="space-y-4">
          {fullData?.food_items && fullData.food_items.length > 0 ? (
            fullData.food_items.map((item, i) => (
              <div key={i} className="p-6 bg-white border-2 border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-teal-600 uppercase">Caterer</label>
                    <p className="text-lg font-semibold">{item.caterer_name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-teal-600 uppercase">Meal Type</label>
                    <p className="text-lg font-semibold">{item.meal_type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-teal-600 uppercase">Food Type</label>
                    <p className="text-lg font-semibold">{item.food_type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-teal-600 uppercase">Price (INR)</label>
                    <p className="text-lg font-semibold">₹{item.price_inr}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="text-xs font-bold text-teal-600 uppercase">Menu Details</label>
                  <p className="text-gray-700 mt-1">{item.menu_details}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center py-12 text-gray-500">No food provision details found.</p>
          )}
        </div>
      );

    case 10:
      return (
        <div className="space-y-8">
          <div>
            <h4 className="text-sm font-bold text-teal-600 mb-4 uppercase">Vehicle Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullData?.vehicle_details?.map((v, i) => (
                <div key={i} className="p-5 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
                  <label className="text-xs font-bold text-gray-400 uppercase">Vehicle Type</label>
                  <p className="text-lg font-bold text-gray-900">{v.vehicle_type}</p>
                  <div className="mt-3 flex gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-teal-600 uppercase">INR</label>
                      <p className="font-bold">₹{v.price_inr}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-teal-600 uppercase">USD</label>
                      <p className="font-bold">${v.price_usd}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-teal-600 mb-4 uppercase">Vehicle Add-ons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullData?.vehicle_addons?.map((a, i) => (
                <div key={i} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{a.addon_name}</p>
                    {a.is_parent === 1 && <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">Parent</span>}
                  </div>
                  <p className="font-black text-teal-600">₹{a.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

const SuperUserEvents = () => {
  const menuRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const [viewMode, setViewMode] = useState("medium"); // medium, large, small, list, details
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [docPreview, setDocPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const location = useLocation();

  useEffect(() => {
    if (location.state?.fromLogin) {
      setToast({ message: "Login Successful! Welcome to SuperUser Page", type: "success" });
      // Optional: clear state to prevent toast showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto-close toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);



  useEffect(() => {
    fetchEvents();
  }, []);

  // Click away listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      console.log("Fetched events:", res.events);
      setEvents(res.events);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= PAGINATION LOGIC =================
  const getEventsPerPage = () => {
    if (viewMode === "large" || viewMode === "medium") return 6;
    return 8; // small, compact, list, details
  };

  const eventsPerPage = getEventsPerPage();
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);



  const getStatusColor = (status) => {
    if (status === "APPROVED") return "text-emerald-600 bg-emerald-50";
    if (status === "REJECTED") return "text-red-600 bg-red-50";
    return "text-amber-600 bg-amber-50";
  };

  /* APPROVE / REJECT */
  const handleStatus = async (id, status) => {
    try {
      const res = await updateEventStatus(id, status);

      if (res?.success) {
        setPopup({
          show: true,
          message: `Event ${status} successfully ✅`,
          type: "success",
        });
        fetchEvents();

        // Update local fullData if modal is open
        if (selectedEvent === id && fullData) {
          setFullData((prev) => ({
            ...prev,
            eventDetails: {
              ...prev.eventDetails,
              status: status,
            },
            booking: prev.booking ? {
              ...prev.booking,
              status: status,
            } : prev.booking
          }));
        }
      } else {
        setPopup({
          show: true,
          message: "Something went wrong ❌",
          type: "error",
        });
      }

      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      setPopup({ show: true, message: "Server error ❌", type: "error" });
    }
  };

  /* VIEW FULL DETAILS */
  const handleView = async (id) => {
    const res = await getFullEventDetails(id);
    setFullData(res);
    setSelectedEvent(id);
    setCurrentStep(1);
    setOpenMenu(null);
  };

  /* CLOSE MODAL */
  const closeModal = () => {
    setSelectedEvent(null);
    setCurrentStep(1);
    setFullData(null);
  };

  /* NAVIGATION */
  const goNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const executeDelete = async () => {
    try {
      const res = await deleteEvent(deleteConfirm.id);
      if (res?.success || res?.message === "Event deleted successfully") {
        setPopup({
          show: true,
          message: "Event deleted successfully 🗑️",
          type: "success",
        });
        fetchEvents();
      } else {
        setPopup({
          show: true,
          message: "Failed to delete event ❌",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setPopup({ show: true, message: "Server error ❌", type: "error" });
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 p-8">
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          className={`fixed top-6 right-6 flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl z-[9999] animate-slide-in border-l-4 ${toast.type === "success"
            ? "bg-white border-emerald-500"
            : "bg-white border-rose-500"
            }`}
        >
          <div className={`p-2 rounded-xl ${toast.type === "success" ? "bg-emerald-100" : "bg-rose-100"}`}>
            {toast.type === "success" ? (
              <CheckCircle size={20} className="text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="text-rose-600" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-800 font-bold text-sm tracking-tight">
              {toast.type === "success" ? "Success" : "Notification"}
            </span>
            <span className="text-slate-500 text-xs font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="ml-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-light text-gray-900 tracking-tight">
            Event{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
              Showcase
            </span>
          </h1>
          <p className="text-gray-600 mt-2 font-light">
            Manage and approve upcoming events
          </p>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = "/";
            }}
            className="px-6 py-2.5 bg-white text-red-600 border border-red-100 rounded-xl shadow-sm font-bold hover:bg-red-50 transition-all active:scale-95"
          >
            Logout
          </button>

          <div className="flex items-center gap-4">
            {/* View Toggle Button */}
            <div className="relative">
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md border border-gray-100 hover:bg-teal-50 hover:border-teal-200 transition-all duration-300"
              >
                <Menu size={18} className="text-teal-600" />
                <span className="text-sm font-semibold text-gray-700">View</span>
              </button>

              {showViewMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 overflow-hidden py-2 animate-fade-in">
                  {[
                    { id: "large", name: "Extra large icons", icon: LayoutGrid },
                    { id: "medium", name: "Large icons", icon: Grid },
                    { id: "small", name: "Medium icons", icon: LayoutList },
                    { id: "compact", name: "Small icons", icon: List },
                    { id: "list", name: "List", icon: Menu },
                    { id: "details", name: "Details", icon: Menu },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setViewMode(mode.id);
                        setShowViewMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-teal-50 transition ${viewMode === mode.id
                        ? "text-teal-600 bg-teal-50 font-semibold"
                        : "text-gray-600"
                        }`}
                    >
                      <mode.icon size={16} />
                      <span className="text-sm">{mode.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
              <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
              <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div
        className={`grid gap-6 mb-8 transition-all duration-500 ${viewMode === "large"
          ? "grid-cols-1"
          : viewMode === "medium"
            ? "grid-cols-1 md:grid-cols-2"
            : viewMode === "small"
              ? "grid-cols-1 md:grid-cols-3"
              : viewMode === "compact"
                ? "grid-cols-1 md:grid-cols-4"
                : "grid-cols-1"
          }`}
      >
        {currentEvents.map((e, idx) => (
          <div
            key={idx}
            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-teal-200 animate-fade-in ${viewMode === "list" || viewMode === "details"
              ? "flex flex-col md:flex-row items-center p-4 gap-6"
              : "flex flex-col"
              }`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400/0 via-transparent to-cyan-400/0 group-hover:from-teal-400/5 group-hover:to-cyan-400/5 transition-all duration-500 pointer-events-none"></div>

            {/* TOP SECTION / IMAGE */}
            <div
              className={`relative flex justify-between items-start ${viewMode === "list" || viewMode === "details"
                ? "w-full md:w-auto p-0"
                : "p-6"
                }`}
            >
              <div
                className={`flex items-center gap-4 flex-1 ${viewMode === "list" || viewMode === "details"
                  ? "flex-col md:flex-row text-center md:text-left"
                  : ""
                  }`}
              >
                <div className="transform group-hover:scale-110 transition duration-500">
                  <ImageSlider
                    images={
                      e.banner_url && e.banner_url !== "null"
                        ? [{ url: e.banner_url, type: e.banner_type }]
                        : []
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2
                    className={`font-bold text-gray-900 group-hover:text-teal-700 transition line-clamp-2 ${viewMode === "large"
                      ? "text-2xl"
                      : viewMode === "compact"
                        ? "text-base"
                        : "text-xl"
                      }`}
                  >
                    {e.event_name}
                  </h2>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-semibold">
                    {e.category}
                  </p>
                </div>
              </div>

              {/* 3 DOT MENU (Visible in Grid View) */}
              {!(viewMode === "list" || viewMode === "details") && (
                <div className="relative" ref={openMenu === e.id ? menuRef : null}>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenu(openMenu === e.id ? null : e.id);
                    }}
                    id={e.id}
                    className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-teal-600"
                  >
                    <MoreVertical size={viewMode === "compact" ? 16 : 20} />
                  </button>

                  {openMenu === e.id && (
                    <div className="absolute right-0 mt-3 w-52 bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl z-50 overflow-hidden p-2 animate-fade-in ring-1 ring-black/5">
                      <div className="px-3 py-1 mb-1">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Event Actions</p>
                      </div>

                      <button
                        onClick={() => handleView(e.id)}
                        className="w-full text-left px-4 py-2.5 hover:bg-teal-50 text-teal-700 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center transition-colors">
                          <Eye size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm">View Details</span>
                      </button>

                      <div className="h-px bg-gray-100 my-2 mx-2"></div>

                      <button
                        onClick={() => handleStatus(e.id, "APPROVED")}
                        className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-emerald-700 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors">
                          <ShieldCheck size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm">Approve</span>
                      </button>

                      <button
                        onClick={() => handleStatus(e.id, "REJECTED")}
                        className="w-full text-left px-4 py-2.5 hover:bg-rose-50 text-rose-700 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center transition-colors">
                          <ShieldX size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm">Reject</span>
                      </button>

                      <button
                        onClick={() => handleStatus(e.id, "PENDING")}
                        className="w-full text-left px-4 py-2.5 hover:bg-amber-50 text-amber-700 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center transition-colors">
                          <History size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm">Pending</span>
                      </button>

                      <div className="h-px bg-gray-100 my-2 mx-2"></div>

                      <button
                        onClick={() => handleDelete(e.id)}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-semibold rounded-2xl transition-all duration-300 flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center transition-colors">
                          <Trash2 size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-sm">Delete Event</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!(viewMode === "list" || viewMode === "details") && (
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            )}

            {/* DETAILS SECTION */}
            <div
              className={`relative grid gap-4 text-sm flex-1 ${viewMode === "list" || viewMode === "details"
                ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-6 w-full p-0"
                : viewMode === "compact"
                  ? "p-4 grid-cols-1"
                  : "p-6 grid-cols-2"
                }`}
            >
              <div className="group/item flex gap-3 items-center">
                <div className="p-1.5 bg-teal-100 rounded-lg group-hover/item:bg-teal-200 transition text-teal-600">
                  <User size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Created By
                  </p>
                  <p className="font-medium text-gray-900 truncate text-xs">
                    {e.created_by}
                  </p>
                </div>
              </div>

              <div className="group/item flex gap-3 items-center">
                <div className="p-1.5 bg-cyan-100 rounded-lg group-hover/item:bg-cyan-200 transition text-cyan-600">
                  <Rocket size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Status
                  </p>
                  <p
                    className={`font-bold text-[10px] ${getStatusColor(e.status).split(" ")[0]}`}
                  >
                    {e.status}
                  </p>
                </div>
              </div>

              {viewMode !== "compact" && (
                <>
                  <div className="group/item flex gap-3 items-center">
                    <div className="p-1.5 bg-amber-100 rounded-lg group-hover/item:bg-amber-200 transition text-amber-600">
                      <Calendar size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Starts On
                      </p>
                      <p className="font-medium text-gray-900 text-xs">
                        {formatDate(e.start_date)}
                      </p>
                    </div>
                  </div>

                  <div className="group/item flex gap-3 items-center">
                    <div className="p-1.5 bg-amber-100 rounded-lg group-hover/item:bg-amber-200 transition text-amber-600">
                      <Calendar size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Ends On
                      </p>
                      <p className="font-medium text-gray-900 text-xs">
                        {formatDate(e.end_date)}
                      </p>
                    </div>
                  </div>

                  <div className="group/item flex gap-3 items-center">
                    <div className="p-1.5 bg-purple-100 rounded-lg group-hover/item:bg-purple-200 transition text-purple-600">
                      <Clock size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Ends At
                      </p>
                      <p className="font-medium text-gray-900 text-xs">
                        {formatTime(e.end_time)}
                      </p>
                    </div>
                  </div>


                  <div className="group/item flex gap-3 items-center">
                    <div className="p-1.5 bg-rose-100 rounded-lg group-hover/item:bg-rose-200 transition text-rose-600">
                      <Ticket size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Fee
                      </p>
                      <p className="font-bold text-gray-900 text-xs">
                        {e.pass_fee || "Free"}
                      </p>
                    </div>
                  </div>

                  <div className="group/item flex gap-3 items-center">
                    <div className="p-1.5 bg-indigo-100 rounded-lg group-hover/item:bg-indigo-200 transition text-indigo-600">
                      <Users size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Capacity
                      </p>
                      <p className="font-bold text-gray-900 text-xs">
                        {e.capacity}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* LOCATION (Visible in non-compact views) */}
            {!(viewMode === "small" || viewMode === "compact") && (
              <div
                className={`relative flex gap-3 text-sm border-t border-gray-100 ${viewMode === "list" || viewMode === "details"
                  ? "w-full md:w-64 p-0 border-t-0 border-l border-gray-100 pl-4 ml-4"
                  : "px-6 pb-6 pt-4"
                  }`}
              >
                <MapPin size={18} className="text-teal-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Location
                  </p>
                  <p className="font-medium text-gray-900 truncate text-xs">
                    {e.venue}, {e.address}
                  </p>
                </div>
              </div>
            )}

            {/* Actions for List View */}
            {(viewMode === "list" || viewMode === "details") && (
              <div className="flex items-center gap-3 ml-auto pr-6 border-l border-gray-100 pl-6 h-full">
                <button
                  onClick={() => handleView(e.id)}
                  className="w-10 h-10 flex items-center justify-center bg-teal-50 text-teal-600 rounded-2xl hover:bg-teal-100 transition-all duration-300 shadow-sm"
                  title="View Details"
                >
                  <Eye size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleStatus(e.id, "APPROVED")}
                  className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all duration-300 shadow-sm"
                  title="Approve"
                >
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleStatus(e.id, "REJECTED")}
                  className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all duration-300 shadow-sm"
                  title="Reject"
                >
                  <ShieldX size={20} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => handleDelete(e.id)}
                  className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all duration-300 shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-12">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:text-teal-600 transition-all shadow-md"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all shadow-md ${currentPage === i + 1
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-teal-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-teal-50 hover:text-teal-600"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-50 hover:text-teal-600 transition-all shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}


      {/* 🔥 FULL VIEW MODAL WITH STEPPER */}
      {selectedEvent && fullData?.eventDetails && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in">
          <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="relative px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 via-teal-50 to-blue-50">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {fullData?.eventDetails?.event_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    Step{" "}
                    <span className="text-teal-600 font-bold">
                      {GET_STEPS(fullData).findIndex(s => s.id === currentStep) + 1}
                    </span>{" "}
                    of{" "}
                    <span className="text-teal-600 font-bold">
                      {GET_STEPS(fullData).length}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-200 rounded-full transition text-gray-600 hover:text-red-600 ml-4"
                  >
                    <X size={24} />
                  </button>
                </div>

              </div>
            </div>

            {/* STEPPER */}
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between gap-2">
                {GET_STEPS(fullData).map((step, idx, arr) => (
                  <div
                    key={step.id}
                    className="flex-1 flex flex-col items-center relative"
                  >
                    <button
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:scale-110 ${currentStep === step.id
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
                        : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {step.icon}
                    </button>
                    <p
                      className={`text-xs mt-2 text-center font-semibold transition ${currentStep === step.id
                        ? "text-teal-600"
                        : "text-gray-500"
                        }`}
                    >
                      {step.name}
                    </p>
                    {idx < arr.length - 1 && (
                      <div
                        className={`h-1 flex-1 mt-3 absolute top-6 left-1/2 ml-6 transition-all duration-300 ${currentStep === step.id // Simple line logic
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                          : "bg-gray-300"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              <div className="max-w-3xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="text-3xl">{GET_STEPS(fullData).find(s => s.id === currentStep)?.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {GET_STEPS(fullData).find(s => s.id === currentStep)?.name}
                  </h3>
                </div>
                <StepContent step={currentStep} fullData={fullData} />
              </div>
            </div>

            {/* FOOTER - NAVIGATION */}
            <div className="flex justify-between items-center p-8 border-t border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
              <button
                onClick={() => {
                  const steps = GET_STEPS(fullData);
                  const curIdx = steps.findIndex(s => s.id === currentStep);
                  if (curIdx > 0) setCurrentStep(steps[curIdx - 1].id);
                }}
                disabled={currentStep === GET_STEPS(fullData)[0].id}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${currentStep === GET_STEPS(fullData)[0].id
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md hover:scale-105"
                  }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="flex gap-2">
                {GET_STEPS(fullData).map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${currentStep === step.id
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  const steps = GET_STEPS(fullData);
                  const curIdx = steps.findIndex(s => s.id === currentStep);
                  if (curIdx < steps.length - 1) setCurrentStep(steps[curIdx + 1].id);
                }}
                disabled={currentStep === GET_STEPS(fullData)[GET_STEPS(fullData).length - 1].id}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform ${currentStep === GET_STEPS(fullData)[GET_STEPS(fullData).length - 1].id
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:scale-105"
                  }`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-scroll {
          animation: scroll 8s linear infinite;
        }
      `}</style>
      {popup.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center animate-fade-in border border-gray-100">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${popup.type === "success"
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
                }`}
            >
              {popup.type === "success" ? "✅" : "❌"}
            </div>

            <h2
              className={`text-2xl font-bold mb-2 ${popup.type === "success" ? "text-emerald-700" : "text-rose-700"
                }`}
            >
              {popup.type === "success" ? "Success!" : "Error!"}
            </h2>

            <p className="mb-8 text-gray-600 font-medium leading-relaxed">
              {popup.message}
            </p>

            <button
              onClick={() => setPopup({ show: false, message: "", type: "" })}
              className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${popup.type === "success"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-emerald-200"
                : "bg-gradient-to-r from-rose-500 to-red-600 hover:shadow-rose-200"
                }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-red-100 overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>

            <div className="relative">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-lg shadow-red-100">
                🗑️
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3 text-center">Delete Event?</h2>
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                Are you sure you want to delete this event? This action cannot be undone and all associated data will be lost.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95"
                >
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Global helper for document preview from StepContent
window.setDocPreview = null;

const SuperUserEventsWrapper = () => {
  const [docPreview, setDocPreview] = useState(null);
  useEffect(() => {
    window.setDocPreview = setDocPreview;
  }, []);

  return (
    <>
      <SuperUserEvents />
      {docPreview && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[1000] flex flex-col p-4 animate-fade-in"
          onClick={() => setDocPreview(null)}
        >
          <div className="flex justify-end p-4">
            <button className="text-white bg-white/10 p-4 rounded-full hover:bg-white/20 transition shadow-2xl">
              <X size={32} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={docPreview}
              alt="Document"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SuperUserEventsWrapper;


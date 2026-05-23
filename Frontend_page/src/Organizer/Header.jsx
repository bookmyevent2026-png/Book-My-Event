import { useSelector, useDispatch } from "react-redux";
import { Search, Globe, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../Redux/userSlice";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

export const Header = () => {
  const { t, i18n } = useTranslation();
  // User Profile
  const { name: username, profile_image, role } = useSelector((state) => state.user);

  const [searchFocus, setSearchFocus] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const filtered = GLOBAL_SEARCH.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered);
  };

  const handleLogout = () => {
    // Clear Session Storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("profile_image");

    // Clear Redux State
    dispatch(clearUser());

    // Navigate to Login
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguageOpen(false);
  };
  const GLOBAL_SEARCH = [
    // Dashboard
    { name: "Live Dashboard", path: "/OrganizerHome/livedashboard" },
    { name: "Live Food Dashboard", path: "/OrganizerHome/livedashfoodboard" },
    { name: "Organizer Dashboard", path: "/OrganizerHome/Organizerdashboard" },

    // My Events
    { name: "Add-On Check-In / Check-Out", path: "/OrganizerHome/AddonCheckIn" },
    { name: "Add-On Spot Booking", path: "/OrganizerHome/SportBooking" },
    { name: "Coupon", path: "/OrganizerHome/Coupon" },
    { name: "Create Event", path: "/OrganizerHome/CrenteEvent" },
    { name: "Event Check-In / Check-Out", path: "/OrganizerHome/EventCheckIn" },
    { name: "Food Check-In / Check-Out", path: "/OrganizerHome/FoodCheckIn" },
    { name: "Messages & Greeting", path: "/OrganizerHome/messages" },
    { name: "Pass", path: "/OrganizerHome/Pass" },
    { name: "Todo Task", path: "/OrganizerHome/Todo_task" },
    { name: "Verify Event", path: "/OrganizerHome/Verify_Event" },

    // Program
    { name: "Abstract Verification", path: "/OrganizerHome/Abstract_Verification" },
    { name: "Bulk Pass Generation", path: "/OrganizerHome/BulkPassPage" },
    { name: "Create Program", path: "/OrganizerHome/CreateProgram" },
    { name: "Program Check-In", path: "/OrganizerHome/ProgramCheckin" },
    { name: "Program Verification", path: "/OrganizerHome/ProgramVerification" },

    // Users
    { name: "Exhibitor Registration", path: "/OrganizerHome/ExhibitorSpotRegistration" },
    { name: "Exhibitor", path: "/OrganizerHome/Exhibitor" },
    { name: "Role Screen", path: "/OrganizerHome/RoleScreen" },
    { name: "Sponsors", path: "/OrganizerHome/Sponsors" },
    { name: "User Screen", path: "/OrganizerHome/UserScreen" },
    { name: "User", path: "/OrganizerHome/User" },

    // Master
    { name: "Policy", path: "/OrganizerHome/PolicyPage" },
    { name: "Venue", path: "/OrganizerHome/Venu" },
    { name: "Vendor", path: "/OrganizerHome/Vendor" },
  ];

  return (
    <header className="bg-white border-b border-gray-200/60 shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SECTION (Logo + Search) */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  Book My Event
                </h1>
                <p className="text-xs text-gray-500 font-medium -mt-1">
                  CREATE • COLLABORATE • CONNECT
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-80">
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                placeholder="Search anything..."
                className="w-full px-4 py-2 pl-10 rounded-full border bg-gray-100 focus:bg-white"
              />

              {/* 🔥 DROPDOWN */}
              {results.length > 0 && (
                <div className="absolute top-12 w-full bg-white shadow-xl rounded-lg border z-50 max-h-64 overflow-y-auto">
                  {results.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        navigate(item.path);
                        setSearchText("");
                        setResults([]);
                      }}
                      className="px-4 py-3 text-blue-600 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

      {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white shadow-sm">
              <Globe size={15} className="text-indigo-500" />

              <select
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
                defaultValue="EN-UK"
              >
                <option value="EN-UK">EN-UK</option>
                <option value="EN-US">EN-US</option>
              </select>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-semibold text-sm shadow-md overflow-hidden">
                  {profile_image ? (
                    <img src={profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    username?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-tight">
                    Hi,{" "}
                    {username
                      ? username.charAt(0).toUpperCase() + username.slice(1)
                      : "User"}
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                    {role || "organizer"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="ml-2 flex items-center gap-2 px-3 py-2 
             text-red-600 bg-red-50 
             hover:bg-red-100 hover:text-red-700
             rounded-xl transition-all duration-300 group 
             border border-red-100"
              >
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />

                <span className="text-xs font-semibold hidden md:block">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-0.5 bg-gradient-to-r from-blue-500 via-green-500 to-orange-500 opacity-30"></div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <LogOut className="w-8 h-8 text-red-600 ml-1" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Logout</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 font-semibold rounded-xl shadow-md transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};

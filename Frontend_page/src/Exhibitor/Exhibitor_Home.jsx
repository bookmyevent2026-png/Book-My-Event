import React, { useEffect, useState } from "react";
import ExhibitorNavbar from "./Navbar";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ExhibitorHome = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  // ✅ Store user in session (fallback)
  useEffect(() => {
    if (user?.id && user?.name) {
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("userName", user.name);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.fromLogin) {
      setShowToast(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // ✅ Get user (Redux or Session)
  const storedUser = {
    id: sessionStorage.getItem("userId"),
    name: sessionStorage.getItem("userName"),
  };

  const displayUser = user?.id ? user : storedUser;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      
      {/* 🔹 Navbar */}
      <ExhibitorNavbar />

      {/* 🔹 Welcome Section */}
      <div className="flex flex-col items-center justify-center h-[85vh] text-center px-4">
        
        <h1 className="text-4xl font-bold mb-4">
          Welcome Exhibitor 👋
        </h1>

        <p className="text-lg text-slate-300 mb-2">
          Hello, <span className="font-semibold">{displayUser.name || "User"}</span>
        </p>

        {/* Optional Info */}
        <div className="mt-6 text-slate-400 text-sm">
          <p>Manage your event bookings and explore upcoming events.</p>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[250] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 duration-500 flex items-center gap-4 border bg-emerald-600 text-white border-emerald-500 shadow-emerald-200">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
            ✓
          </div>
          <p className="font-bold text-sm tracking-wide">Logged in successfully!</p>
        </div>
      )}
    </div>
  );
};

export default ExhibitorHome;
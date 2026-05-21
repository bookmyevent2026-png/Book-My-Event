import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../Redux/userSlice";
import { CalendarDays, Store, LogOut } from "lucide-react";


const ExhibitorNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

   const handleLogout = () => {
    // Clear Session Storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");

    // Clear Redux State
    dispatch(clearUser());

    // Navigate to Login
    navigate("/");
  };

  const navItem = (path) =>
    `px-4 py-2 rounded-lg cursor-pointer ${
      location.pathname === path
        ? "bg-purple-600 text-white"
        : "text-gray-300 hover:bg-slate-800"
    }`;

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800 px-6 py-3 flex justify-between items-center">

      <h1 className="text-xl font-bold">Exhibitor Panel</h1>

      <div className="flex gap-4">
        <div
          className={navItem("/exhibitor/my-bookings")}
          onClick={() => navigate("/exhibitor/my-bookings")}
        >
          <Store size={16} className="inline mr-1" />
          My Bookings
        </div>
        <div
          className={navItem("/exhibitor/upcoming-events")}
          onClick={() => navigate("/exhibitor/upcoming-events")}
        >
          <Store size={16} className="inline mr-1" />
          UpComing Event
        </div>

        <button
   onClick={handleLogout}
  className="ml-2 flex items-center gap-2 px-3 py-2 
             text-red-600 bg-red-50 
             hover:bg-red-100 hover:text-red-700
             rounded-lg transition-all duration-300 group 
             border border-red-100"
>
  <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
  
  <span className="text-xs font-semibold hidden md:block">
    Logout
  </span>
</button>
      </div>
    </div>
  );
};

export default ExhibitorNavbar;
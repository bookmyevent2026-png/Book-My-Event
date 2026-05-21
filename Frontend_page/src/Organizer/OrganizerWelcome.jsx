import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  Settings, 
  ArrowRight,
  Ticket,
  Layout,
  TrendingUp,
  Users
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getEventshow } from "../Services/api";

export const OrganizerWelcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const Redexorganizer = useSelector((state) => state.user);
  const storedUser = {
    id: sessionStorage.getItem("userId"),
    name: sessionStorage.getItem("userName"),
  };
  const organizer = Redexorganizer?.id ? Redexorganizer : storedUser;

  useEffect(() => {
    if (organizer?.id) {
      fetchEvents();
    }
    
    // Check if redirected from login
    if (location.state?.fromLogin) {
      setShowToast(true);
      // Clear the state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [organizer?.id, location.state]);

  const fetchEvents = async () => {
    if (!organizer?.id) return;
    try {
      const data = await getEventshow(organizer.id);
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalEvents = events.length;
  const approvedEvents = events.filter(e => e.status === "APPROVED").length;
  const pendingEvents = events.filter(e => e.status === "PENDING" || e.status === "Pending").length;

  const stats = [
    { title: "Total Events", value: totalEvents, icon: <Calendar className="text-purple-600" />, color: "bg-purple-50" },
    { title: "Approved Events", value: approvedEvents, icon: <CheckCircle className="text-green-600" />, color: "bg-green-50" },
    { title: "Pending Events", value: pendingEvents, icon: <Clock className="text-orange-600" />, color: "bg-orange-50" },
    
  ];

  const quickActions = [
    { name: "Create New Event", icon: <PlusCircle size={20} />, path: "/OrganizerHome/CrenteEvent" },
    { name: "Manage Venues", icon: <Settings size={20} />, path: "/OrganizerHome/Venu" },
    { name: "Ticketing & Passes", icon: <Ticket size={20} />, path: "/OrganizerHome/BulkPassPage" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* HERO SECTION */}
      <div 
        className="relative overflow-hidden rounded-3xl p-12 mb-10 shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
        }}
      >
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
            Welcome Back, <span className="text-yellow-300">Organizer!</span>
          </h1>
          <p className="text-white/90 text-xl max-w-2xl leading-relaxed mb-8">
            Your command center for world-class events. Manage, track, and scale your productions with ease.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/OrganizerHome/CrenteEvent")}
              className="px-8 py-4 bg-white text-purple-700 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => navigate("/OrganizerHome/livedashboard")}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-2xl hover:bg-white/20 transition-all"
            >
              View Analytics
            </button>
          </div>
        </div>
        
        {/* Decor elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 font-medium text-sm mb-1">{stat.title}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* QUICK ACTIONS */}
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="w-full p-4 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:border-purple-300 hover:bg-purple-50 group transition-all"
              >
                <div className="flex items-center gap-4 text-slate-700 font-semibold group-hover:text-purple-700">
                  <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-purple-100">
                    {action.icon}
                  </div>
                  {action.name}
                </div>
                <ArrowRight size={18} className="text-slate-300 group-hover:text-purple-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* UPCOMING DEADLINES / TASKS placeholder style */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Your Recent Activity</h3>
            <button 
              onClick={() => navigate("/OrganizerHome/CrenteEvent")}
              className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50 shadow-sm">
            {events.slice(0, 3).map((e, i) => (
              <div key={i} className="p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border-2 border-white shadow-sm overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${e.banner_url || e.images?.[0] || 'none'})` }}>
                  {(!e.banner_url && !e.images?.[0]) && (i + 1)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{e.event_name}</h4>
                  <p className="text-slate-500 text-sm">{e.venue}, {e.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${e.status === 'APPROVED' ? 'bg-green-100 text-green-700' : e.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{e.status}</span>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No recent events found. Try creating one!
              </div>
            )}
          </div>
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

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Clock,
  ChevronDown,
  Heart,
  Share2,
  Ticket,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowUp,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MediaRenderer from "../components/MediaRenderer";
import EventDetailModal from "../components/EventDetailModal";
import { getHomeEventshow, getFullEventDetails } from "../Services/api";
import { EventCard, CountdownTimer } from "../components/EventCard";

const CATEGORIES = [
  { name: "All", icon: "🎯", color: "from-slate-600 to-slate-700" },
  { name: "Music", icon: "🎵", color: "from-purple-500 to-pink-500" },
  { name: "Business", icon: "💼", color: "from-blue-500 to-cyan-500" },
  { name: "Technology", icon: "💻", color: "from-teal-500 to-emerald-500" },
  { name: "Education", icon: "📚", color: "from-orange-500 to-yellow-500" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },

];


const Hero = ({
  events,
  likedEvents,
  toggleLike,
  onShowDetail,
}) => {
  const navigate = useNavigate();

  // Find the closest upcoming open event (not closed)
  const openEvents = (events || [])
    .filter((e) => {
      const isClosed = new Date(e.endDate || e.date).setHours(23, 59, 59, 999) < new Date();
      return !isClosed;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const featuredEvent = openEvents[0] || events?.[0];

  return (
    <div className="relative min-h-[70vh] bg-slate-950">
      {/* Sophisticated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950" />

        {/* Animated orbs - more subtle */}
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-32 right-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Radial accent */}
        <div className="absolute bottom-0 left-1/2 w-full h-1/2 bg-gradient-to-t from-orange-600/5 via-transparent to-transparent -translate-x-1/2" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3 group">
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
              </div>
              <span className="text-2xl font-bold text-white">BookMyEvent</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >

              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >

              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
              >

              </a>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-white text-slate-950 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 text-sm"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 w-fit">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-400 text-sm font-semibold">
                  Discover Amazing Events
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-6xl md:text-5xl font-bold text-white leading-tight">
                  Turning Your Vision Into
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400">
                    Unforgettable Moments
                  </span>
                </h1>

                <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                  From electrifying concerts to inspiring conferences. Discover,
                  book, and experience events that transform your world. Your
                  next unforgettable moment is just one click away.
                </p>


              </div>
            </div>

            {/* Right Column - Featured Event */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden h-96">
                  {featuredEvent ? (
                    <EventCard
                      event={featuredEvent}
                      isFeatured={true}
                      isLiked={likedEvents.includes(featuredEvent.id)}
                      onToggleLike={toggleLike}
                      onShowDetail={onShowDetail}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      Loading event...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = () => {
  const navigate = useNavigate();

  const popularCategories = [
    {
      name: "CONFERENCE",
      filterName: "Business",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600",
    },
    {
      name: "ENTERTAINMENT",
      filterName: "Music",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
    },
    {
      name: "CORPORATE",
      filterName: "Business",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600",
    },
    {
      name: "EXPO",
      filterName: "Technology",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    },
    {
      name: "EDUCATION",
      filterName: "Education",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600",
    },
    {
      name: "SPORTS",
      filterName: "Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600",
    },
  ];

  // Duplicate the array of categories to create a seamless infinite scrolling track
  const doubledCategories = [...popularCategories, ...popularCategories, ...popularCategories];

  return (
    <section className="py-12 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="text-sm font-bold tracking-widest text-orange-500 uppercase mb-2">
            Explore Categories
          </h2>
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            POPULAR CATEGORIES
          </h3>
        </div>
      </div>

      {/* Infinite Marquee Track Container */}
      <div className="w-full overflow-hidden relative py-4">
        {/* Soft fading edges for premium look */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 cursor-pointer">
          {doubledCategories.map((cat, idx) => (
            <div
              key={`${cat.name}-${idx}`}
              onClick={() => navigate("/all-events", { state: { category: cat.filterName } })}
              className="group relative w-72 h-44 rounded-2xl overflow-hidden shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-orange-500/20 flex-shrink-0"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

              {/* Top-left category tag like the screenshot */}
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-extrabold tracking-widest text-white/95 uppercase bg-black/40 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                  {cat.name}
                </span>
              </div>

              {/* Bottom detail row */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-base font-extrabold tracking-wide text-white group-hover:text-orange-400 transition-colors">
                  {cat.filterName} Events
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-orange-500 flex items-center justify-center text-white transition-all duration-300 transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeSearchWidget = ({ events }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const uniqueLocations = Array.from(
    new Set(
      events
        .map((e) => {
          if (!e.location) return "";
          const parts = e.location.split(",");
          return parts[parts.length - 1]?.trim() || e.location;
        })
        .filter(Boolean)
    )
  );

  const handleSearch = () => {
    navigate("/all-events", {
      state: {
        title: query,
        category: category || "All",
        location: location,
      },
    });
  };

  return (
    <div className="relative z-20 mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl md:rounded-full p-2 md:p-1.5 shadow-xl border border-gray-200 flex flex-col md:flex-row items-center gap-1">
        {/* What are you looking for */}
        <div className="flex-1 w-full flex items-center gap-2.5 px-5 py-2 border-b md:border-b-0 md:border-r border-gray-200">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none text-sm font-medium"
          />
        </div>

        {/* Category Selector */}
        <div className="w-full md:w-52 flex items-center gap-2 px-5 py-2 border-b md:border-b-0 md:border-r border-gray-200 relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none text-sm font-medium appearance-none cursor-pointer pr-8"
          >
            <option value="" className="text-slate-400">Category</option>
            <option value="Music" className="text-slate-800">Music</option>
            <option value="Business" className="text-slate-800">Business</option>
            <option value="Technology" className="text-slate-800">Technology</option>
            <option value="Education" className="text-slate-800">Education</option>
            <option value="Sports" className="text-slate-800">Sports</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-5 pointer-events-none" />
        </div>

        {/* Location Selector */}
        <div className="w-full md:w-52 flex items-center gap-2 px-5 py-2 relative">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none text-sm font-medium appearance-none cursor-pointer pr-8"
          >
            <option value="" className="text-slate-400">Location</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc} className="text-slate-800">
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-5 pointer-events-none" />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full font-bold transition-all shadow-md shadow-blue-500/10 text-xs uppercase tracking-wider cursor-pointer flex-shrink-0"
        >
          SEARCH
        </button>
      </div>
    </div>
  );
};

const EventsSection = ({
  events,
  likedEvents,
  onToggleLike,
  onShowDetail,
  onViewAllClick
}) => {
  const [selectedCity, setSelectedCity] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState("");

  // Helper to extract clean city name
  const getCityFromLocation = (loc) => {
    if (!loc) return "";
    const cleanLoc = loc.toLowerCase();
    if (cleanLoc.includes("chennai")) return "CHENNAI";
    if (cleanLoc.includes("bengaluru") || cleanLoc.includes("bangalore")) return "BENGALURU";
    if (cleanLoc.includes("mumbai")) return "MUMBAI";
    if (cleanLoc.includes("delhi")) return "DELHI";
    if (cleanLoc.includes("hyderabad")) return "HYDERABAD";
    if (cleanLoc.includes("coimbatore")) return "COIMBATORE";
    if (cleanLoc.includes("madurai")) return "MADURAI";
    if (cleanLoc.includes("trichy")) return "TRICHY";
    
    const parts = loc.split(",");
    const lastPart = parts[parts.length - 1]?.trim().toUpperCase() || "";
    if (lastPart === "INDIA" || lastPart === "TAMIL NADU" || lastPart === "KARNATAKA") {
      return parts[parts.length - 2]?.trim().toUpperCase() || lastPart;
    }
    return lastPart;
  };

  // 🔥 SORTING: Open events first (by date), Closed events last
  const finalEvents = [...events].sort((a, b) => {
    const aClosed = new Date(a.endDate || a.date).setHours(23, 59, 59, 999) < new Date();
    const bClosed = new Date(b.endDate || b.date).setHours(23, 59, 59, 999) < new Date();

    if (aClosed !== bClosed) {
      return aClosed ? 1 : -1; // Open first, closed last
    }

    // Both are same status, sort by date ascending
    return new Date(a.date) - new Date(b.date);
  });

  // Extract cities dynamically from current events list
  const citiesList = Array.from(
    new Set(
      events
        .map((e) => getCityFromLocation(e.location))
        .filter(Boolean)
    )
  ).sort();

  // Apply City Filter
  const cityFilteredEvents = finalEvents.filter((event) => {
    if (!selectedCity) return true;
    return getCityFromLocation(event.location) === selectedCity;
  });

  const otherEvents = cityFilteredEvents.slice(0, 4);

  return (
    <section 
      id="events-list" 
      className="py-12 bg-slate-950 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/event_bg.png')" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* All Events */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-extrabold text-white tracking-wide">
                EVENTS
              </h2>
              
              {/* City Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full text-xs transition-all cursor-pointer shadow-md select-none border border-yellow-500/20"
                >
                  <span className="tracking-wider uppercase">{selectedCity || "City"}</span>
                  {selectedCity && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCity("");
                      }}
                      className="hover:text-red-200 transition-colors ml-0.5 p-0.5"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Dropdown Box */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 z-50 p-2.5 animate-fadeIn">
                      {/* Search box inside dropdown */}
                      <div className="relative flex items-center mb-2 border border-gray-300 rounded-md px-2.5 py-1 bg-white">
                        <input
                          type="text"
                          placeholder="Search City..."
                          value={citySearchQuery}
                          onChange={(e) => setCitySearchQuery(e.target.value)}
                          className="w-full bg-transparent text-slate-800 placeholder-slate-400 outline-none text-xs font-semibold pr-6"
                          autoFocus
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
                      </div>

                      {/* Cities list */}
                      <div className="max-h-40 overflow-y-auto no-scrollbar">
                        {citiesList
                          .filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase()))
                          .map(city => (
                            <div
                              key={city}
                              onClick={() => {
                                setSelectedCity(city);
                                setIsDropdownOpen(false);
                                setCitySearchQuery("");
                              }}
                              className={`px-3 py-2 text-xs font-bold rounded-md cursor-pointer transition-all ${
                                selectedCity === city
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {city}
                            </div>
                          ))}
                        {citiesList.filter(city => city.toLowerCase().includes(citySearchQuery.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-xs text-slate-400 font-semibold text-center">
                            No cities found
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onViewAllClick}
              className="px-6 py-2 bg-white hover:bg-gray-100 text-slate-950 rounded-full font-bold transition-all text-xs uppercase cursor-pointer shadow-md transform hover:scale-105 active:scale-95"
            >
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {otherEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFeatured={false}
                isLiked={likedEvents.includes(event.id)}
                onToggleLike={onToggleLike}
                onShowDetail={onShowDetail}
              />
            ))}
          </div>
          {otherEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800/50 mt-8">
              <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Results Found</h3>
              <p className="text-slate-500 text-sm max-w-sm text-center">
                There are no events available right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
              </div>
              <span className="text-2xl font-bold text-white">BookMyEvent</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover, book, and experience unforgettable moments. From
              concerts to conferences, we connect you with events that matter.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm"></h4>
            <ul className="space-y-3">
              {[

              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Support</h4>
            <ul className="space-y-3">

              <li>
                <button
                  onClick={() => navigate("/Help_Center")}
                  className="text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  Help Center
                </button>
              </li>

              <li>
                <button
                  onClick={() => navigate("/Terms")}
                  className="text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/Cancellation")}
                  className="text-slate-400 hover:text-white transition-colors text-sm cursor-pointer"
                >
                  Cancellation and Refund Policy
                </button>
              </li>

            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <p className="text-orange-400 font-bold text-lg  cursor-pointer">
                +(91) 9444221003
              </p>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=bookmyevent2026@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                bookmyevent2026@gmail.com
              </a>
              <div className="flex gap-3 pt-4">
                {[
                  { name: "Facebook", short: "f", url: "https://www.facebook.com/login" },
                  { name: "Instagram", short: "in", url: "https://www.instagram.com/accounts/login/" },
                  { name: "Twitter", short: "tw", url: "https://twitter.com/login" },
                  { name: "YouTube", short: "yt", url: "https://accounts.google.com/signin/v2/identifier?service=youtube" }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-slate-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-white text-xs font-bold">
                      {social.short}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} BookMyEvent. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

const PricingSection = () => {
  return (
    <section className="bg-slate-950 text-white py-16 text-center border-t border-slate-800/50">
      <h2 className="text-2xl font-black mb-4 tracking-wider uppercase text-white">PRICING PLANS</h2>
      <p className="mb-2 text-[15px] font-medium text-slate-400">Explore Our Budget-Friendly Rates</p>
      <p className="text-orange-400 font-bold text-lg  cursor-pointer">
               Kindly Contact us at (+91) 9444221003
              </p>
    </section>
  );
};

const App = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [likedEvents, setLikedEvents] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 🔥 DETAIL VIEW STATES
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const onShowDetail = async (id) => {
    setIsLoadingDetails(true);
    try {
      const res = await getFullEventDetails(id);
      setFullData(res);
      setSelectedEventId(id);
      setCurrentStep('about'); // Default to about tab
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedEventId(null);
    setFullData(null);
    setCurrentStep('about');
  };

  const toggleLike = (id) => {
    setLikedEvents(prev => {
      const updated = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const data = await getHomeEventshow();
    console.log("Fetched events:", data);

    if (!data || data.length === 0) {
      setEvents([]);
      return;
    }
    console.log("Raw event data:", data);

    const formatted = data.map((e) => ({
      id: e.id,
      title: e.event_name,
      category: e.category || "General",
      price: e.entry_type === "Free" ? 0 : (e.pass_fee || 0),
      currency: e.currency || "₹",
      location: `${e.venue}, ${e.address}`,
      date: e.start_date,
      endDate: e.end_date,
      time: e.start_time,
      image: e.banner_url || "https://via.placeholder.com/400",
      banner_type: e.banner_type,
      rating: 4.5,
      reviews: 0,
      attendees: e.capacity || 0,
      organizer: "Admin",
      tags: [],
      bookingEnds: e.end_date || e.start_date + "T23:59:59",

      // 🔥 IMPORTANT (so featured works)
      trending: (e.capacity || 0) > 100,
    }));

    setEvents(formatted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ✅ FIX: pass events */}
      <Hero
        events={events}
        likedEvents={likedEvents}
        toggleLike={toggleLike}
        onShowDetail={onShowDetail}
      />
      <HomeSearchWidget events={events} />

      <CategorySection />

      <EventsSection
        events={events}
        likedEvents={likedEvents}
        onToggleLike={toggleLike}
        onShowDetail={onShowDetail}
        onViewAllClick={() => navigate("/all-events")}
      />

      <PricingSection />

      <Footer />

      <EventDetailModal
        selectedEventId={selectedEventId}
        fullData={fullData}
        closeModal={closeModal}
      />



      {/* Loading Overlay */}
      {isLoadingDetails && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
            <p className="text-slate-900 font-bold">Loading Details...</p>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        .animate-scroll { animation: scroll 8s linear infinite; }
      `}</style>

      {/* Return to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-28 right-7 z-[100] p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 group ${showScrollTop
          ? "translate-y-0 opacity-100 visible"
          : "translate-y-20 opacity-0 invisible"
          }`}
        aria-label="Return to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
      </button>
    </div>
  );
};

export default App;

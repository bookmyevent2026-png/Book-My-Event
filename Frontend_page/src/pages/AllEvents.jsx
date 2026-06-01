import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  ChevronDown,
  ArrowRight,
  ArrowUp,
  Filter,
  RefreshCw,
  Home as HomeIcon
} from "lucide-react";
import {
  getHomeEventshow,
  getFullEventDetails,
  getCountries,
  getStates,
  getCities
} from "../Services/api";
import { EventCard } from "../components/EventCard";
import EventDetailModal from "../components/EventDetailModal";

const CATEGORIES = [
  { name: "All", icon: "🎯" },
  { name: "Music", icon: "🎵" },
  { name: "Business", icon: "💼" },
  { name: "Technology", icon: "💻" },
  { name: "Education", icon: "📚" },
  { name: "Sports", icon: "⚽" },
];

export default function AllEvents() {
  const navigate = useNavigate();
  const location = useLocation();

  // Events list states
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wishlist and Detail states
  const [likedEvents, setLikedEvents] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Dynamic dropdown options
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Filter form states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCountry, setSearchCountry] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [searchCategory, setSearchCategory] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Read search criteria from navigation state on mount
  useEffect(() => {
    if (location.state) {
      if (location.state.title !== undefined) {
        setSearchTitle(location.state.title);
      }
      if (location.state.category) {
        setSearchCategory(location.state.category);
      }
      if (location.state.location !== undefined) {
        setSearchLocation(location.state.location);
      }
    }
  }, [location.state]);

  // Fetch initial events and countries
  useEffect(() => {
    document.title = "Event Search | Discover Events & Tickets - BookMyEvent";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Search and discover amazing events around the world. Filter by country, state, city, category, date, and venue on BookMyEvent.");
    }
    fetchEvents();
    getCountries().then(setCountries).catch(console.error);
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (searchCountry) {
      getStates(searchCountry).then(setStates).catch(console.error);
      setSearchState("");
      setCities([]);
      setSearchCity("");
    } else {
      setStates([]);
      setCities([]);
      setSearchState("");
      setSearchCity("");
    }
  }, [searchCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (searchCountry && searchState) {
      getCities(searchCountry, searchState).then(setCities).catch(console.error);
      setSearchCity("");
    } else {
      setCities([]);
      setSearchCity("");
    }
  }, [searchCountry, searchState]);

  // Scroll to top display logic
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await getHomeEventshow();
      if (!data || data.length === 0) {
        setEvents([]);
        setFilteredEvents([]);
        return;
      }

      const formatted = data.map((e) => {
        const entryType = e.entry_type || "";
        const passFee = e.pass_fee;
        // Determine display type: Donation if entry_type is Donation OR pass_fee is string 'Donation'
        const isDonation = entryType === "Donation" || String(passFee).toLowerCase() === "donation";
        const isFree = entryType === "Free" || (!isDonation && (!passFee || Number(passFee) === 0));
        return {
          id: e.id,
          title: e.event_name,
          category: e.category || "General",
          entry_type: isDonation ? "Donation" : isFree ? "Free" : "Paid",
          price: isDonation || isFree ? 0 : (Number(passFee) || 0),
          currency: e.currency || "₹",
          location: e.venue,
          fullLocation: `${e.venue}, ${e.address}`,
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
          trending: (e.capacity || 0) > 100,
        };
      });

      // Sort: open first, then chronological
      const sorted = [...formatted].sort((a, b) => {
        const aClosed = new Date(a.endDate || a.date).setHours(23, 59, 59, 999) < new Date();
        const bClosed = new Date(b.endDate || b.date).setHours(23, 59, 59, 999) < new Date();

        if (aClosed !== bClosed) {
          return aClosed ? 1 : -1;
        }
        return new Date(a.date) - new Date(b.date);
      });

      setEvents(sorted);
      setFilteredEvents(sorted);
    } catch (err) {
      console.error("Error loading events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindEvents = useCallback(() => {
    let result = [...events];

    // Filter by title
    if (searchTitle.trim()) {
      result = result.filter((e) =>
        e.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
        (e.fullLocation || e.location).toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by country
    if (searchCountry) {
      const countryObj = countries.find((c) => String(c.id).toLowerCase() === String(searchCountry).toLowerCase());
      if (countryObj) {
        result = result.filter((e) =>
          (e.fullLocation || e.location).toLowerCase().includes(countryObj.country_name.toLowerCase())
        );
      }
    }

    // Filter by state
    if (searchState) {
      const stateObj = states.find((s) => String(s.id).toLowerCase() === String(searchState).toLowerCase());
      if (stateObj) {
        result = result.filter((e) =>
          (e.fullLocation || e.location).toLowerCase().includes(stateObj.state_name.toLowerCase())
        );
      }
    }

    // Filter by city
    if (searchCity) {
      const cityObj = cities.find((c) => String(c.id) === String(searchCity));
      const targetCity = cityObj ? cityObj.city_name : searchCity;
      result = result.filter((e) =>
        (e.fullLocation || e.location).toLowerCase().includes(targetCity.toLowerCase())
      );
    }

    // Filter by category
    if (searchCategory && searchCategory !== "All") {
      result = result.filter(
        (e) => e.category?.trim().toLowerCase() === searchCategory.trim().toLowerCase()
      );
    }

    // Filter by location
    if (searchLocation.trim()) {
      result = result.filter((e) =>
        (e.fullLocation || e.location).toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Filter by date
    if (searchDate) {
      result = result.filter((e) => {
        const eventDateStr = new Date(e.date).toISOString().split("T")[0];
        return eventDateStr === searchDate;
      });
    }

    setFilteredEvents(result);
  }, [
    events,
    searchTitle,
    searchCountry,
    countries,
    searchState,
    states,
    searchCity,
    searchCategory,
    searchLocation,
    searchDate
  ]);

  // Run handleFindEvents reactively on filter criteria changes
  useEffect(() => {
    handleFindEvents();
  }, [handleFindEvents]);

  const handleResetFilters = () => {
    setSearchTitle("");
    setSearchCountry("");
    setSearchState("");
    setSearchCity("");
    setSearchCategory("All");
    setSearchLocation("");
    setSearchDate("");
    setFilteredEvents(events);
  };

  const onShowDetail = async (id) => {
    setIsLoadingDetails(true);
    try {
      const res = await getFullEventDetails(id);
      setFullData(res);
      setSelectedEventId(id);
    } catch (err) {
      console.error("Error fetching event details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedEventId(null);
    setFullData(null);
  };

  const toggleLike = (id) => {
    setLikedEvents((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex gap-1">
                <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
              </div>
              <span className="text-2xl font-bold text-white">BookMyEvent</span>
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

      {/* Header Banner */}
      <div className="relative pt-32 pb-16 bg-slate-900 overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1920"
            alt="Events backdrop"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <span
              onClick={() => navigate("/")}
              className="hover:text-white cursor-pointer flex items-center gap-1.5"
            >
              <HomeIcon size={12} />
              Home
            </span>
            <span className="mx-2 text-slate-600">/</span>
            <span className="text-orange-400">Event Search</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Event Search
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Browse, filter, and discover your next unforgettable experience.
          </p>
        </div>
      </div>

      {/* Filters Form Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Title Search Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Event
              </label>
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by event name"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                />
              </div>
            </div>

            {/* Country Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Country
              </label>
              <div className="relative flex items-center">
                <select
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors appearance-none"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.country_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* State Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                State
              </label>
              <div className="relative flex items-center">
                <select
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                  disabled={!searchCountry}
                  className="w-full pl-4 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.state_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* City Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                City
              </label>
              <div className="relative flex items-center">
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  disabled={!searchState}
                  className="w-full pl-4 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.city_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Event Categories
              </label>
              <div className="relative flex items-center">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors appearance-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Location input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Location
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Grand Square"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                />
              </div>
            </div>

            {/* Date input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Date
              </label>
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-3 mt-4 md:mt-0">
              <button
                onClick={handleFindEvents}
                className="flex-1 py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 text-sm text-center uppercase tracking-wider cursor-pointer"
              >
                FIND EVENT
              </button>
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-3 bg-slate-950/80 border border-slate-800 hover:bg-slate-800 rounded-xl transition-colors active:scale-95 cursor-pointer text-slate-400 hover:text-white"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {/* Results Counter Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-8">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Filter size={18} className="text-orange-400" />
            <span>{filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} Found</span>
          </h2>
          {filteredEvents.length < events.length && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 underline underline-offset-4 cursor-pointer"
            >
              Show all events
            </button>
          )}
        </div>

        {/* Loading indicator */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium">Fetching events...</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFeatured={false}
                isLiked={likedEvents.includes(event.id)}
                onToggleLike={toggleLike}
                onShowDetail={onShowDetail}
              />
            ))}
          </div>
        )}

        {/* No Results Fallback */}
        {!isLoading && filteredEvents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 border border-slate-850 rounded-2xl">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Events Found</h3>
            <p className="text-slate-500 text-sm max-w-sm text-center">
              We couldn't find any events matching your search options. Try adjusting your filters or clearing them.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-5 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-850 pt-16 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div
                className="flex items-center gap-3 group cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="flex gap-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                  <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                  <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
                </div>
                <span className="text-2xl font-bold text-white">BookMyEvent</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Discover, book, and experience unforgettable moments. From concerts to conferences, we connect you with events that matter.
              </p>
            </div>

            <div></div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => navigate("/Help_Center")}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/Terms")}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/Cancellation")}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancellation and Refund Policy
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
                Get in Touch
              </h4>
              <div className="space-y-2 text-xs">
                <p className="text-orange-400 font-bold text-sm">+(91) 9444221003</p>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=bookmyevent2026@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white block"
                >
                  bookmyevent2026@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex items-center justify-between text-slate-500 text-xxs">
            <p>© {new Date().getFullYear()} BookMyEvent. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal and loading details */}
      <EventDetailModal
        selectedEventId={selectedEventId}
        fullData={fullData}
        closeModal={closeModal}
      />

      {isLoadingDetails && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-500 rounded-full animate-spin"></div>
            <p className="text-slate-900 font-bold">Loading Details...</p>
          </div>
        </div>
      )}

      {/* Return to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[100] p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 group ${showScrollTop ? "translate-y-0 opacity-100 visible" : "translate-y-20 opacity-0 invisible"
          }`}
        aria-label="Return to top"
      >
        <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}

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

const CATEGORIES = [
  { name: "All", icon: "🎯", color: "from-slate-600 to-slate-700" },
  { name: "Music", icon: "🎵", color: "from-purple-500 to-pink-500" },
  { name: "Business", icon: "💼", color: "from-blue-500 to-cyan-500" },
  { name: "Technology", icon: "💻", color: "from-teal-500 to-emerald-500" },
  { name: "Education", icon: "📚", color: "from-orange-500 to-yellow-500" },
  { name: "Sports", icon: "⚽", color: "from-green-500 to-emerald-500" },

];

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 text-xs font-mono">
      {timeLeft.days > 0 && (
        <>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
            {timeLeft.days}d
          </span>
          <span className="text-slate-500">•</span>
        </>
      )}
      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
        {String(timeLeft.hours).padStart(2, "0")}h
      </span>
      <span className="text-slate-500">•</span>
      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-lg">
        {String(timeLeft.minutes).padStart(2, "0")}m
      </span>
    </div>
  );
};

const EventCard = ({ event, isFeatured = false, isLiked, onToggleLike, onShowDetail }) => {
  const navigate = useNavigate();

  const handleBookNow = (e) => {
    e.stopPropagation();
    console.log("Clicked Event ID:", event.id); // ✅ debug
    navigate(`/usersbooking/${event.id}`, { state: { event } });
  };

  const priceDisplay =
    event.price === 0 ? "Free" : `${event.currency}${event.price}`;

  if (isFeatured) {
    return (
      <div
        onClick={() => onShowDetail(event.id)}
        className="group relative overflow-hidden rounded-2xl h-full cursor-pointer"
      >
        {/* Featured card with image and overlay */}
        <MediaRenderer
          src={event.image}
          type={event.banner_type}
          alt={event.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Trending Badge */}
        {event.trending && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white text-xs font-bold">
              <TrendingUp size={14} />
              Trending Now
            </div>
          </div>
        )}

        {/* Like Button */}


        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2 hover:text-orange-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <MapPin size={14} />
                  {event.location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-400">
                  {priceDisplay}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-white font-semibold">
                    {event.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  ({event.reviews} reviews)
                </span>
              </div>
              <button
                onClick={handleBookNow}
                disabled={new Date() > new Date(event.endDate || event.date)}
                className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${new Date() > new Date(event.endDate || event.date)
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-white text-slate-900 hover:bg-gray-100"
                  }`}
              >
                {new Date() > new Date(event.endDate || event.date) ? "Booking Closed" : "Book Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onShowDetail(event.id)}
      className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-40 overflow-hidden bg-slate-900">
        <MediaRenderer
          src={event.image}
          type={event.banner_type}
          alt={event.title}
          className="w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-slate-900/60 backdrop-blur-md rounded-lg text-xs font-bold text-slate-200 border border-slate-700/50">
            {event.category}
          </span>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(event.id);
          }}
          className="absolute top-3 right-3 p-2 bg-slate-900/60 backdrop-blur-md rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <Heart
            className={`w-4 h-4 transition-all ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`}
          />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="text-lg font-bold text-orange-400">
            {priceDisplay}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white line-clamp-2 hover:text-orange-400 transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-slate-300">
                {event.rating}
              </span>
            </div>
            <span className="text-xs text-slate-500">({event.reviews})</span>
          </div>
        </div>

        <div className="space-y-1.5 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {event.endDate && event.endDate !== event.date && (
                <> - {new Date(event.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}</>
              )}
            </span>
          </div>
        </div>

        {/* Countdown */}
        <div className="pt-3 border-t border-slate-700/50">
          <CountdownTimer targetDate={event.bookingEnds} />
        </div>

        {/* Action Button */}
        <button
          onClick={handleBookNow}
          disabled={new Date() > new Date(event.endDate || event.date)}
          className={`w-full py-2 rounded-lg text-white text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${new Date() > new Date(event.endDate || event.date)
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/20"
            }`}
        >
          {new Date() > new Date(event.endDate || event.date) ? "Booking Closed" : "Book Ticket"}
        </button>
      </div>
    </div>
  );
};

const Hero = ({ events, searchQuery, setSearchQuery, likedEvents, toggleLike, onShowDetail }) => {

  const navigate = useNavigate();
  const featuredEvent = events?.[0]; // ✅ first event

  return (
    <div className="relative min-h-[70vh] overflow-hidden bg-slate-950">
      {/* Sophisticated Background */}
      <div className="absolute inset-0">
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
      <div className="relative z-10 pt-28 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
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

          {/* Search Section */}
          <div className="mt-12">
            <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <Search className="w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("events-list")?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    />
                    {searchQuery && (
                      <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                        {events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())).length} matches
                      </span>
                    )}
                  </div>

                  {searchQuery && events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <p className="text-xs text-red-400 ml-2 animate-pulse">
                      No events found matching "{searchQuery}"
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    document.getElementById("events-list")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white font-bold transition-all transform hover:scale-105"
                >
                  Search Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategorySection = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <section className="py-8 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-4xl font-bold text-white mb-2">
            Browse by Category
          </h2>
          <p className="text-slate-400">Find events that match your vibe</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`group relative px-6 py-3 rounded-full transition-all duration-300 font-semibold text-sm ${selectedCategory === cat.name
                ? "bg-white text-slate-900 scale-105 shadow-lg shadow-orange-500/30"
                : "bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-2">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </div>
              {selectedCategory === cat.name && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${cat.color} opacity-30 rounded-full blur-xl -z-10`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventsSection = ({
  selectedCategory,
  setSelectedCategory,
  events,
  searchQuery,
  likedEvents,
  onToggleLike,
  onShowDetail
}) => {

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(
        (e) =>
          e.category?.trim().toLowerCase() ===
          selectedCategory.trim().toLowerCase()
      );

  // 🔥 SEARCH FILTER
  const searchedEvents = filteredEvents.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔥 SORTING: Open events first (by date), Closed events last
  const finalEvents = [...searchedEvents].sort((a, b) => {
    const aClosed = new Date(a.endDate || a.date).setHours(23, 59, 59, 999) < new Date();
    const bClosed = new Date(b.endDate || b.date).setHours(23, 59, 59, 999) < new Date();

    if (aClosed !== bClosed) {
      return aClosed ? 1 : -1; // Open first, closed last
    }

    // Both are same status, sort by date ascending
    return new Date(a.date) - new Date(b.date);
  });

  const trendingEvents = finalEvents.filter((e) => e.trending).slice(0, 2);
  const otherEvents = finalEvents;
  return (
    <section id="events-list" className="py-12 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Grid */}
        {trendingEvents.length > 0 && selectedCategory === "All" && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8">
              Featured Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {trendingEvents.map((event) => (
                <div key={event.id} className="h-80 rounded-xl overflow-hidden">
                  <EventCard event={event} isFeatured={true} onShowDetail={onShowDetail} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Events */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              {selectedCategory === "All"
                ? "All Events"
                : `${selectedCategory} Events`}
            </h2>
            <button
              onClick={() => {
                setSelectedCategory("All");
                document.getElementById("events-list")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex items-center gap-2 px-6 py-3 border border-slate-700 hover:border-slate-600 rounded-full text-white hover:bg-slate-800/30 transition-all font-bold"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                {searchQuery
                  ? `We couldn't find any events matching "${searchQuery}". Try adjusting your search keywords.`
                  : `There are no events available ${selectedCategory !== 'All' ? `in the ${selectedCategory} category` : ''} right now. Check back soon!`}
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

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        likedEvents={likedEvents}
        toggleLike={toggleLike}
        onShowDetail={onShowDetail}
      />

      <CategorySection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <EventsSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        events={events}
        searchQuery={searchQuery}
        likedEvents={likedEvents}
        onToggleLike={toggleLike}
        onShowDetail={onShowDetail}
      />

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

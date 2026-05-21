import React, { useState } from "react";
import {
  X,
  MapPin,
  Phone,
  ExternalLink,
  Info,
  Layers,
  Image as ImageIcon,
  FileText,
  Star as StarIcon,
  Tag,
  Mail,
  Globe,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import MediaRenderer from "./MediaRenderer";
import OrganizerDetailCard from "./OrganizerDetailCard";
import { useNavigate } from "react-router-dom";

/* FORMATTING HELPERS */
const formatDateLong = (dateString) => {
  if (!dateString) return "-";
  const parts = dateString.split(" ");
  if (parts.length >= 4) {
    return parts.slice(0, 4).join(" ");
  }
  return dateString;
};

const EventDetailModal = ({ selectedEventId, fullData, closeModal }) => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('about');
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  if (!selectedEventId || !fullData) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[100] p-0 md:p-4 animate-fadeIn">
      <div className="bg-[#f8faff] w-full max-w-7xl h-full md:h-[95vh] overflow-hidden md:rounded-3xl shadow-2xl flex flex-col">

        {/* TOP BAR - VENUE INFO */}
        <div className="bg-white border-b border-slate-100 px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 text-slate-800">
              <MapPin size={18} className="text-blue-500" />
              <h2 className="text-xl font-bold tracking-tight">
                {fullData?.eventDetails?.venue}
              </h2>
            </div>
            <p className="text-xs text-slate-500 ml-6">{fullData?.eventDetails?.address}</p>
            <div className="flex items-center gap-1 ml-6 mt-1">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} size={12} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-400 ml-1">4.8 (120 Reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Phone size={18} className="text-blue-500 mb-1" />
              <span className="text-xs font-bold text-slate-700">9444221003</span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>For Enquiries:</span>
                <a href="https://sportalytics.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                  https://sportalytics.in/ <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white border-b border-slate-100 px-8 flex overflow-x-auto no-scrollbar">
          {[
            { id: 'about', label: 'ABOUT', icon: <Info size={16} /> },
            { id: 'amenities', label: 'AMENITIES', icon: <Layers size={16} /> },
            { id: 'gallery', label: 'GALLERY', icon: <ImageIcon size={16} /> },
            { id: 'tnc', label: 'T & C', icon: <FileText size={16} /> },
            { id: 'reviews', label: 'REVIEWS', icon: <StarIcon size={16} /> },
            { id: 'pricing', label: 'PRICING', icon: <Tag size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${currentTab === tab.id
                  ? "border-blue-600 text-blue-600 bg-blue-50/30"
                  : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto bg-[#f8faff] p-6 flex flex-col lg:flex-row gap-6">

          {/* LEFT SIDE - CONTENT */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 min-h-[400px]">
              {currentTab === 'about' && (
                <div className="animate-fadeIn">
                  <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2">
                    About the Event
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold  tracking-widest mb-1">Event Name</p>
                        <p className="text-xl font-bold text-slate-800">{fullData?.eventDetails?.event_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold  tracking-widest mb-1">Category</p>
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                          {fullData?.eventDetails?.category}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold  tracking-widest mb-2">Description</p>
                      <p className="text-slate-600 leading-relaxed text-sm">
                        {fullData?.eventDetails?.description || "No description available for this event."}
                      </p>
                    </div>
                    {fullData?.guests?.length > 0 && (
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold  tracking-widest mb-4">Special Guests</p>
                        <div className="grid grid-cols-2 gap-4">
                          {fullData.guests.map((guest, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">👤</div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{guest.guest_name}</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase">{guest.designation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'pricing' && (
                <div className="animate-fadeIn">
                  <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2  tracking-wide">
                    Registration Pricing Details
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs font-bold text-slate-700 mb-4">National Pricing</p>
                      <div className="overflow-hidden rounded-xl border border-slate-100">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-slate-50 text-slate-500">
                            <tr>
                              <th className="px-6 py-3 font-bold text-[10px]  tracking-wider">Price Category</th>
                              <th className="px-6 py-3 font-bold text-[10px]  tracking-wider">Till</th>
                              <th className="px-6 py-3 font-bold text-[10px]  tracking-wider">Till On Spot</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="px-6 py-4 font-medium text-slate-700">Visitors</td>
                              <td className="px-6 py-4 text-slate-600 font-bold">₹{fullData?.eventDetails?.pass_fee || "0.00"}</td>
                              <td className="px-6 py-4 text-slate-600 font-bold">₹{fullData?.eventDetails?.pass_fee || "0.00"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'gallery' && (
                <div className="animate-fadeIn">
                  <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2  tracking-wide">
                    Gallery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                      <MediaRenderer
                        src={fullData?.eventDetails?.banner_url}
                        type={fullData?.eventDetails?.banner_type}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'tnc' && (
                <div className="animate-fadeIn">
                  <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2  tracking-wide">
                    Terms & Conditions
                  </h3>
                  <div className="space-y-4">
                    {fullData?.terms?.length > 0 ? (
                      fullData.terms.map((term, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500 relative">
                          <p className="font-bold text-slate-800 text-sm mb-1">{term.policy_group}</p>
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-[10px] text-blue-600 font-bold uppercase">{term.policy_type}</p>
                            {term.is_default ? (
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase tracking-wider">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">{term.description}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400 text-sm italic">Standard terms and conditions apply to this event.</p>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'amenities' && (
                <div className="animate-fadeIn">
                  <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2  tracking-wide">
                    Available Amenities & Stalls
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fullData?.layout?.stalls?.length > 0 ? (
                      fullData.layout.stalls.map((stall, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{stall.stall_name}</p>
                            <p className="text-[10px] text-slate-500 font-bold ">Size: {stall.size || "N/A"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-blue-600">₹{stall.price_inr}</p>
                            <span className="text-[8px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase">{stall.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 flex flex-col items-center justify-center py-10 text-slate-300">
                        <Layers size={40} className="mb-2" />
                        <p className="text-sm font-bold uppercase tracking-widest">No amenities listed</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentTab === 'reviews' && (
                <div className="animate-fadeIn p-2">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT SIDE - SUMMARY */}
                    <div className="space-y-6">
                      <h3 className="text-blue-600 font-bold  tracking-wide">Reviews</h3>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} size={20} fill="#facc15" className="text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-slate-400 text-sm font-medium">(120 Reviews)</span>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-4 group">
                            <span className="text-slate-600 text-xs font-bold w-12">{star} Star</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-300 w-0 transition-all duration-500" />
                            </div>
                            <span className="text-slate-400 text-xs font-bold w-8">0%</span>
                          </div>
                        ))}
                      </div>

                      <button className="text-blue-600 text-sm font-bold hover:underline">
                        View All Reviews
                      </button>
                    </div>

                    {/* RIGHT SIDE - SUBMIT FORM */}
                    <div className="space-y-6">
                      <h3 className="text-slate-900 font-bold  tracking-wide">Submit Your Review</h3>

                      <div>
                        <p className="text-slate-600 text-sm font-medium mb-3 flex items-center gap-2">
                          Your Rating for this Event :
                          <div className="flex gap-1 ml-2" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map((s) => (
                              <button
                                key={s}
                                onClick={() => setReviewRating(s)}
                                onMouseEnter={() => setHoverRating(s)}
                                className="transition-transform active:scale-90 focus:outline-none"
                              >
                                <StarIcon
                                  size={24}
                                  fill={(hoverRating || reviewRating) >= s ? "#facc15" : "none"}
                                  className={`transition-all duration-200 transform ${(hoverRating || reviewRating) >= s
                                      ? "text-yellow-400 scale-110"
                                      : "text-slate-300"
                                    }`}
                                />
                              </button>
                            ))}
                          </div>
                        </p>
                      </div>

                      <div className="space-y-4">
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share Your Thoughts..."
                          className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-slate-400 text-sm font-medium">
                            Guest
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 text-slate-400 text-sm font-medium">
                            No Email Available
                          </div>
                        </div>

                        <button
                          className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-xs"
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - SIDEBAR */}
          <div className="w-full lg:w-80 space-y-6">

            {/* BOOK NOW BUTTON */}
            {(() => {
              const capacity = parseInt(fullData?.booking?.capacity) || 0;
              const registered = parseInt(fullData?.booking?.registered) || 0;
              const isFull = capacity > 0 && registered >= capacity;
              const isPast = new Date(fullData?.eventDetails?.end_date) < new Date().setHours(0, 0, 0, 0);
              const isClosed = isFull || isPast;

              return (
                <button
                  disabled={isClosed}
                  onClick={() => !isClosed && navigate(`/usersbooking/${selectedEventId}`)}
                  className={`w-full font-bold py-5 rounded-xl shadow-lg transition-all transform ${isClosed
                      ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-95"
                    } text-sm tracking-widest`}
                >
                  {isClosed ? "BOOKING CLOSED" : "BOOK NOW"}
                </button>
              );
            })()}

            {/* EVENT DETAILS CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100">
                <h4 className="text-xs font-black text-blue-600 tracking-widest">EVENT DETAILS</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Start Date</p>
                  <p className="text-[10px] text-slate-500 font-medium">: {formatDateLong(fullData?.eventDetails?.start_date)}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">End Date</p>
                  <p className="text-[10px] text-slate-500 font-medium">: {formatDateLong(fullData?.eventDetails?.end_date)}</p>
                </div>
                <div className="flex items-start gap-4">
                  <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Address</p>
                  <p className="text-[10px] text-slate-500 font-medium">: {fullData?.eventDetails?.venue}</p>
                </div>
              </div>
            </div>

            {/* ORGANIZER DETAILS CARD */}
            <OrganizerDetailCard organizerData={fullData?.organizer} />

          </div>
        </div>

        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default EventDetailModal;

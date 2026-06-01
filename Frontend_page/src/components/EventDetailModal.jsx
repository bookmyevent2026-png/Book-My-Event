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
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin
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
  const [masterPolicies, setMasterPolicies] = React.useState([]);

  React.useEffect(() => {
    if (fullData?.eventDetails?.user_id || fullData?.eventDetails?.created_by) {
      import("../Services/api").then(({ getPolicies }) => {
        getPolicies(fullData?.eventDetails?.user_id).then(res => {
          setMasterPolicies(res.data || []);
        }).catch(err => console.error("Failed to fetch master policies", err));
      });
    }
  }, [fullData?.eventDetails?.user_id]);
  console.log("Full Data", fullData)

  const getTermDescription = (term) => {
    const existingDesc = term.description || term.policy_description || term.policy_desc;
    if (existingDesc) return existingDesc;

    // Fallback to Master Policies lookup if not found directly
    const matched = masterPolicies.find(p =>
      (p.policy_name === term.policyName || p.policy_name === term.policy_name) &&
      (p.policy_group === term.policyGroup || p.policy_group === term.policy_group)
    );
    return matched?.description || "";
  };

  if (!selectedEventId || !fullData) return null;

  return (
    <div className="fixed inset-0 bg-[#f8faff] z-[100] overflow-y-auto animate-fadeIn">
      <div className="w-full min-h-screen flex flex-col relative pb-10">
        <button
          onClick={() => {
            closeModal();
            navigate("/");
          }}
          className="fixed top-6 left-6 px-3.5 py-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md rounded-full transition-all text-white z-[110] shadow-lg flex items-center gap-1 text-xs font-bold uppercase tracking-wider group"
        >
          <ChevronLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span>Home</span>
        </button>

        {/* Floating close button - Top Right fixed relative to viewport */}
        <button
          onClick={closeModal}
          className="fixed top-6 right-6 p-2 bg-slate-900/40 hover:bg-slate-900/80 backdrop-blur-md rounded-full transition-all text-white z-[110] shadow-lg"
        >
          <X size={20} />
        </button>

        {/* EVENT BANNER IMAGE WITH OVERLAY */}
        <div className="w-full h-64 md:h-80 relative flex-shrink-0 bg-slate-900 overflow-hidden">
          {fullData?.eventDetails?.banner_url ? (
            <MediaRenderer
              src={fullData.eventDetails.banner_url}
              type={fullData.eventDetails.banner_type}
              className="w-full h-full object-cover opacity-70"
            />
          ) : (
            <div className="w-full h-full bg-slate-800" />
          )}
          <div className="absolute inset-0 bg-slate-900/40" />

          <div className="absolute inset-0 flex flex-col justify-center px-10 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-bold text-white mb-2">{fullData?.eventDetails?.event_name}</h1>
            <div className="text-[10px] text-yellow-500 font-bold tracking-widest flex gap-2 uppercase mb-8">
              <span className="text-yellow-500 hover:underline cursor-pointer">Home</span> <span className="text-slate-400">&gt;</span>
              <span className="text-slate-300">{fullData?.eventDetails?.category || "EXPO"}</span> <span className="text-slate-400">&gt;</span>
              <span className="text-white">{fullData?.eventDetails?.event_name}</span>
            </div>

            <div className="flex justify-between items-end">
              <div className="flex gap-12 text-white text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-[9px] font-bold tracking-widest text-slate-300 mt-1">EVENTS HOSTED</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-[9px] font-bold tracking-widest text-slate-300 mt-1">FOLLOWERS</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-[9px] font-bold tracking-widest text-slate-300 mt-1">REVIEWS</div>
                </div>
              </div>

              <div className="flex flex-col items-end hidden md:flex">
                <div className="flex items-center gap-4 mb-3">
                  <Facebook size={16} className="text-slate-300 hover:text-white cursor-pointer" />
                  <Linkedin size={16} className="text-slate-300 hover:text-white cursor-pointer" />
                  <Twitter size={16} className="text-slate-300 hover:text-white cursor-pointer" />
                </div>
                <div className="text-white text-[9px] font-bold tracking-widest uppercase">SHARE TO</div>
              </div>
            </div>
          </div>
        </div>

        {/* VENUE INFO BAR */}
        <div className="bg-white border-b border-slate-100 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center items-center px-10">
          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
            <MapPin size={18} className="text-blue-500 mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">{fullData?.eventDetails?.venue}</h3>
            <p className="text-[10px] text-slate-500">{fullData?.eventDetails?.address || "Location unavailable"}</p>
          </div>

          <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
            <Phone size={18} className="text-blue-500 mb-2" />
            <span className="font-bold text-slate-800 text-sm">
              {fullData?.organizer?.phone || "-"}
            </span>
            <span className="text-[10px] text-slate-500">Organiser Phone</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Globe size={18} className="text-blue-500 mb-2" />
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold">
              <span>For Enquiries:</span>
              <a href="https://sportalytics.in/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                https://sportalytics.in/
              </a>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white border-b border-slate-100 flex justify-center">
          <div className="w-full max-w-7xl px-10 flex overflow-x-auto no-scrollbar gap-8">
            {[
              { id: 'about', label: 'ABOUT' },
              { id: 'amenities', label: 'AMENITIES' },
              { id: 'gallery', label: 'GALLERY' },
              { id: 'tnc', label: 'T & C' },
              { id: 'reviews', label: 'REVIEWS' },
              { id: 'pricing', label: 'PRICING' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 text-[11px] font-bold transition-all border-b-2 whitespace-nowrap tracking-widest uppercase ${currentTab === tab.id
                  ? "border-[#3f63fc] text-[#3f63fc]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 bg-[#f8faff] p-6 px-10 flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto">

          {/* LEFT SIDE - CONTENT */}
          <div className="flex-1 space-y-6">
            <div className="bg-white rounded shadow-sm border border-slate-100 p-8 min-h-[400px]">
              {currentTab === 'about' && (
                <div className="animate-fadeIn">
                  <h3 className="text-[#3f63fc] font-bold mb-6 uppercase tracking-widest text-sm">
                    About the Event
                  </h3>
                  <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {fullData?.eventDetails?.description || "Step into a world where a single thread and a simple hook transform into breathtaking art. 'Stitches & Stories' is a celebration of crochet, showcasing the intricate beauty, boundless creativity, and rich heritage of this time-honored craft. From delicate, heirloom-quality lace to bold, contemporary fiber sculptures, discover the magic that happens when patience meets passion."}
                    </p>
                    <div className="flex gap-2 text-xs text-slate-500 items-center flex-wrap">
                      <span className="font-bold text-slate-800">Tags :</span>
                      {fullData?.eventDetails?.tags ? (
                        Array.isArray(fullData.eventDetails.tags)
                          ? fullData.eventDetails.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 rounded text-[10px] uppercase font-bold text-slate-600">{tag.trim()}</span>
                          ))
                          : typeof fullData.eventDetails.tags === 'string'
                            ? fullData.eventDetails.tags.split(',').map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-slate-100 rounded text-[10px] uppercase font-bold text-slate-600">{tag.trim()}</span>
                            ))
                            : <span className="px-2 py-1 bg-slate-100 rounded text-[10px] uppercase font-bold text-slate-600">{fullData.eventDetails.tags}</span>
                      ) : (
                        <span className="text-slate-400 italic">No tags</span>
                      )}
                    </div>

                    <div className="pt-10 flex flex-col items-center mt-8">
                      <p className="text-sm text-slate-800 font-bold mb-4">Want to Participate in the Event?</p>
                      <button className="bg-[#3f63fc] hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs transition-colors rounded">
                        Join as Exhibitor
                      </button>
                    </div>
                    {fullData?.guests?.length > 0 && (
                      <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold  tracking-widest mb-4">Special Guests</p>
                        <div className="grid grid-cols-2 gap-4">
                          {fullData.guests.map((guest, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                              {(guest.image_url || guest.image) ? (
                                <img
                                  src={guest.image_url || guest.image}
                                  alt={guest.guest_name}
                                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                  {guest.guest_name ? guest.guest_name.charAt(0).toUpperCase() : '👤'}
                                </div>
                              )}
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
                        <div key={i} className="p-5 bg-slate-50 rounded-xl border-l-4 border-blue-500 relative shadow-sm">
                          <p className="font-bold text-slate-800 text-sm mb-1">{term.policyName || term.policy_name || term.policyGroup || term.policy_group || "Policy"}</p>
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-100/60">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{term.policyGroup || term.policy_group}</p>
                            <span className="text-slate-300">•</span>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{term.policyType || term.policy_type}</p>
                            {term.isDefault || term.is_default ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest ml-auto">
                                Default
                              </span>
                            ) : null}
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap policy-desc-view" dangerouslySetInnerHTML={{ __html: getTermDescription(term) }} />
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
                  {/* <h3 className="text-blue-600 font-bold mb-6 flex items-center gap-2  tracking-wide">
                    Available Amenities & Stalls
                  </h3> */}
                  <div className="space-y-8">

                    {/* EVENT-LEVEL AMENITIES DESCRIPTION */}
                    {fullData?.eventDetails?.amenities && (
                      <div>
                        <h4 className="text-[#3f63fc] font-bold mb-4 tracking-widest text-sm flex items-center gap-2">
                          <Layers size={14} /> Event Amenities Description
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-xs">
                          {(() => {
                            const raw = fullData.eventDetails.amenities;
                            if (Array.isArray(raw)) return raw.join(', ');
                            return raw;
                          })()}
                        </p>
                      </div>
                    )}

                    {/* STALLS 
                    {(fullData?.layout?.stalls?.length > 0 || fullData?.stalls?.length > 0) && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest border-b pb-2">Stalls</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(fullData?.layout?.stalls || fullData?.stalls || []).map((stall, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-800">{stall.stall_name || stall.stallName}</p>
                                {(stall.size || stall.stall_size) && (
                                  <p className="text-[10px] text-slate-500 font-bold ">Size: {stall.amenities || stall.amenity}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-blue-600">₹{stall.price_inr || stall.priceINR}</p>
                                <span className="text-[8px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase">{stall.status || "Active"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}

                    {/* AMENITIES */}
                    {(fullData?.layout?.amenities?.length > 0 || fullData?.amenities?.length > 0 || fullData?.layout?.master?.amenities?.length > 0) && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-widest border-b pb-2">Amenities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(fullData?.layout?.amenities || fullData?.amenities || fullData?.layout?.master?.amenities || []).map((amenity, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                              <div>
                                <p className="font-bold text-slate-800">{amenity.amenity}</p>
                                <p className="text-[10px] text-slate-500 font-bold ">Stall: {amenity.stallName || amenity.stall_name || "N/A"}</p>
                              </div>
                              <div className="text-right flex flex-col items-end gap-1">
                                {amenity.qty && (
                                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded shadow-sm border border-slate-100">Qty: {amenity.qty}</span>
                                )}
                                {amenity.cost_inr && (
                                  <p className="text-sm font-black text-blue-600">₹{amenity.cost_inr}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!(fullData?.layout?.stalls?.length > 0 || fullData?.stalls?.length > 0) &&
                      !(fullData?.layout?.amenities?.length > 0 || fullData?.amenities?.length > 0 || fullData?.layout?.master?.amenities?.length > 0)) && (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-300">
                          <Layers size={40} className="mb-2" />
                          <p className="text-sm font-bold uppercase tracking-widest">No amenities or stalls listed</p>
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
                  className={`w-full font-bold py-4 transition-all uppercase tracking-widest text-xs ${isClosed
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#3f63fc] hover:bg-blue-700 text-white"
                    }`}
                >
                  {isClosed ? "BOOKING CLOSED" : "BOOK NOW"}
                </button>
              );
            })()}

            {/* EVENT DETAILS CARD */}
            <div className="bg-white shadow-sm border border-slate-100 mb-6">
              <div className="px-6 py-4 border-b border-slate-100">
                <h4 className="text-[11px] font-bold text-[#3f63fc] tracking-widest uppercase">EVENT DETAILS</h4>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start text-xs">
                  <p className="font-bold text-slate-900 w-24 flex-shrink-0">Start Date</p>
                  <p className="text-slate-600">: {formatDateLong(fullData?.eventDetails?.start_date)}</p>
                </div>
                <div className="flex items-start text-xs">
                  <p className="font-bold text-slate-900 w-24 flex-shrink-0">End Date</p>
                  <p className="text-slate-600">: {formatDateLong(fullData?.eventDetails?.end_date)}</p>
                </div>
                <div className="flex items-start text-xs gap-1">
                  <p className="font-bold text-slate-900 w-24 flex-shrink-0">Address</p>
                  <span className="text-slate-600 flex-shrink-0">:</span>
                  <p className="text-slate-600 flex-1">{fullData?.eventDetails?.venue}{fullData?.eventDetails?.address ? `, ${fullData?.eventDetails?.address}` : ""}</p>
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

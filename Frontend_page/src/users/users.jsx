import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  Loader2,
  Edit,
  Calendar,
  Utensils,
  Ticket,
  ChevronRight,
  ArrowLeft,
  Mail,
  User,
  ShieldCheck
} from "lucide-react";
import {
  getEventById,
  sendOtp,
  verifyOtp,
  resendOtp,
  bookEvent,
} from "../Services/api";

export const Userbooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    food_preference: "Veg"
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [redirectTimer, setRedirectTimer] = useState(10);

  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "info" }), 4000);
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    let interval;
    if (step === 3 && successData && redirectTimer > 0) {
      interval = setInterval(() => {
        setRedirectTimer((prev) => prev - 1);
      }, 1000);
    } else if (redirectTimer === 0) {
      navigate("/");
    }
    return () => clearInterval(interval);
  }, [step, successData, redirectTimer, navigate]);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!form.email) return showToast("Please enter your email!", "warning");
    if (!validateEmail(form.email)) return showToast("Invalid email address!", "error");

    try {
      setLoading(true);
      await sendOtp(form.email);
      setOtpSent(true);
      setTimer(60);
      showToast("OTP sent to your email!", "success");
    } catch (err) {
      showToast("Failed to send OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showToast("Enter the OTP", "warning");
    try {
      setLoading(true);
      await verifyOtp(form.email, otp);
      setVerified(true);
      showToast("Email verified!", "success");
    } catch (err) {
      showToast("Invalid OTP.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    try {
      setLoading(true);
      await resendOtp(form.email);
      setOtp("");
      setTimer(60);
      showToast("OTP resent!", "success");
    } catch {
      showToast("Failed to resend.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (!verified) return showToast("Verify your email first.", "warning");

    try {
      setLoading(true);
      const bookingData = {
        event_id: id,
        ...form,
        food_preference: event?.food == 1 ? form.food_preference : "None"
      };

      const res = await bookEvent(bookingData);
      showToast("Booking confirmed!", "success");
      setSuccessData(res);
      setStep(3);
    } catch (err) {
      showToast("Booking failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const StepIndicator = ({ num, label }) => {
    const isActive = step === num;
    const isCompleted = step > num;
    return (
      <div className="flex items-center gap-3 relative z-10">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
          ${isActive ? "bg-blue-600 text-white scale-110 shadow-blue-500/30" : 
            isCompleted ? "bg-blue-100 text-blue-600 border border-blue-200" : "bg-white text-slate-400 border border-slate-200"}`}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : num}
        </div>
        <span className={`font-bold text-sm tracking-wide transition-colors duration-300 
          ${isActive ? "text-blue-600" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
          {label}
        </span>
      </div>
    );
  };

  if (step === 3 && successData) {
    return (
      <div className="h-screen overflow-hidden bg-slate-50 flex flex-col items-center justify-center p-4 relative font-sans">
        <div className="max-w-sm w-full z-10 animate-fade-in-up">
          <div className="text-center mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1 shadow-sm">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-0.5">Confirmed!</h2>
            <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">Your digital pass is ready</p>
          </div>

          <div className="relative group perspective drop-shadow-xl">
            <div className="bg-white rounded-[2rem] overflow-hidden relative border border-slate-100">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-2">
                  <Ticket className="w-24 h-24" />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[8px] font-bold tracking-[0.2em] uppercase bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded-full">Entry Pass</span>
                </div>
                <h3 className="text-xl font-black mb-0.5 truncate drop-shadow-sm">{successData.event_details.name}</h3>
                <div className="flex items-center gap-1.5 text-xs font-medium opacity-90 text-blue-100">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{successData.event_details.venue}</span>
                </div>
              </div>

              <div className="p-4 bg-white relative">
                <div className="flex justify-center mb-6">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
                    <img src={`data:image/png;base64,${successData.qr_code}`} alt="QR Code" className="w-24 h-24 rounded-lg mix-blend-multiply" />
                  </div>
                </div>

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute w-full h-px bg-transparent border-t-2 border-dashed border-slate-200"></div>
                  <div className="bg-white px-3 z-10 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Admit One</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-slate-900 font-bold text-sm">{successData.event_details.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Guest</p>
                    <p className="text-slate-900 font-bold text-sm truncate">{form.name}</p>
                  </div>
                  {event?.food == 1 && (
                    <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-bold text-sm flex items-center gap-2">
                          <Utensils className="w-3 h-3 text-blue-500" /> {successData.event_details.food}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${successData.event_details.food === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {successData.event_details.food}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute left-[-16px] top-[120px] w-8 h-8 bg-slate-50 rounded-full shadow-inner border-r border-slate-100"></div>
              <div className="absolute right-[-16px] top-[120px] w-8 h-8 bg-slate-50 rounded-full shadow-inner border-l border-slate-100"></div>
            </div>
          </div>

          <button onClick={() => navigate('/')} className="w-full mt-3 py-2.5 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-900 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
            <ArrowLeft className="w-4 h-4 text-blue-600" /> Back to Home ({redirectTimer}s)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans selection:bg-blue-100">
      
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-in">
          <div className="bg-white border border-slate-100 shadow-xl p-3 rounded-xl flex items-center gap-3 max-w-sm">
            <div className={`p-1.5 rounded-lg ${toast.type === "success" ? "bg-green-100 text-green-600" : toast.type === "error" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
              {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : toast.type === "error" ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <p className="text-xs font-bold text-slate-700 flex-1">{toast.message}</p>
            <button onClick={() => setToast({ ...toast, show: false })} className="text-slate-400 hover:text-slate-600">
              <XCircle className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="w-full md:w-[300px] lg:w-[320px] bg-white border-r border-slate-200 flex flex-col relative z-20 shrink-0 shadow-sm">
        <div className="p-6 flex-1 flex flex-col">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-xs font-bold uppercase tracking-widest w-fit">
            <ArrowLeft className="w-3 h-3" /> Back
          </button>

          <div className="mb-8">
            <div className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-md mb-3 border border-blue-100">
              Registration
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight mb-4 line-clamp-2">
              {event?.event_name || event?.name || "Loading..."}
            </h1>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{event?.venue || "Venue"}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{event?.address || "Address"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Date</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{event?.start_date ? new Date(event.start_date).toLocaleDateString() : '--'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>
            <div className="space-y-6">
              <StepIndicator num={1} label="Guest Details" />
              <StepIndicator num={2} label="Order Summary" />
              <StepIndicator num={3} label="Confirmation" />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto relative bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl p-6 relative z-10 animate-fade-in-up">
          
          {step === 1 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900 mb-1">Complete booking</h2>
                <p className="text-slate-500 text-sm font-medium">Enter your details below to secure your pass.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <User className="w-3 h-3 text-blue-500" /> Full Name
                    </label>
                    <input name="name" placeholder="Jane Doe" value={form.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 outline-none font-semibold transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-blue-500" /> Phone
                    </label>
                    <input
  name="phone"
  placeholder="Phone number"
  value={form.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
    if (value.length <= 10) {
      handleChange({
        target: { name: "phone", value }
      });
    }
  }}
  maxLength={10}
  inputMode="numeric"
  pattern="[0-9]*"
  className="w-full bg-slate-50 border border-slate-200 p-3 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 outline-none font-semibold transition-all"
/>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-4">
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-blue-600" /> Email Address
                    </label>
                    <div className="flex gap-2">
                      <input name="email" type="email" placeholder="email@example.com" value={form.email} onChange={handleChange} disabled={verified} className={`flex-1 bg-white border border-blue-200 p-3 text-sm rounded-xl text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 outline-none font-semibold transition-all ${verified ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`} />
                      {!verified && (
                        <button 
                          onClick={otpSent ? handleResendOtp : handleSendOtp} 
                          disabled={loading || !form.email || (otpSent && timer > 0)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-xl text-sm transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 min-w-[120px]"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3 h-3" />}
                          {otpSent ? (timer > 0 ? `${timer}s` : "RESEND") : "GET OTP"}
                        </button>
                      )}
                      {verified && (
                        <div className="bg-green-100 border border-green-200 text-green-700 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> VERIFIED
                        </div>
                      )}
                    </div>
                  </div>

                  {otpSent && !verified && (
                    <div className="pt-3 border-t border-blue-100 animate-slide-down">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Security Code</label>
                      <div className="flex gap-2">
                        <input placeholder="000000" value={otp} maxLength={6} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} className="flex-1 bg-white border border-blue-200 p-3 rounded-xl text-blue-600 placeholder-slate-300 focus:border-blue-500 focus:ring-1 outline-none font-black text-lg tracking-[0.3em] text-center" />
                        <button onClick={handleVerifyOtp} disabled={loading || !otp} className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 text-sm rounded-xl transition-all flex items-center justify-center min-w-[100px] shadow-sm">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "VERIFY"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {event?.food == 1 && (
                  <div className="space-y-2 pt-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Utensils className="w-3 h-3 text-blue-500" /> Food Preference
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setForm({ ...form, food_preference: 'Veg' })} className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${form.food_preference === 'Veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${form.food_preference === 'Veg' ? 'border-green-500 bg-green-500' : 'border-slate-300 bg-transparent'}`}></div>
                        <span className="font-bold text-xs uppercase tracking-wider">Veg</span>
                      </button>
                      <button onClick={() => setForm({ ...form, food_preference: 'Non-Veg' })} className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${form.food_preference === 'Non-Veg' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full border-2 ${form.food_preference === 'Non-Veg' ? 'border-red-500 bg-red-500' : 'border-slate-300 bg-transparent'}`}></div>
                        <span className="font-bold text-xs uppercase tracking-wider">Non-Veg</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 mt-6">
                  <button onClick={() => setStep(2)} disabled={!verified} className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${verified ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                    {verified ? "PROCEED TO SUMMARY" : "VERIFY EMAIL TO CONTINUE"}
                    {verified && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fade-in-right">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Review Order</h2>
                  <p className="text-slate-500 text-sm">Verify details before confirming.</p>
                </div>
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs tracking-widest uppercase bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  <Edit className="w-3 h-3" /> Edit
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden relative mb-6">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="p-6 space-y-5">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm text-slate-600">
                      <span className="font-medium">Entry Pass (1x)</span>
                      <span className="font-black text-slate-900">₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-600">
                      <span className="font-medium">Service Fee</span>
                      <span className="font-black text-slate-900">₹0.00</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-transparent border-t border-dashed border-slate-300"></div>

                  <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Guest Name</p>
                      <p className="font-bold text-slate-900 text-sm truncate">{form.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email</p>
                      <p className="font-bold text-slate-900 text-sm truncate">{form.email}</p>
                    </div>
                    {event?.food == 1 && (
                       <div className="col-span-2 pt-3 border-t border-slate-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Selected Meal</p>
                        <span className={`inline-block px-3 py-1 rounded-md text-[10px] font-bold uppercase border ${form.food_preference === 'Veg' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {form.food_preference}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-transparent border-t border-dashed border-slate-300"></div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                      <p className="text-3xl font-black text-blue-600 tracking-tighter">Free</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group">
                  <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                    <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded checked:border-blue-600 checked:bg-blue-600 transition-all" />
                    <CheckCircle className="w-3 h-3 text-white absolute opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    I confirm all details are correct and I agree to the Terms and condtions.
                  </p>
                </label>

                <button onClick={handleBook} disabled={loading || !agreed} className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${agreed && !loading ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}>
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> CONFIRMING...</> : <>CONFIRM & GET PASS <ShieldCheck className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-in { 0% { transform: translateY(-10px); opacity: 0; } 60% { transform: translateY(5px); opacity: 1; } 100% { transform: translateY(0); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fade-in-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-down { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-right { animation: fade-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
        .perspective { perspective: 1000px; }
      `}</style>
    </div>
  );
};

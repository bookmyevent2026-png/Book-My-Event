import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, CheckCircle, XCircle, Info, AlertTriangle,
  Send, Loader2, Edit, Calendar, Utensils, Ticket, ChevronRight, ArrowLeft
} from "lucide-react";
import {
  getEventById, sendOtp, verifyOtp, resendOtp, bookEvent,
} from "../Services/api";

/* ─────────────── Google Fonts ─────────────── */
const FontImport = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
);

const C = {
  dark:   "#0f0f0f",
  dark2:  "#1a1a1a",
  dark3:  "#252525",
  border: "#2e2e2e",
  gold:   "#c9a96e",
  goldL:  "#e8c98a",
  white:  "#fafafa",
  gray:   "#8a8a8a",
  grayL:  "#c4c4c4",
  green:  "#34d089ff",
  greenBg:"rgba(62,207,142,0.08)",
  red:    "#f87171",
  amber:  "#fbbf24",
  blue:   "#60a5fa",
};

/* ─────────────── Shared input style ─────────────── */
const inputStyle = {
  width: "100%",
  background: C.dark3,
  border: `1px solid ${C.border}`,
  borderRadius: 10,
  padding: "9px 14px",
  color: C.white,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  outline: "none",
  transition: "border-color .2s",
  boxSizing: "border-box",
};

/* ─────────────── Toast ─────────────── */
const ICONS = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const TOAST_COLORS = {
  success: { bg:"rgba(62,207,142,0.12)", border:"rgba(62,207,142,0.3)", color: C.green },
  error:   { bg:"rgba(248,113,113,0.12)", border:"rgba(248,113,113,0.3)", color: C.red },
  warning: { bg:"rgba(251,191,36,0.12)", border:"rgba(251,191,36,0.3)", color: C.amber },
  info:    { bg:"rgba(96,165,250,0.12)", border:"rgba(96,165,250,0.3)", color: C.blue },
};
const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;
  const tc = TOAST_COLORS[type] || TOAST_COLORS.info;
  const Icon = ICONS[type] || Info;
  return (
    <div style={{
      position:"fixed", top:20, right:20, zIndex:9999,
      display:"flex", alignItems:"center", gap:10,
      padding:"12px 18px", borderRadius:12,
      background: tc.bg, border:`1px solid ${tc.border}`,
      color: tc.color, fontFamily:"'DM Sans', sans-serif", fontSize:13,
      fontWeight:500, animation:"toastIn .3s ease-out",
      boxShadow:"0 8px 32px rgba(0,0,0,.5)",
    }}>
      <Icon size={15} />
      <span>{message}</span>
      <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:tc.color, marginLeft:6, padding:0, lineHeight:1 }}>
        <XCircle size={13} />
      </button>
    </div>
  );
};

/* ─────────────── Compact field ─────────────── */
const Field = ({ label, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    <label style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color: C.gray, fontFamily:"'DM Sans', sans-serif" }}>{label}</label>
    {children}
  </div>
);

/* ─────────────── Gold button ─────────────── */
const GoldBtn = ({ onClick, disabled, loading, children, style={} }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? C.dark3 : `linear-gradient(135deg, ${C.gold}, ${C.goldL})`,
      border: "none", borderRadius: 10, color: disabled ? C.gray : C.dark,
      fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:13,
      cursor: disabled ? "not-allowed" : "pointer", padding:"10px 18px",
      display:"flex", alignItems:"center", gap:7, justifyContent:"center",
      transition:"all .2s", whiteSpace:"nowrap", ...style,
    }}
  >
    {loading ? <Loader2 size={14} style={{ animation:"spin 1s linear infinite" }} /> : children}
  </button>
);

/* ─────────────── Left panel info row ─────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
    <div style={{ width:32, height:32, borderRadius:8, background:"rgba(201,169,110,0.1)", border:`1px solid rgba(201,169,110,0.2)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <Icon size={14} color={C.gold} />
    </div>
    <div>
      <p style={{ fontSize:10, color: C.gray, fontFamily:"'DM Sans', sans-serif", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.08em", margin:0 }}>{label}</p>
      <p style={{ fontSize:13, color: C.white, fontFamily:"'DM Sans', sans-serif", fontWeight:500, margin:"3px 0 0", lineHeight:1.4 }}>{value || "—"}</p>
    </div>
  </div>
);

/* ════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const Userbooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent]       = useState(null);
  const [form, setForm]         = useState({ name:"", email:"", phone:"", food_preference:"Veg" });
  const [otp, setOtp]           = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState(1);
  const [agreed, setAgreed]     = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [toast, setToast]       = useState({ show:false, message:"", type:"info" });

  const showToast = (message, type="info") => {
    setToast({ show:true, message, type });
    setTimeout(() => setToast({ show:false, message:"", type:"info" }), 3500);
  };

  useEffect(() => {
    getEventById(id).then(setEvent).catch(console.error);
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const validateEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSendOtp = async () => {
    if (!form.email)               return showToast("Enter your email first", "warning");
    if (!validateEmail(form.email)) return showToast("Enter a valid email address", "error");
    try {
      setLoading(true);
      await sendOtp(form.email);
      setOtpSent(true);
      showToast("OTP sent to your email", "success");
    } catch { showToast("Failed to send OTP", "error"); }
    finally  { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return showToast("Enter the OTP", "warning");
    try {
      setLoading(true);
      await verifyOtp(form.email, otp);
      setVerified(true);
      showToast("Email verified!", "success");
    } catch { showToast("Invalid OTP. Try again.", "error"); }
    finally  { setLoading(false); }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp(form.email);
      setOtp("");
      showToast("OTP resent", "success");
    } catch { showToast("Failed to resend OTP", "error"); }
  };

  const handleBook = async () => {
    if (!verified) return showToast("Verify your email first", "warning");
    try {
      setLoading(true);
      const res = await bookEvent({ event_id:id, ...form, food_preference: event?.food==1 ? form.food_preference : "None" });
      setSuccessData(res);
      setStep(3);
      showToast("Booking confirmed!", "success");
    } catch { showToast("Booking failed. Try again.", "error"); }
    finally  { setLoading(false); }
  };

  /* ─── STEP 3: SUCCESS ─── */
  if (step === 3 && successData) {
    return (
      <>
        <FontImport />
        <Toast {...toast} onClose={() => setToast(t => ({ ...t, show:false }))} />
        <div style={{ height:"100dvh", overflow:"hidden", background: C.dark, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ width:"100%", maxWidth:400, display:"flex", flexDirection:"column", gap:16 }}>
            {/* Header */}
            <div style={{ textAlign:"center" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background: C.greenBg, border:`1px solid rgba(62,207,142,0.3)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <CheckCircle size={24} color={C.green} />
              </div>
              <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, color: C.white, margin:0 }}>Booking Confirmed</h2>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color: C.gray, margin:"6px 0 0" }}>Your digital pass is on its way</p>
            </div>

            {/* Ticket */}
            <div style={{ background: C.dark2, border:`1px solid ${C.border}`, borderRadius:20, overflow:"hidden" }}>
              {/* Top band */}
              <div style={{ background:`linear-gradient(135deg, #1a1a2e, #16213e)`, padding:"20px 22px", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <Ticket size={16} color={C.gold} />
                  <span style={{ fontSize:9, fontFamily:"'DM Sans', sans-serif", fontWeight:700, letterSpacing:"0.15em", color: C.gold, textTransform:"uppercase" }}>Entry Pass</span>
                </div>
                <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color: C.white, margin:0, lineHeight:1.3 }}>{successData.event_details.name}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                  <MapPin size={11} color={C.gray} />
                  <span style={{ fontSize:12, color: C.gray, fontFamily:"'DM Sans', sans-serif" }}>{successData.event_details.venue}</span>
                </div>
              </div>

              {/* QR + Details */}
              <div style={{ padding:"20px 22px", display:"flex", gap:16, alignItems:"center" }}>
                <div style={{ padding:8, background: C.white, borderRadius:10, flexShrink:0 }}>
                  <img src={`data:image/png;base64,${successData.qr_code}`} alt="QR Code" style={{ width:80, height:80, display:"block" }} />
                </div>
                <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                  <div>
                    <p style={{ fontSize:10, color: C.gray, fontFamily:"'DM Sans', sans-serif", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>Date</p>
                    <p style={{ fontSize:13, color: C.white, fontFamily:"'DM Sans', sans-serif", fontWeight:500, margin:"3px 0 0" }}>{successData.event_details.date}</p>
                  </div>
                  <div>
                    <p style={{ fontSize:10, color: C.gray, fontFamily:"'DM Sans', sans-serif", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>Visitor</p>
                    <p style={{ fontSize:13, color: C.white, fontFamily:"'DM Sans', sans-serif", fontWeight:500, margin:"3px 0 0" }}>{form.name}</p>
                  </div>
                  {event?.food==1 && (
                    <div>
                      <p style={{ fontSize:10, color: C.gray, fontFamily:"'DM Sans', sans-serif", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", margin:0 }}>Meal</p>
                      <span style={{ display:"inline-block", marginTop:3, fontSize:11, fontWeight:600, fontFamily:"'DM Sans', sans-serif", padding:"2px 10px", borderRadius:20, background: successData.event_details.food==="Veg" ? "rgba(62,207,142,0.15)" : "rgba(248,113,113,0.15)", color: successData.event_details.food==="Veg" ? C.green : C.red }}>
                        {successData.event_details.food}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/")}
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px", borderRadius:12, border:`1px solid ${C.border}`, background:"transparent", color: C.gray, fontFamily:"'DM Sans', sans-serif", fontSize:13, fontWeight:500, cursor:"pointer" }}
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
          </div>
        </div>
        <GlobalStyles />
      </>
    );
  }

  /* ─── STEP 1 & 2: BOOKING ─── */
  return (
    <>
      <FontImport />
      <Toast {...toast} onClose={() => setToast(t => ({ ...t, show:false }))} />

      <div style={{ height:"100dvh", overflow:"hidden", background: C.dark, display:"flex", fontFamily:"'DM Sans', sans-serif" }}>

        {/* ── LEFT PANEL (hidden on very small screens via media — use CSS class) ── */}
        <div className="booking-left" style={{
          width:300, flexShrink:0, background: C.dark2, borderRight:`1px solid ${C.border}`,
          display:"flex", flexDirection:"column", padding:28, justifyContent:"space-between",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Ticket size={15} color={C.dark} />
              </div>
              <span style={{ fontSize:13, fontWeight:600, color: C.grayL, letterSpacing:"0.05em" }}>ENTRY PASS</span>
            </div>

            <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:26, color: C.white, lineHeight:1.2, margin:"0 0 6px" }}>
              {event?.venue || "Loading…"}
            </h1>
            <p style={{ fontSize:12, color: C.gray, margin:"0 0 28px", lineHeight:1.6 }}>
              {event?.address || "Fetching details…"}
            </p>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <InfoRow icon={Calendar} label="Event Date"
                value={event?.start_date ? new Date(event.start_date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—"} />
              <InfoRow icon={MapPin}   label="Venue"    value={event?.venue} />
              {event?.food==1 && <InfoRow icon={Utensils} label="Dining" value="Meal provided" />}
            </div>
          </div>

          {/* Step indicator */}
          <div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {["Your Details","Review","Confirmed"].map((s, i) => {
                const active  = step === i+1;
                const done    = step > i+1;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{
                      width:22, height:22, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                      background: done ? C.green : active ? C.gold : "transparent",
                      border: done||active ? "none" : `1px solid ${C.border}`,
                      fontSize:10, fontWeight:700, color: done||active ? C.dark : C.gray,
                    }}>
                      {done ? "✓" : i+1}
                    </div>
                    <span style={{ fontSize:12, fontWeight: active ? 600 : 400, color: active ? C.white : done ? C.grayL : C.gray }}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Mobile top bar */}
          <div className="booking-topbar" style={{
            display:"none", alignItems:"center", gap:12, padding:"12px 16px",
            borderBottom:`1px solid ${C.border}`, background: C.dark2, flexShrink:0,
          }}>
            <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg,${C.gold},${C.goldL})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Ticket size={13} color={C.dark} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ margin:0, fontSize:13, fontWeight:600, color: C.white, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{event?.venue || "Loading…"}</p>
              <p style={{ margin:0, fontSize:11, color: C.gray }}>{event?.start_date ? new Date(event.start_date).toLocaleDateString() : ""}</p>
            </div>
            {/* Step pills */}
            <div style={{ display:"flex", gap:4 }}>
              {[1,2,3].map(n => (
                <div key={n} style={{ width:22, height:5, borderRadius:3, background: step>=n ? C.gold : C.border }} />
              ))}
            </div>
          </div>

          {/* Form area */}
          <div style={{ flex:1, overflowY:"auto", padding:"clamp(16px,3vw,32px)", display:"flex", justifyContent:"center", alignItems:"flex-start" }}>
            <div style={{ width:"100%", maxWidth:500 }}>

              {/* ═════ STEP 1: FORM ═════ */}
              {step === 1 && (
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  <div style={{ marginBottom:24 }}>
                    <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color: C.white, margin:0 }}>Complete your details</h2>
                    <p style={{ fontSize:13, color: C.gray, margin:"6px 0 0" }}>Fill in the fields below to generate your entry pass.</p>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    {/* Name */}
                    <Field label="Full Name">
                      <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange}
                        style={inputStyle} onFocus={e => e.target.style.borderColor=C.gold} onBlur={e => e.target.style.borderColor=C.border} />
                    </Field>

                    {/* Email + OTP */}
                    <Field label="Email Address">
                      <div style={{ display:"flex", gap:8 }}>
                        <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                          disabled={verified} style={{ ...inputStyle, flex:1, opacity: verified ? 0.5 : 1 }}
                          onFocus={e => e.target.style.borderColor=C.gold} onBlur={e => e.target.style.borderColor=C.border} />
                        {!verified && (
                          <GoldBtn onClick={otpSent ? handleResendOtp : handleSendOtp} disabled={loading || !form.email} loading={loading && !otpSent}>
                            <Send size={13} />{otpSent ? "Resend" : "Get OTP"}
                          </GoldBtn>
                        )}
                        {verified && (
                          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", borderRadius:10, background: C.greenBg, border:`1px solid rgba(62,207,142,0.3)`, color: C.green, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
                            <CheckCircle size={13} /> Verified
                          </div>
                        )}
                      </div>
                    </Field>

                    {/* OTP Input */}
                    {otpSent && !verified && (
                      <div style={{ background:`rgba(201,169,110,0.06)`, border:`1px solid rgba(201,169,110,0.2)`, borderRadius:12, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                        <p style={{ margin:0, fontSize:11, fontWeight:600, color: C.gold, textTransform:"uppercase", letterSpacing:"0.1em" }}>Enter OTP sent to your email</p>
                        <div style={{ display:"flex", gap:8 }}>
                          <input value={otp} maxLength={6} onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
                            placeholder="○ ○ ○ ○ ○ ○"
                            style={{ ...inputStyle, flex:1, textAlign:"center", fontSize:18, fontWeight:700, letterSpacing:"0.3em", color: C.gold }}
                            onFocus={e => e.target.style.borderColor=C.gold} onBlur={e => e.target.style.borderColor=C.border} />
                          <GoldBtn onClick={handleVerifyOtp} disabled={loading || !otp} loading={loading}>
                            Validate
                          </GoldBtn>
                        </div>
                      </div>
                    )}

                    {/* Phone */}
                    <Field label="Phone Number">
                      <input name="phone" placeholder="+91 00000 00000" value={form.phone} onChange={handleChange}
                        style={inputStyle} onFocus={e => e.target.style.borderColor=C.gold} onBlur={e => e.target.style.borderColor=C.border} />
                    </Field>

                    {/* Food */}
                    {event?.food==1 && (
                      <Field label="Meal Preference">
                        <div style={{ display:"flex", gap:8 }}>
                          {["Veg","Non-Veg"].map(opt => {
                            const sel = form.food_preference === opt;
                            const col = opt==="Veg" ? C.green : C.red;
                            return (
                              <button key={opt} onClick={() => setForm({...form, food_preference:opt})}
                                style={{ flex:1, padding:"9px 0", borderRadius:10, border:`1px solid ${sel ? col : C.border}`,
                                  background: sel ? `rgba(${opt==="Veg"?"62,207,142":"248,113,113"},0.1)` : "transparent",
                                  color: sel ? col : C.gray, fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:12,
                                  cursor:"pointer", transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                                <div style={{ width:7, height:7, borderRadius:"50%", background: sel ? col : C.border }} />
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </Field>
                    )}

                    {/* CTA */}
                    {verified ? (
                      <button onClick={() => setStep(2)}
                        style={{ marginTop:8, width:"100%", padding:"13px", borderRadius:12, border:"none",
                          background:`linear-gradient(135deg,${C.gold},${C.goldL})`, color: C.dark,
                          fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:14,
                          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, letterSpacing:"0.02em" }}>
                        Continue to Summary <ChevronRight size={16} />
                      </button>
                    ) : (
                      <div style={{ marginTop:8, padding:"13px", borderRadius:12, background: C.dark3, border:`1px solid ${C.border}`,
                        color: C.gray, fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:600,
                        textAlign:"center", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                        Verify your email to continue
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ═════ STEP 2: SUMMARY ═════ */}
              {step === 2 && (
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
                    <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color: C.white, margin:0 }}>Review &amp; Confirm</h2>
                    <button onClick={() => setStep(1)}
                      style={{ display:"flex", alignItems:"center", gap:5, background:"none", border:"none", color: C.gold, fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:12, cursor:"pointer" }}>
                      <Edit size={12} /> Edit
                    </button>
                  </div>

                  <div style={{ background: C.dark2, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", marginBottom:14 }}>
                    {[
                      { label:"Visitor Name", value: form.name },
                      { label:"Email",        value: form.email },
                      { label:"Phone",        value: form.phone || "—" },
                      ...(event?.food==1 ? [{ label:"Meal Preference", value: form.food_preference, pill:true }] : []),
                    ].map((row, i, arr) => (
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize:12, color: C.gray, fontWeight:500 }}>{row.label}</span>
                        {row.pill ? (
                          <span style={{ fontSize:11, fontWeight:600, padding:"3px 12px", borderRadius:20,
                            background: form.food_preference==="Veg" ? "rgba(62,207,142,0.15)" : "rgba(248,113,113,0.15)",
                            color: form.food_preference==="Veg" ? C.green : C.red }}>
                            {row.value}
                          </span>
                        ) : (
                          <span style={{ fontSize:13, color: C.white, fontWeight:500 }}>{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", background:`rgba(201,169,110,0.06)`, border:`1px solid rgba(201,169,110,0.15)`, borderRadius:12, marginBottom:14 }}>
                    <span style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color: C.white }}>Total</span>
                    <span style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color: C.gold }}>₹ 0.00</span>
                  </div>

                  {/* T&C */}
                  <label style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 14px", background: C.dark3, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer", marginBottom:14 }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                      style={{ width:15, height:15, marginTop:2, accentColor: C.gold, flexShrink:0, cursor:"pointer" }} />
                    <span style={{ fontSize:12, color: C.gray, lineHeight:1.5 }}>
                      I confirm my details are correct and agree to the event's{" "}
                      <span style={{ color: C.gold, textDecoration:"underline", cursor:"pointer" }}>Terms &amp; Participation Policies</span>.
                    </span>
                  </label>

                  {/* Confirm */}
                  <button onClick={handleBook} disabled={loading || !agreed}
                    style={{ width:"100%", padding:"14px", borderRadius:12, border:"none",
                      background: agreed ? `linear-gradient(135deg,${C.gold},${C.goldL})` : C.dark3,
                      color: agreed ? C.dark : C.gray,
                      fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:14,
                      cursor: agreed ? "pointer" : "not-allowed",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:9, transition:"all .2s", letterSpacing:"0.02em" }}>
                    {loading ? <><Loader2 size={16} style={{ animation:"spin 1s linear infinite" }} /> Confirming…</> : <><CheckCircle size={16} /> Confirm &amp; Generate Ticket</>}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <GlobalStyles />
    </>
  );
};

/* ─────────────── Global CSS ─────────────── */
const GlobalStyles = () => (
  <style>{`
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes toastIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
    * { box-sizing: border-box; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2e2e2e; border-radius: 4px; }

    /* Left panel: hide on narrow screens */
    @media (max-width: 640px) {
      .booking-left    { display: none !important; }
      .booking-topbar  { display: flex !important; }
    }

    /* Input focus gold ring */
    input:focus { border-color: #c9a96e !important; }
  `}</style>
);
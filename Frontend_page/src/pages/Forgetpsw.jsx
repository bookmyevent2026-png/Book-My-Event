import React, { useState, useEffect, useRef } from "react";
import {
  resetsendOtp,
  resetverifyOtp,
  resetresendOtp,
  resetPassword,
} from "../Services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current); // ✅ clear old timer
    }

    setTimer(60);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => {
    if (step === 2) {
      startTimer();
    }
  }, [step]);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (message) {
      setError(""); // Clear error when message is set
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000); 

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      setMessage(""); // Clear message when error is set
      const timer = setTimeout(() => {
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSendOtp = async () => {
    if (!email) return setError("Please enter your email Id");

    if (!validateEmail(email)) {
      return setError("Enter a valid email address");
    }
    setLoading(true);
    setError("");
    try {
      const res = await resetsendOtp({ email });
      setMessage(res.message || "OTP sent successfully");
      setStep(2);
      startTimer();
    } catch (err) {
      setError("Failed to send OTP. Please check your email.");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 6) return setError("Please enter the complete OTP");
    setLoading(true);
    setError("");
    try {
      const res = await resetverifyOtp({ email, otp: fullOtp });
      if (res.status) {
        setMessage("OTP verified");
        setOtp(fullOtp);
        setStep(3);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      await resetresendOtp({ email });
      setMessage("OTP resent to your email");
      setError("");
      setOtpDigits(["", "", "", "", "", ""]);
      // ✅ Focus first input
      setTimeout(() => {
        document.getElementById("otp-0")?.focus();
      }, 100);
      startTimer(); // restart timer
    } catch (err) {
      setError("Resend failed. Please try again.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    // Basic Length Check
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long");
    }

    // Complexity Check (Regex: 1 uppercase, 1 lowercase, 1 number, 1 special char)
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!complexityRegex.test(password)) {
      return setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }

    // Matching Check
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      await resetPassword({ email, password });
      setMessage("Password updated successfully");
      setStep(4);
    } catch (err) {
      setError("Reset failed. Please try again.");
    }
    setLoading(false);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const steps = [
    { num: 1, label: "Email" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Reset" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .fp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0f;
          font-family: 'DM Sans', sans-serif;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient orbs */
        .fp-root::before {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
          top: -150px;
          right: -100px;
          pointer-events: none;
        }
        .fp-root::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%);
          bottom: -100px;
          left: -80px;
          pointer-events: none;
        }

        .fp-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 1;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Top accent line */
        .fp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(236,72,153,0.7), transparent);
          border-radius: 1px;
        }

        .fp-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.15));
          border: 1px solid rgba(99,102,241,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .fp-icon-wrap svg {
          width: 24px;
          height: 24px;
        }

        .fp-title {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #f1f1f5;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
        }

        .fp-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.4);
          line-height: 1.5;
          margin-bottom: 32px;
        }
        .fp-subtitle span {
          color: rgba(99,102,241,0.9);
          font-weight: 500;
        }

        /* Step indicator */
        .fp-steps {
          display: flex;
          align-items: center;
          gap: 0;
          margin-bottom: 32px;
        }

        .fp-step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .fp-step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        .fp-step-dot.active {
          background: linear-gradient(135deg, #6366f1, #ec4899);
          color: #fff;
          box-shadow: 0 0 16px rgba(99,102,241,0.4);
        }
        .fp-step-dot.done {
          background: rgba(99,102,241,0.2);
          color: #6366f1;
          border: 1px solid rgba(99,102,241,0.4);
        }
        .fp-step-dot.pending {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .fp-step-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transition: color 0.3s;
        }
        .fp-step-label.active { color: rgba(255,255,255,0.8); }
        .fp-step-label.done { color: rgba(99,102,241,0.7); }
        .fp-step-label.pending { color: rgba(255,255,255,0.2); }

        .fp-step-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 0 8px;
          position: relative;
          overflow: hidden;
        }
        .fp-step-line.done::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #6366f1, #ec4899);
          animation: lineFill 0.4s ease forwards;
        }
        @keyframes lineFill {
          from { width: 0; }
          to { width: 100%; }
        }

        /* Label */
        .fp-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        /* Input */
        .fp-input-wrap {
          position: relative;
          margin-bottom: 20px;
        }

        .fp-input {
          width: 100%;
          padding: 14px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #f1f1f5;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }
        .fp-input::placeholder { color: rgba(255,255,255,0.2); }
        .fp-input:focus {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .fp-input.has-icon { padding-right: 48px; }

        .fp-input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
          background: none;
          border: none;
          padding: 0;
          display: flex;
        }
        .fp-input-icon:hover { color: rgba(255,255,255,0.7); }

        /* OTP Grid */
        .fp-otp-grid {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          justify-content: center;
        }

        .fp-otp-cell {
          width: 52px;
          height: 60px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          text-align: center;
          font-size: 22px;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          color: #f1f1f5;
          outline: none;
          transition: all 0.2s ease;
          caret-color: #6366f1;
        }
        .fp-otp-cell:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.07);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .fp-otp-cell:not(:placeholder-shown) {
          border-color: rgba(99,102,241,0.4);
          color: #818cf8;
        }

        /* Primary button */
        .fp-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.3px;
        }

        .fp-btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(99,102,241,0.3);
        }
        .fp-btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(99,102,241,0.4);
        }
        .fp-btn-primary:active:not(:disabled) { transform: translateY(0); }
        .fp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Shine sweep on hover */
        .fp-btn-primary::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        .fp-btn-primary:hover:not(:disabled)::after { left: 160%; }

        .fp-btn-ghost {
          background: transparent;
          color: rgba(99,102,241,0.8);
          font-size: 13px;
          padding: 10px;
          margin-top: 4px;
          font-weight: 500;
          letter-spacing: 0;
        }
        .fp-btn-ghost:hover:not(:disabled) {
          color: #818cf8;
          background: rgba(99,102,241,0.06);
        }
        .fp-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

        /* Messages */
        .fp-toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          margin-top: 20px;
          animation: fadeUp 0.3s ease;
        }
        .fp-toast.success {
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          color: #34d399;
        }
        .fp-toast.error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        /* Loading spinner */
        .fp-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Success screen */
        .fp-success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1));
          border: 1px solid rgba(16,185,129,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          animation: popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .fp-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 20px 0;
        }
      `}</style>

      <div className="fp-root">
        <div className="fp-card">
          {/* Icon */}
          <div className="fp-icon-wrap">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {step < 4 && (
            <>
              <h1 className="fp-title">Reset Password</h1>
              <p className="fp-subtitle">
                {step === 1 &&
                  "Enter your registered email to receive a verification code."}
                {step === 2 && (
                  <>
                    Code sent to <span>{email}</span>
                  </>
                )}
                {step === 3 && "Password must be at least 8 characters with uppercase, lowercase, numbers, and special symbols."}
              </p>

              {/* Step Progress */}
              <div className="fp-steps">
                {steps.map((s, i) => {
                  const state =
                    step > s.num
                      ? "done"
                      : step === s.num
                        ? "active"
                        : "pending";
                  return (
                    <React.Fragment key={s.num}>
                      <div className="fp-step-item">
                        <div className={`fp-step-dot ${state}`}>
                          {state === "done" ? (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            s.num
                          )}
                        </div>
                        <span className={`fp-step-label ${state}`}>
                          {s.label}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`fp-step-line ${step > s.num ? "done" : ""}`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </>
          )}

          {/* STEP 1 — Email */}
          {step === 1 && (
            <>
              <label className="fp-label">Email ID</label>
              <div className="fp-input-wrap">
                <input
                  type="text" // 🔥 change from email → text (better control)
                  placeholder="you@example.com"
                  className="fp-input"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (/\s/.test(value)) return;

                    setEmail(value);

                    if (!validateEmail(value)) {
                      setError("Enter a valid email address");
                    } else {
                      setError("");
                    }
                  }}
                  onBlur={() => {
                    // 🔥 Validate when user leaves field
                    if (email && !validateEmail(email)) {
                      setError("Invalid email format");
                    }
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>
              <button
                className="fp-btn fp-btn-primary"
                onClick={handleSendOtp}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="fp-spinner" />
                    Sending code...
                  </>
                ) : (
                  "Send verification code →"
                )}
              </button>
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  className="fp-btn fp-btn-ghost"
                  style={{
                    fontSize: "13px",
                    fontFamily: "Times New Roman, serif",
                  }}
                  onClick={() => (window.location.href = "/login")}
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <>
              <label className="fp-label">Verification code</label>
              <div className="fp-otp-grid">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="fp-otp-cell"
                    value={digit}
                    placeholder="·"
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              <button
                className="fp-btn fp-btn-primary"
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="fp-spinner" />
                    Verifying...
                  </>
                ) : (
                  "Verify code →"
                )}
              </button>
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                {!canResend ? (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.5)",
                      marginBottom: "10px",
                    }}
                  >
                    You can resend OTP in{" "}
                    <span style={{ color: "#818cf8" }}>{timer}s</span>
                  </p>
                ) : (
                  <button
                    className="fp-btn fp-btn-ghost"
                    onClick={handleResendOtp}
                    disabled={!canResend || loading}
                  >
                    Resend code
                  </button>
                )}
              </div>
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <button
                  className="fp-btn fp-btn-ghost"
                  style={{
                    fontSize: "13px",
                    fontFamily: "Times New Roman, serif",
                  }}
                  onClick={() => (window.location.href = "/login")}
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — New Password */}
          {step === 3 && (
            <>
              <label className="fp-label">New password</label>
              <div className="fp-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="fp-input has-icon"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />
                <button
                  className="fp-input-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <label className="fp-label">Confirm password</label>
              <div className="fp-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="fp-input"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
              </div>

              <button
                className="fp-btn fp-btn-primary"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div style={{ textAlign: "center", marginTop: "12px" }}>
                      <button
                        className="fp-btn fp-btn-ghost"
                        style={{
                          fontSize: "13px",
                          fontFamily: "Times New Roman, serif",
                        }}
                        onClick={() => (window.location.href = "/login")}
                      >
                        ← Back to login
                      </button>
                    </div>
                    <span className="fp-spinner" />
                    Updating password...
                  </>
                ) : (
                  "Update password →"
                )}
              </button>
            </>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <div className="fp-success-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1
                className="fp-title"
                style={{ textAlign: "center", marginBottom: 8 }}
              >
                All done!
              </h1>
              <p
                className="fp-subtitle"
                style={{ textAlign: "center", marginBottom: 28 }}
              >
                Your password has been updated successfully. You can now log in
                with your new credentials.
              </p>
              <div className="fp-divider" />
              <button
                className="fp-btn fp-btn-primary"
                onClick={() => window.history.back()}
              >
                Back to login →
              </button>
            </div>
          )}

          {/* Messages */}
          {message && step < 4 && (
            <div className="fp-toast success">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {message}
            </div>
          )}
          {error && (
            <div className="fp-toast error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

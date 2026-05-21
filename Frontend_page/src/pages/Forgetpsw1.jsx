import React, { useState } from "react";
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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await resetsendOtp({ email });
      setMessage(res.message || "OTP sent successfully");
      setStep(2);
    } catch (err) {
      setError("Failed to send OTP");
    }
    setLoading(false);
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await resetverifyOtp({ email, otp });

      if (res.status) {
        setMessage("OTP verified");
        setStep(3);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Invalid OTP");
    }
    setLoading(false);
  };

  // 🔹 RESEND OTP
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await resetresendOtp({ email });
      setMessage("OTP resent");
      setError("");
    } catch (err) {
      setError("Resend failed");
    }
    setLoading(false);
  };

  // 🔹 RESET PASSWORD
  const handleResetPassword = async () => {
    setLoading(true);
    setError("");
    try {
      await resetPassword({ email, password });

      setMessage("Password updated successfully ✅");
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
    } catch (err) {
      setError("Reset failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {/* 🔹 STEP 1 - EMAIL */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* 🔹 STEP 2 - OTP */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-400"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg mb-3"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={handleResendOtp}
              disabled={loading}
              className="text-sm text-indigo-600 underline"
            >
              Resend OTP
            </button>
          </>
        )}

        {/* 🔹 STEP 3 - RESET PASSWORD */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        {/* 🔹 MESSAGE */}
        {message && (
          <p className="text-green-600 text-center mt-4">{message}</p>
        )}

        {error && (
          <p className="text-red-600 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Services/api";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  Shield,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});

  const disableClipboard = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === "c" || key === "v" || key === "x") {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  const updatedForm = {
    ...formData,
    [name]: value,

  };
  

  setFormData(updatedForm);

  // Clear specific field error
  setFieldErrors((prevErrors) => ({
    ...prevErrors,
    [name]: "",
  }));
  

  // ✅ Remove all errors if everything is valid
  if (
    updatedForm.name &&
    updatedForm.email &&
    validateEmail(updatedForm.email) &&
    updatedForm.role &&
    updatedForm.password &&
    validatePassword(updatedForm.password) &&
    updatedForm.confirm_password &&
    updatedForm.password === updatedForm.confirm_password
  ) {
    setFieldErrors({});
    setError("");
  }

  // Password strength
  if (name === "password") {
    calculatePasswordStrength(value);
  }
};

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[!@#$%^&*]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password))
      strength += 25;
    setPasswordStrength(strength);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "from-red-500 to-red-600";
    if (passwordStrength < 50) return "from-orange-500 to-orange-600";
    if (passwordStrength < 75) return "from-yellow-500 to-yellow-600";
    return "from-emerald-500 to-emerald-600";
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const validateEmail = (email) => {
    // Regex for email validation: abc@, abc@gmail, abc@gmail.com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setFieldErrors({}); // Clear all field errors at the start of submission

    let errors = {};

    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email Id is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Email Id is invalid";
    }
    if (!formData.role) {
      errors.role = "Role is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      errors.password =
        "Password must be at least 8 characters and contain a special character (!@#$%^&*)";
    }
    if (!formData.confirm_password) {
      errors.confirm_password = "Confirm password is required";
    } else if (formData.password !== formData.confirm_password) {
      errors.confirm_password = "Password does not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      await registerUser(formData);

      setMessage("Account has been created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: "",
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setError(
        error?.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3">
                <div className="flex gap-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                  <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                  <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  BookMyEvent
                </span>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Join BookMyEvent
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto">
                  Create your account and start managing events
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="w-full max-w-2xl">
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              {/* Form card */}
              <div className="relative bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Decorative top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Success Message */}
                  {message && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-lg flex items-start gap-3 text-sm animate-pulse">
                      <CheckCircle2
                        size={18}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <span>{message}</span>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="group">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        />
                        <input
                          id="name"
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-700/30 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${
                            fieldErrors.name
                              ? "border-red-500/50"
                              : "border-slate-600/50 hover:border-slate-500/50"
                          }`}
                        />
                      </div>
                      {fieldErrors.name && (
                        <p className="text-red-400 text-xs mt-1 ml-1">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Input */}
                    <div className="group">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        />
                        <input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-slate-700/30 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${
                            fieldErrors.email
                              ? "border-red-500/50"
                              : "border-slate-600/50 hover:border-slate-500/50"
                          }`}
                        />
                      </div>
                      {fieldErrors.email && (
                        <p className="text-red-400 text-xs mt-1 ml-1">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Role Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          value: "organizer",
                          label: "Organizer",
                          icon: Shield,
                        },
                        {
                          value: "exhibitor",
                          label: "Exhibitor",
                          icon: Sparkles,
                        },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
  const updatedForm = {
    ...formData,
    role: value,
  };

  setFormData(updatedForm);

  // ✅ Clear role error instantly
  setFieldErrors((prev) => {
    const updated = { ...prev };
    delete updated.role;
    return updated;
  });
}}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group ${
                            formData.role === value
                              ? "border-purple-400/50 bg-purple-500/20 ring-2 ring-purple-400/30"
                              : fieldErrors.role
                                ? "border-red-500/50 bg-slate-700/10 hover:border-red-400/50"
                                : "border-slate-600/30 bg-slate-700/10 hover:border-slate-500/50"
                          }`}
                        >
                          <Icon
                            size={24}
                            className={`transition-colors ${
                              formData.role === value
                                ? "text-purple-400"
                                : fieldErrors.role
                                  ? "text-red-400"
                                  : "text-slate-400 group-hover:text-slate-300"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium transition-colors ${
                              formData.role === value
                                ? "text-purple-300"
                                : fieldErrors.role
                                  ? "text-red-300"
                                  : "text-slate-300 group-hover:text-slate-200"
                            }`}
                          >
                            {label}
                          </span>
                          {formData.role === value && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.role && (
                      <p className="text-red-400 text-xs mt-1 ml-1">
                        {fieldErrors.role}
                      </p>
                    )}
                  </div>

                  {/* Row 3: Password and Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Password Input */}
                    <div className="group">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        />
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          onPaste={disableClipboard}
                          onCopy={disableClipboard}
                          onCut={disableClipboard}
                          onKeyDown={handleKeyDown}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`w-full pl-10 pr-12 py-3 bg-slate-700/30 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${
                            fieldErrors.password
                              ? "border-red-500/50"
                              : "border-slate-600/50 hover:border-slate-500/50"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                              Password strength:
                            </span>
                            <span className="text-xs font-medium text-purple-400">
                              {getPasswordStrengthLabel()}
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-300`}
                              style={{ width: `${passwordStrength}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {fieldErrors.password && (
                        <p className="text-red-400 text-xs mt-1 ml-1">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password Input */}
                    <div className="group">
                      <label
                        htmlFor="confirm_password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors"
                        />
                        <input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirm_password"
                          placeholder="••••••••"
                          value={formData.confirm_password}
                          onChange={handleChange}
                          onPaste={disableClipboard}
                          onCopy={disableClipboard}
                          onCut={disableClipboard}
                          onKeyDown={handleKeyDown}
                          onContextMenu={(e) => e.preventDefault()}
                          className={`w-full pl-10 pr-12 py-3 bg-slate-700/30 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${
                            fieldErrors.confirm_password
                              ? "border-red-500/50"
                              : "border-slate-600/50 hover:border-slate-500/50"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>

                      {/* Password Match Indicator */}
                      {/* Confirm Password Error (Required) */}
{fieldErrors.confirm_password && (
  <p className="text-red-400 text-xs mt-1 ml-1">
    {fieldErrors.confirm_password}
  </p>
)}

{/* Live Password Mismatch Check */}
{formData.confirm_password &&
  formData.password !== formData.confirm_password && (
    <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
      <AlertCircle size={14} />
      Password does not match
    </div>
)}

{/* Password Match Success */}
{formData.confirm_password &&
  formData.password === formData.confirm_password && (
    <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs">
      <CheckCircle2 size={14} />
      Passwords match
    </div>
)}
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 disabled:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 group relative overflow-hidden mt-6"
                  >
                    <span className="relative z-10">
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </span>
                    {!isLoading && (
                      <ArrowRight
                        size={18}
                        className="relative z-10 group-hover:translate-x-1 transition-transform"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600/30"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800/40 text-slate-500">
                      Already registered?
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <Link
                  to="/login"
                  className="w-full py-3 px-4 border border-slate-600/50 hover:border-purple-400/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 text-center hover:bg-slate-700/20 flex items-center justify-center gap-2 group"
                >
                  Sign In Instead
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-500 text-xs mt-8">
              By creating an account, you agree to our{" "}
              <a
                href="#"
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile brand indicator */}
      <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          EventHub
        </span>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { loginUser } from "../Services/api";
import { useDispatch } from "react-redux";
import { setUser } from "../Redux/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe && savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // 🔥 Email validation
    if (name === "email") {
      if (!value) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Email is required",
        }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Enter a valid email (e.g. abc@gmail.com)",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    }

    // 🔥 Password validation
    if (name === "password") {
      if (!value) {
        setFieldErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      } else {
        setFieldErrors((prev) => ({
          ...prev,
          password: "",
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {
      email: "",
      password: "",
    };

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);

    // ❌ Stop if error exists
    if (errors.email || errors.password) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser(formData);

      const data = response.data;

      console.log("Login", data);

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("role", data.role);
      sessionStorage.setItem("id", data.User_id);
      sessionStorage.setItem("name", data.name);
      sessionStorage.setItem("profile_image", data.profile_image || "");

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberMe");
      }

      dispatch(
        setUser({
          id: data.User_id,
          name: data.name,
          role: data.role,
          email: data.email,
          profile_image: data.profile_image
        }),
      );

      if (data.role === "organizer") {
        navigate("/OrganizerHome", { state: { fromLogin: true } });
      } else if (data.role === "exhibitor") {
        navigate("/exhibitor/dashboard", { state: { fromLogin: true } });
      } else if (data.role === "superuser") {
        navigate("/superuser/dashboard", { state: { fromLogin: true } });
      }
    } catch (err) {
      if (err.response) {
        const message = err.response.data.message;

        // 🔥 EMAIL NOT REGISTERED
        if (message === "Email Id is not registered") {
          setFieldErrors((prev) => ({
            ...prev,
            email: "Email Id is not registered",
          }));
          setTimeout(() => {
            setFieldErrors((prev) => ({ ...prev, email: "" }));
          }, 2000);
        }

        // 🔥 WRONG PASSWORD
        else if (message === "Incorrect password") {
          setFieldErrors((prev) => ({
            ...prev,
            password: "Incorrect password",
          }));
          setTimeout(() => {
            setFieldErrors((prev) => ({ ...prev, password: "" }));
          }, 2000);
        } else {
          setError(message);
          setTimeout(() => {
            setError("");
          }, 3000);
        }
      } else {
        setError("Server error");
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient orbs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto">
          {/* Left section - Branding */}
          <div className="hidden lg:flex flex-1 flex-col justify-center items-start">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-5 h-5 bg-blue-500 rounded-sm -rotate-12"></div>
                  <div className="w-5 h-5 bg-orange-500 rounded-sm rotate-6"></div>
                  <div className="w-5 h-5 bg-green-500 rounded-sm -rotate-3"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  BookMyEvent
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                    Elevate Your{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      Event
                    </span>{" "}
                    Experience
                  </h1>
                  <p className="text-lg text-slate-400 leading-relaxed">
                    Connect organizers and exhibitors on a unified platform
                    designed for seamless event management.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Login form */}
          <div className="w-full max-w-md">
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

              {/* Form card */}
              <div className="relative bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                {/* Decorative top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-slate-400">Sign in to your account</p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2 text-sm animate-pulse">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      {error}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Email input */}
                    <div className="relative group">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Email Id <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full px-4 py-3 bg-slate-700/30 border ${fieldErrors.email
                          ? "border-red-500"
                          : "border-slate-600/50"
                          } rounded-xl text-white`}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {fieldErrors.email}
                        </p>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-hover:from-cyan-400/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-300"></div>
                    </div>

                    {/* Password input */}
                    <div className="relative group">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          className={`w-full px-4 py-3 pr-12 bg-slate-700/30 border ${fieldErrors.password
                            ? "border-red-500"
                            : "border-slate-600/50"
                            } rounded-xl text-white`}
                        />
      
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors z-10"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {fieldErrors.password && (
                        <p className="text-red-400 text-xs mt-1">
                          {fieldErrors.password}
                        </p>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 to-blue-500/0 group-hover:from-cyan-400/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-300"></div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 bg-slate-700 border border-slate-600 rounded cursor-pointer accent-cyan-400"
                        />
                        <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                          Remember me
                        </span>
                      </label>
                      <p
                        onClick={() => navigate("/reset-password")}
                        className="text-cyan-400 hover:text-cyan-300 cursor-pointer font-medium"
                      >
                        Forgot Password?
                      </p>
                    </div>

                    {/* Login button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      onSubmit={handleSubmit}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 group relative overflow-hidden"
                    >
                      <span className="relative z-10">
                        {isLoading ? "Signing in..." : "Sign In"}
                      </span>
                      {!isLoading && (
                        <ArrowRight
                          size={18}
                          className="relative z-10 group-hover:translate-x-1 transition-transform"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-800/40 text-slate-500">
                        New to BookMyEvent?
                      </span>
                    </div>
                  </div>

                  {/* Register link */}
                  <Link
                    to="/register"
                    className="w-full py-3 px-4 border border-slate-600/50 hover:border-cyan-400/50 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-300 text-center hover:bg-slate-700/20 flex items-center justify-center gap-2 group"
                  >
                    Create Account
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-500 text-xs mt-8">
              By signing in, you agree to our{" "}
              <a
                href="#"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile brand indicator */}
      <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          BookMYShow
        </span>
      </div>
    </div>
  );
}

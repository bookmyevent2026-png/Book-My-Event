import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Organizerdashboard = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState("events");
  const [events, setEvents] = useState([]);

  // Axios example
  useEffect(() => {
    axios
      .get("http://localhost:8000/events") // your backend API
      .then((res) => {
        setEvents(res.data);
      })
      .catch(() => {
        // fallback data if API not ready
        setEvents([
          { id: 1, code: "EVT-25", name: "MRC Event" },
          { id: 2, code: "EVT-22", name: "VALLUVAR KOTTAM PARK" },
          { id: 3, code: "EVT-9", name: "Furniture and Home Products Expo" },
          { id: 4, code: "EVT-12", name: "LOGMAT EXPO - 2025" },
          { id: 5, code: "EVT-11", name: "DISTRICT CONFERENCE 2025" },
          { id: 6, code: "EVT-10", name: "Global Startup Networking" },
          { id: 7, code: "EVT-6", name: "Interactive Art Installation" },
          { id: 8, code: "EVT-5", name: "MedTech for CSI" },
          { id: 9, code: "EVT-4", name: "Comic Con 2025" },
          { id: 10, code: "EVT-3", name: "Flower Show At Semmozhi Poonga" },
        ]);
      });
  }, []);

  // ---------------- EVENTS PAGE ----------------

  if (page === "events") {
    return (
      <div className="p-8 bg-gray-50 min-h-screen font-sans">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{t("Organizer Dashboard")}</h1>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-sky-600 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t("Action")}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t("Event code")}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">{t("Event name")}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setPage("dashboard")}
                          className="bg-blue-100 px-3 py-1 rounded hover:bg-blue-200"
                        >
                          <Eye size={18} />
                        </button>
                      </td>

                      <td className="px-6 py-4 font-medium text-sky-900">{event.code}</td>
                      <td className="px-6 py-4 text-slate-700">{event.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------

  if (page === "dashboard") {
    return (
      <div className="p-6">
        <button
          onClick={() => setPage("events")}
          className="mb-4 bg-gray-200 px-4 py-2 rounded"
        >
          ← {t("back")}
        </button>

        <h1 className="text-3xl font-bold mb-6">{t("Organizer Dashboard")}</h1>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-indigo-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold">{t("common.welcome")} Sakthi</h2>

            <p className="mt-3">
              {t("dashboard.upgrade_msg", { percent: 3 })}
              <br />
              {t("dashboard.upgrade_sub")}
            </p>

            <button
              onClick={() => setPage("plans")}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
            >
              {t("Upgrade")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.total_visitors")}</p>
              <h2 className="text-2xl">0</h2>
            </div>

            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.total_earnings")}</p>
              <h2 className="text-2xl">₹450</h2>
            </div>

            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.total_earnings")}</p>
              <h2 className="text-2xl">$0</h2>
            </div>

            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.passes_sales")}</p>
              <h2 className="text-2xl">10</h2>
            </div>

            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.contacts")}</p>
              <h2 className="text-2xl">0</h2>
            </div>

            <div className="bg-white shadow px-6 py-4 rounded">
              <p>{t("common.sponsors")}</p>
              <h2 className="text-2xl">0</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- PLANS PAGE ----------------

  if (page === "plans") {
    return (
      <div className="p-10">
        <button
          onClick={() => setPage("dashboard")}
          className="mb-6 bg-gray-200 px-4 py-2 rounded"
        >
          ← {t("common.back")}
        </button>

        <h1 className="text-3xl mb-8">{t("dashboard.select_plan")}</h1>

        <div className="grid grid-cols-3 gap-8">
          {["BASIC", "PRO", "ENTERPRISE"].map((plan, i) => {
            const price = [99.99, 199.99, 999.99];

            return (
              <div key={i} className="shadow p-6 rounded text-center">
                <h2 className="text-xl text-blue-600">{plan}</h2>

                <p className="text-4xl mt-3">₹{price[i]}</p>

                <ul className="mt-4">
                  <li>Events Limit</li>
                  <li>Ticket Limit</li>
                  <li>Support</li>
                </ul>

                <button
                  onClick={() => setPage("payment")}
                  className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
                >
                  Choose Plan
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------------- PAYMENT PAGE ----------------

  if (page === "payment") {
    return (
      <div className="p-10 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <button
            onClick={() => setPage("plans")}
            className="mb-6 bg-gray-200 px-4 py-2 rounded"
          >
            ← Back
          </button>

          <h2 className="text-2xl mb-4">Billing Information</h2>

          <input className="border p-2 w-full mb-3" placeholder="Sakthi G" />

          <input
            className="border p-2 w-full mb-3"
            placeholder="sakthivelganesan@leitenindia.com"
          />

          <textarea className="border p-2 w-full" placeholder="Enter Address" />
        </div>

        <div className="border p-6 rounded">
          <h2 className="text-xl mb-4">Order Summary</h2>

          <p>Basic ₹99.99</p>
          <p>Tax 0%</p>
          <p>Tax Total ₹0</p>

          <input
            className="border p-2 mt-4 w-full"
            placeholder="Enter Coupon Code"
          />

          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">
            APPLY
          </button>

          <p className="mt-6 font-bold">Total ₹99.99</p>

          <button className="mt-6 bg-blue-700 text-white w-full py-2 rounded">
            Proceed to Payment →
          </button>
        </div>
      </div>
    );
  }
};
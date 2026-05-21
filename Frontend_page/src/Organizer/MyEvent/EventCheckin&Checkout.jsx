import React, { useState, useEffect } from "react";
import {
  getEventscheckin,
} from "../../Services/api";
import { Eye } from "lucide-react";

export default function EventCheckIn() {
  const [page, setPage] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [events, setEvents] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Approved Events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEventscheckin(); // from api.js
      console.log("Events", res)
      setEvents(res);
    } catch (err) {
      console.error("Failed to fetch events");
    }
  };
  const fetchCheckinCheckoutData = async (eventId) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("event_id", eventId);
      const data = await getEventCheckinCheckout(formData);
      setEntries(data);
    } catch (err) {
      console.error("Error fetching check-in data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await checkIn(id);
      alert("Checked in successfully!");
      if (selectedEvent) fetchCheckinCheckoutData(selectedEvent.id);
    } catch (err) {
      console.error("Check-in error:", err);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOut(id);
      alert("Checked out successfully!");
      if (selectedEvent) fetchCheckinCheckoutData(selectedEvent.id);
    } catch (err) {
      console.error("Check-out error:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">

      {/* ✅ Page 1: Events */}
      {page === "events" && (
        <div>
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Event Check-In / Check-Out
          </h1>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-sky-600 text-white">
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Arrived</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Departed</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Present</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {events.length > 0 ? events.map((e, i) => (
                    <tr key={i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-xl"
                          title="View Entries"
                        >
                          <Eye size={20} className="hover:text-blue-500 cursor-pointer" />
                        </button>
                      </td>
                      <td className="px-6 py-4 font-medium text-sky-900">{e.event_code}</td>
                      <td className="px-6 py-4 text-slate-700">{e.event_name}</td>
                      <td className="px-6 py-4 text-slate-600">{e.arrived}</td>
                      <td className="px-6 py-4 text-slate-600">{e.departed}</td>
                      <td className="px-6 py-4 font-bold text-green-600">{e.present}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-500">No approved events found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Page 2: Entries List */}
      {page === "entries" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Check-In / Check-Out - {selectedEvent?.name}
            </h1>
            <button
              onClick={() => setPage("events")}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to Events
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading data...</div>
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-sky-600 text-white">
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">View</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Code</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Check-In Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Check-Out Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {entries.length > 0 ? entries.map((v, i) => (
                      <tr key={i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedEntry(v);
                              setPage("details");
                            }}
                            className="text-blue-600 hover:text-blue-800 text-xl"
                          >
                            👁️
                          </button>
                        </td>
                        <td className="px-6 py-4 font-medium text-sky-900">{v.visitor_code}</td>
                        <td className="px-6 py-4 text-slate-700">{v.name}</td>
                        <td className="px-6 py-4 text-slate-600">{v.checkin_time || "---"}</td>
                        <td className="px-6 py-4 text-slate-600">{v.checkout_time || "---"}</td>
                        <td className="px-6 py-4">
                          {!v.checkin_time ? (
                            <button
                              onClick={() => handleCheckIn(v.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Check In
                            </button>
                          ) : !v.checkout_time ? (
                            <button
                              onClick={() => handleCheckOut(v.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Check Out
                            </button>
                          ) : (
                            <span className="text-gray-500 italic text-sm">Completed</span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="text-center py-10 text-slate-500">No entries found for this event.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ Page 3: Entry Details */}
      {page === "details" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Entry Details</h1>
            <button
              onClick={() => setPage("entries")}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to List
            </button>
          </div>

          <div className="border p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-gray-600"><strong>Code:</strong></p>
              <p>{selectedEntry?.visitor_code}</p>

              <p className="text-gray-600"><strong>Name:</strong></p>
              <p>{selectedEntry?.name}</p>

              <p className="text-gray-600"><strong>Email:</strong></p>
              <p>{selectedEntry?.email}</p>

              <p className="text-gray-600"><strong>Phone:</strong></p>
              <p>{selectedEntry?.phone}</p>

              <p className="text-gray-600"><strong>Check-In Time:</strong></p>
              <p className="text-green-600 font-medium">{selectedEntry?.checkin_time || "Not Checked In"}</p>

              <p className="text-gray-600"><strong>Check-Out Time:</strong></p>
              <p className="text-red-600 font-medium">{selectedEntry?.checkout_time || "Not Checked Out"}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
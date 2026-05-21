import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Search } from "lucide-react";
import { getevent } from "../../Services/api";

export const LiveDashboard = () => {

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const getEvents = async () => {
    try {
      const res = await getevent();

      setEvents(res.data || []);
    }
    catch (err) {
      console.log("API Error:", err);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  const filtered = events.filter((e) =>
    (e.event_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Live Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search Keyword..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-sky-600 text-white">
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">

                {filtered.map((event, i) => (
                  <tr key={i} className="hover:bg-sky-50/50 transition-colors duration-200 group">

                    <td className="px-6 py-4">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">
                        <Eye size={18} />
                      </button>
                    </td>

                    <td className="px-6 py-4 font-medium text-sky-900">{event.event_code}</td>
                    <td className="px-6 py-4 text-slate-700">{event.event_name}</td>

                  </tr>
                ))}

              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from "react";
import { Search } from "lucide-react";

export default function FoodCheckIn() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Food Check-In / Check-Out</h1>

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

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-sky-600 text-white">
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Code ↑↓</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Name ↑↓</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event Start Date ↑↓</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Event End Date ↑↓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr className="hover:bg-sky-50/50 transition-colors duration-200 group">
                <td
                  colSpan="5"
                  className="text-center text-slate-500 py-6"
                >
                  No Data Found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>Showing 0 to 0 of 0 entries</span>
          <div className="flex items-center space-x-2">
            <button className="px-2 py-1 border rounded">«</button>
            <button className="px-2 py-1 border rounded bg-blue-100">1</button>
            <button className="px-2 py-1 border rounded">»</button>
            <select className="border rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
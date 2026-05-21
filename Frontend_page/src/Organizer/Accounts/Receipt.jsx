import React, { useState, useEffect } from "react";
import { Eye, ChevronLeft, ChevronRight, Search, X, Calendar } from "lucide-react";

export const Receipt = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]); // Placeholder for actual data
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Pagination Logic
  const filteredData = data.filter(item =>
    (item.invoiceNo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.billingName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Receipt Management
      </h1>

      {/* FILTER SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* FROM DATE */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              From Date <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type="date"
                id="fromDate"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700 text-sm font-semibold"
              />
              <Calendar className="absolute right-3 top-3 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" size={18} />
            </div>
          </div>

          {/* TO DATE */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              To Date <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
            </label>
            <div className="relative group">
              <input
                type="date"
                id="toDate"
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700 text-sm font-semibold"
              />
              <Calendar className="absolute right-3 top-3 text-slate-400 group-hover:text-blue-500 transition-colors pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Transaction Type <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
            </label>
            <select className="w-full p-3 mt-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm font-semibold">
              <option>Select Type</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Plan / Event Name <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
            </label>
            <select className="w-full p-3 mt-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm font-semibold">
              <option>Plan / Event Name</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Payment Status <span className="text-red-500 font-bold lowercase tracking-normal ml-1">*</span>
            </label>
            <select className="w-full p-3 mt-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm font-semibold">
              <option>All Status</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              <Search size={18} />
              Search Receipts
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-80">
            <input
              placeholder="Search Keyword"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Amount</label>
              <div className="relative">
                <input 
                  className="pl-8 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-700 text-sm outline-none" 
                  value="0.00"
                  readOnly
                />
                <span className="absolute left-3 top-2 text-slate-400 font-bold text-sm">₹</span>
              </div>
            </div>
            <button 
              className="mt-5 p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
              title="Clear Filters"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1600px]">
              <thead>
                <tr className="bg-sky-600 text-white">
                  <th className="px-6 py-4 text-center text-sm font-bold text-white tracking-wider">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Invoice No</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Invoice Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Invoice Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Billing Person Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Billing Person Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Visitor Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Vehicle No</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Plan / Event Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Total Amount</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-white tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Created By</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider">Created On</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="13" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <Eye className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-400 font-bold italic text-sm">No receipts found matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-sky-50/30 transition-all group">
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          <Eye size={16} />
                        </button>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-600">{item.invoiceNo}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">{item.date}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.type}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.personType}</td>
                      <td className="px-6 py-4 text-slate-800 text-sm font-black">{item.billingName}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.visitorName}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-bold">{item.vehicleNo}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{item.eventName}</td>
                      <td className="px-6 py-4 text-blue-600 text-sm font-black">₹{item.amount}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs font-bold">{item.createdBy}</td>
                      <td className="px-6 py-4 text-slate-500 text-[10px] font-bold uppercase">{item.createdOn}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-sm font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Records per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="p-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-sky-600 text-white shadow-lg shadow-sky-200" : "bg-white text-slate-600 border border-slate-200 hover:bg-sky-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
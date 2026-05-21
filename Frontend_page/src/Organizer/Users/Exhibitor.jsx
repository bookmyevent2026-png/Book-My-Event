import { useState, useEffect, useCallback, useRef } from "react";
import { getExhibitorBookings } from "../../Services/api";
import { Search, Download, ListFilter, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

/* ─── Status badge mapping ─────────────────────────────────────────────────── */
const BADGE_STYLES = {
  Active: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Inactive: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Cancelled: "bg-red-50 text-red-600 ring-1 ring-red-200",
  Approved: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Rejected: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};

const Badge = ({ value }) => {
  const displayValue = value && value !== "" ? value.charAt(0).toUpperCase() + value.slice(1) : "-";
  const cls = BADGE_STYLES[displayValue] ?? "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {displayValue}
    </span>
  );
};


/* ─── Column definitions ─────────────────────────────────────────────────── */
const COLUMNS = [
  { key: "company_name", label: "Company Name" },
  { key: "name", label: "Exhibitor Name" },
  { key: "mobile", label: "Contact No" },
  { key: "email", label: "Email" },
  { key: "stall_area", label: "Stall Area" },
  { key: "products", label: "Products" },
  { key: "address", label: "Address" },
  { key: "status", label: "Status", badge: true },
];

const POLL_MS = 10000; // Refresh every 10 seconds

export default function ExhibitorTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const timerRef = useRef(null);

  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const response = await getExhibitorBookings();
      const dataArray = Array.isArray(response.data) ? response.data : [];
      setRows(dataArray);
      setError("");
    } catch (e) {
      setError("Failed to sync bookings. Please check your connection.");
      console.error(e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(() => fetchData(true), POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);


  /* ── Filter → Sort → Paginate ───────────────────────────────────────────── */
  const q = search.toLowerCase();
  const currentRows = Array.isArray(rows) ? rows : [];
  let filtered = currentRows.filter(r =>
    COLUMNS.some(c => String(r[c.key] ?? "").toLowerCase().includes(q))
  );


  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const sliced = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const fromEntry = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const toEntry = Math.min(safePage * pageSize, total);



  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Exhibitor Stall Bookings
            {isRefreshing && <RefreshCw size={18} className="animate-spin text-blue-500" />}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage and monitor live exhibitor registration data</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {/* Search & Stats Card */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, company, or products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          <div className="flex items-center gap-6 px-4">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bookings</div>
              <div className="text-lg font-black text-slate-800">{total}</div>
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page</div>
              <div className="text-lg font-black text-slate-800">{safePage} <span className="text-slate-300 font-medium">/</span> {totalPages}</div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-red-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full">
              <thead>
                <tr className="bg-sky-600 text-white">
                  {COLUMNS.map(col => (
                    <th key={col.key} className="px-6 py-4 text-left text-sm font-bold text-white tracking-wider whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                        <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : sliced.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-300">
                        <ListFilter size={48} className="opacity-20" />
                        <p className="font-bold text-lg">No Results Found</p>
                        <p className="text-xs font-medium text-slate-400">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sliced.map((row, i) => (
                    <tr key={row.id ?? i} className="hover:bg-sky-50/50 transition-colors duration-200 group">
                      {COLUMNS.map((col, cIdx) => (
                        <td key={col.key} className={`px-6 py-4 text-slate-600 whitespace-nowrap ${cIdx > 0 ? "border-l border-slate-50" : ""}`}>
                          {col.badge ? (
                            <Badge value={row[col.key]} />
                          ) : (
                            <span className={col.key === 'company_name' ? "font-bold text-slate-800" : ""}>
                              {row[col.key] && row[col.key] !== "" ? row[col.key] : "-"}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-4 gap-4 px-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-sm font-medium">
                Showing {fromEntry} to {toEntry} of {total} entries
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Records per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
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
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${safePage === i + 1 ? "bg-sky-600 text-white shadow-lg shadow-sky-200" : "bg-white text-slate-600 border border-slate-200 hover:bg-sky-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-sky-50 disabled:opacity-40 transition-all shadow-sm"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
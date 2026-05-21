import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';

export const ManageStall = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const tableHeaders = [
        { label: 'Action', sortable: false },
        { label: 'Event Code', sortable: true },
        { label: 'Event Name', sortable: true },
        { label: 'No. of Stalls', sortable: false },
        { label: 'Allocated', sortable: false },
        { label: 'Requested', sortable: false },
        { label: 'Payment Pending', sortable: false },
    ];

    return (
        <div className="min-h-screen bg-[#f0f2f5] p-6 font-['Inter',sans-serif] text-slate-700">
            <div className="max-w-full mx-auto">
                <h1 className="text-[24px] font-bold text-[#344767] mb-6 tracking-tight">Manage Stall</h1>

                <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                    {/* Search Header */}
                    <div className="p-5">
                        <div className="relative max-w-[210px]">
                            <input
                                type="text"
                                placeholder="Search Keyword"
                                className="w-full px-3 py-[7px] border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-all text-[14px] placeholder:text-slate-300"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mx-5 mb-5">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-sky-600 text-white">
                                    {tableHeaders.map((header, index) => (
                                        <th
                                            key={index}
                                            className={`${header.sortable ? 'cursor-pointer hover:bg-sky-700 transition-colors' : ''} px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap`}
                                        >
                                            <div className="flex items-center gap-1">
                                                {header.label}
                                                {header.sortable && <ArrowUpDown className="w-3 h-3 opacity-40" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr className="hover:bg-sky-50/50 transition-colors duration-200 group bg-white">
                                    <td colSpan={tableHeaders.length} className="px-6 py-8 text-sm text-slate-500 text-center">
                                        No Data Found.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-6 flex flex-col md:flex-row items-center justify-center relative min-h-[80px]">
                        <div className="md:absolute md:left-5 text-[14px] text-slate-400">
                            Showing 0 to 0 of 0 entries
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-[#f8f9fa] rounded-lg p-0.5 border border-slate-100">
                                <button className="p-1.5 px-2.5 text-slate-300 hover:text-slate-500 disabled:cursor-not-allowed transition-colors" disabled>
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 px-2.5 text-slate-300 hover:text-slate-500 disabled:cursor-not-allowed transition-colors" disabled>
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 px-2.5 text-slate-300 hover:text-slate-500 disabled:cursor-not-allowed transition-colors" disabled>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 px-2.5 text-slate-300 hover:text-slate-500 disabled:cursor-not-allowed transition-colors" disabled>
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-[14px] focus:outline-none focus:ring-1 focus:ring-blue-400 text-slate-500 appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237b809a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_8px_center] bg-no-repeat"
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
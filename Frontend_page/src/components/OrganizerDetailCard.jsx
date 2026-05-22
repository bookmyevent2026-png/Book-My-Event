import React from "react";
import { ExternalLink } from "lucide-react";

const OrganizerDetailCard = ({ organizerData }) => {
  // Use organizerData from backend
  const companyName = organizerData?.name || "None";
  const address = organizerData?.address || "None";
  const email = organizerData?.email || "None";
  const phone = organizerData?.phone || "None";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-50/50 px-6 py-3 border-b border-slate-100">
        <h4 className="text-xs font-black text-blue-600 tracking-widest uppercase">ORGANIZER DETAILS</h4>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-start gap-4">
          <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Company Name</p>
          <p className="text-[10px] text-slate-500 font-medium">: {companyName}</p>
        </div>
        <div className="flex items-start gap-4">
          <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Address</p>
          <div className="flex gap-1 min-w-0">
            <span className="text-[10px] text-slate-500">:</span>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              {address}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Mail ID</p>
          <p className="text-[10px] text-blue-600 font-medium">: {email}</p>
        </div>
        <div className="flex items-start gap-4">
          <p className="text-[10px] font-bold text-slate-900 w-20 flex-shrink-0">Phone</p>
          <p className="text-[10px] text-slate-500 font-medium">: {phone}</p>
        </div>
       
      </div>
    </div>
  );
};

export default OrganizerDetailCard;

import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

const TimeDropdownPicker = ({ value, onChange, hasError, isCustomStyle, dropdownPosition }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const parseTime = (timeStr) => {
    if (!timeStr) return null;
    const match = timeStr.match(/^(\d{2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      return {
        hour: match[1],
        minute: match[2],
        period: match[3].toUpperCase(),
      };
    }
    return null;
  };

  const getInitialTime = () => {
    const now = new Date();
    let hrs = now.getHours();
    const mins = now.getMinutes();
    const prd = hrs >= 12 ? "PM" : "AM";
    hrs = hrs % 12;
    hrs = hrs ? hrs : 12;
    return {
      hour: hrs.toString().padStart(2, "0"),
      minute: mins.toString().padStart(2, "0"),
      period: prd,
    };
  };

  const current = parseTime(value) || getInitialTime();
  const { hour, minute, period } = current;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && !value) {
      onChange(`${hour}:${minute} ${period}`);
    }
  };

  const updateTime = (newHour, newMinute, newPeriod) => {
    onChange(`${newHour}:${newMinute} ${newPeriod}`);
  };

  const incHour = () => {
    let num = parseInt(hour, 10);
    num = num >= 12 ? 1 : num + 1;
    updateTime(num.toString().padStart(2, "0"), minute, period);
  };

  const decHour = () => {
    let num = parseInt(hour, 10);
    num = num <= 1 ? 12 : num - 1;
    updateTime(num.toString().padStart(2, "0"), minute, period);
  };

  const incMinute = () => {
    let num = parseInt(minute, 10);
    num = num >= 59 ? 0 : num + 1;
    updateTime(hour, num.toString().padStart(2, "0"), period);
  };

  const decMinute = () => {
    let num = parseInt(minute, 10);
    num = num <= 0 ? 59 : num - 1;
    updateTime(hour, num.toString().padStart(2, "0"), period);
  };

  const togglePeriod = () => {
    const nextPeriod = period === "AM" ? "PM" : "AM";
    updateTime(hour, minute, nextPeriod);
  };

  return (
    <div className="relative w-full" ref={ref}>
      
      {/* INPUT BOX */}
      {isCustomStyle ? (
        <div
          onClick={handleOpenToggle}
          className={`w-full bg-white border rounded-xl shadow-sm flex items-center justify-between cursor-pointer overflow-hidden h-14 transition-all ${
            hasError ? "border-red-500" : "border-gray-200"
          }`}
        >
          <span className={`px-4 text-sm font-medium ${value ? 'text-gray-700' : 'text-gray-400'}`}>
            {value || "HH:MM"}
          </span>
          <div className="h-full w-14 bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
            <Clock size={20} />
          </div>
        </div>
      ) : (
        <div
          onClick={handleOpenToggle}
          className={`w-full bg-gray-50 ring-1 p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-sm transition-all hover:ring-indigo-300 ${
            hasError ? "ring-red-500 hover:ring-red-500" : "ring-gray-200"
          }`}
        >
          <span className={value ? "text-gray-700 font-medium" : "text-gray-400"}>
            {value || "HH:MM"}
          </span>
          <Clock className="w-4 h-4 text-gray-400" />
        </div>
      )}

      {/* DROPDOWN PICKER */}
      {open && (
        <div 
          className={`absolute z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-2 w-[140px] left-1/2 -translate-x-1/2 flex items-center justify-center ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "mt-1"
          }`}
        >
          <div className="flex items-center gap-2 text-slate-500">
            
            {/* HOUR */}
            <div className="flex flex-col items-center gap-0.5">
              <button onClick={incHour} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{hour}</span>
              <button onClick={decHour} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

            <span className="text-blue-800 font-medium mb-1 text-sm">:</span>

            {/* MINUTE */}
            <div className="flex flex-col items-center gap-0.5">
              <button onClick={incMinute} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{minute}</span>
              <button onClick={decMinute} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* PERIOD */}
            <div className="flex flex-col items-center gap-0.5 ml-1">
              <button onClick={togglePeriod} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{period}</span>
              <button onClick={togglePeriod} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default TimeDropdownPicker;
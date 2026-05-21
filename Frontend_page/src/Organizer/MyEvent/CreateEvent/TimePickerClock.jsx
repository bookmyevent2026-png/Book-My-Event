import React, { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

const TimeDropdownPicker = ({ value, onChange }) => {
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
    if (value) {
      const parsed = parseTime(value);
      if (parsed) return parsed;
    }
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

  const initial = getInitialTime();
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

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

  // Sync internal state when value prop changes from parent
  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      if (parsed) {
        setHour(parsed.hour);
        setMinute(parsed.minute);
        setPeriod(parsed.period);
      }
    }
  }, [value]);

  // Update parent only when values change and it doesn't match the current value
  useEffect(() => {
    if (value) {
      const formatted = `${hour}:${minute} ${period}`;
      if (formatted !== value) {
        onChange(formatted);
      }
    }
  }, [hour, minute, period, value, onChange]);

  const handleOpenToggle = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && !value) {
      onChange(`${hour}:${minute} ${period}`);
    }
  };

  const inc = (val, setter, max, min = 1) => {
    let num = parseInt(val);
    num = num >= max ? min : num + 1;
    setter(num.toString().padStart(2, "0"));
  };

  const dec = (val, setter, max, min = 1) => {
    let num = parseInt(val);
    num = num <= min ? max : num - 1;
    setter(num.toString().padStart(2, "0"));
  };

  return (
    <div className="relative w-full" ref={ref}>
      
      {/* INPUT BOX */}
      <div
        onClick={handleOpenToggle}
        className="w-full bg-gray-50 ring-1 ring-gray-200 p-2.5 rounded-xl cursor-pointer flex items-center justify-between text-sm transition-all hover:ring-indigo-300"
      >
        <span className={value ? "text-gray-700 font-medium" : "text-gray-400"}>
          {value || "HH:MM"}
        </span>
        <Clock className="w-4 h-4 text-gray-400" />
      </div>

      {/* DROPDOWN PICKER */}
      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl py-2 w-[140px] left-1/2 -translate-x-1/2 flex items-center justify-center">

          <div className="flex items-center gap-2 text-slate-500">
            
            {/* HOUR */}
            <div className="flex flex-col items-center gap-0.5">
              <button onClick={() => inc(hour, setHour, 12)} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{hour}</span>
              <button onClick={() => dec(hour, setHour, 12)} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

            <span className="text-blue-800 font-medium mb-1 text-sm">:</span>

            {/* MINUTE */}
            <div className="flex flex-col items-center gap-0.5">
              <button onClick={() => inc(minute, setMinute, 59, 0)} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{minute}</span>
              <button onClick={() => dec(minute, setMinute, 59, 0)} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* PERIOD */}
            <div className="flex flex-col items-center gap-0.5 ml-1">
              <button onClick={() => setPeriod(period === "AM" ? "PM" : "AM")} className="hover:text-blue-600 transition-colors p-0.5">
                <ChevronUp size={18} strokeWidth={2.5} />
              </button>
              <span className="text-sm font-medium text-blue-800 w-5 text-center">{period}</span>
              <button onClick={() => setPeriod(period === "AM" ? "PM" : "AM")} className="hover:text-blue-600 transition-colors p-0.5">
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
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { completeEvent, updateEvent } from "../../../Services/api";

import Step1EventDetails from "./steps/Step1EventDetails";
import Step2Booking from "./steps/Step2Booking";
import Step3LayoutStall from "./steps/step3layout";
import StepFoodProvision from "./steps/StepFoodDetails";
import StepVehicleProvision from "./steps/StepVehiclePassDetails";
import Step4Documents from "./steps/Step4Documents";
import Step5Terms from "./steps/Step5Terms";
import Step6VendorSponsor from "./steps/Step6VendorSponsor";

const convert24to12 = (time24h) => {
  if (!time24h) return "";
  const timeStr = String(time24h).trim();
  if (timeStr.match(/(AM|PM|am|pm)/i)) return timeStr;
  
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  
  let h = parseInt(parts[0], 10);
  let m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return timeStr;
  
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  
  return `${hh}:${mm} ${period}`;
};

const convert12to24 = (time12h) => {
  if (!time12h) return "";
  const timeStr = String(time12h).trim();
  if (!timeStr.match(/(AM|PM|am|pm)/i)) return timeStr;
  
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return timeStr;
  
  let h = parseInt(match[1], 10);
  let m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  
  return `${hh}:${mm}:00`;
};

const getBool = (val) => {
  return val === 1 || val === true || val === "true" || val === "1" || val === "True";
};

const CreateEvent = ({ onBack, editData, isView }) => {
  const [step, setStep] = useState(1);
  const [step1Touched, setStep1Touched] = useState(false);
  const [step2Touched, setStep2Touched] = useState(false);
  const [step3Touched, setStep3Touched] = useState(false);
  const [step4Touched, setStep4Touched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Redexorganizer = useSelector((state) => state.user);

  const storedUser = {
    id: sessionStorage.getItem("userId"),
    name: sessionStorage.getItem("userName"),
  };
  const organizer = Redexorganizer?.id ? Redexorganizer : storedUser;
  const [popup, setPopup] = useState({
    show: false,
    message: "",
  });
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ show: false, message: "" });
      }, 1000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [popup.show]);

  const [formData, setFormData] = useState({
    eventDetails: editData?.details
      ? {
        category: editData.details.category,
        eventName: editData.details.event_name,
        description: editData.details.description,
        amenities: editData.details.amenities || "",
        tags: editData.details.tags || "",
        includeProgram: (editData.details.include_program === "True" || editData.details.include_program === "Yes") ? "Yes" : "No",
        visibility: editData.details.visibility || "Public",
        mail: getBool(editData.details.mail),
        whatsapp: getBool(editData.details.whatsapp),
        print: getBool(editData.details.print),
        visitorMail: getBool(editData.details.visitor_mail),
        visitorName: getBool(editData.details.visitor_name),
        visitorPhoto: getBool(editData.details.visitor_photo),
        visitorMobile: getBool(editData.details.visitor_mobile),
        documentProof: getBool(editData.details.document_proof),
        dayPass: getBool(editData.details.day_pass),
        isInternationalInclude: getBool(editData.details.is_international_include),
        aadhar: getBool(editData.details.aadhar),
        passport: getBool(editData.details.passport),
        welcomeKit: getBool(editData.details.welcome_kit),
        food: getBool(editData.details.food),
        vehiclePass: getBool(editData.details.vehicle_pass),
        vehicleNumber: getBool(editData.details.vehicle_number),
        eventType: editData.details.event_type || "OneTime",
        occurrence: editData.details.occurrence || "",
        startDate: editData.details.start_date,
        startTime: convert24to12(editData.details.start_time),
        endDate: editData.details.end_date,
        endTime: convert24to12(editData.details.end_time),
        venue: editData.details.venue,
        address: editData.details.address,
      }
      : {},
    foodProvision: {
      items: editData?.food_items?.map(fi => ({
        catererName: fi.caterer_name,
        mealType: fi.meal_type,
        foodType: fi.food_type,
        priceINR: fi.price_inr,
        priceUSD: fi.price_usd,
        menuDetails: fi.menu_details
      })) || []
    },
    vehicleProvision: {
      details: (editData?.vehicle_details && editData.vehicle_details.length > 0)
        ? editData.vehicle_details.map(vd => ({
          vehicleType: vd.vehicle_type,
          priceINR: vd.price_inr || "0",
          priceUSD: vd.price_usd || "0"
        }))
        : [
          { vehicleType: "Two Wheeler", priceINR: "0", priceUSD: "0" },
          { vehicleType: "Four Wheeler", priceINR: "0", priceUSD: "0" },
          { vehicleType: "Heavy Vehicle", priceINR: "0", priceUSD: "0" }
        ],
      addons: editData?.vehicle_addons?.map(va => ({
        isParent: va.is_parent === 1 || va.is_parent === true,
        addOnName: va.addon_name,
        price: va.price
      })) || []
    },
    booking: editData?.booking
      ? {
        bookingStartDate: editData.booking.booking_start_date,
        bookingEndDate: editData.booking.booking_end_date,
        _lastEventStart: editData.details?.start_date,
        _lastEventEnd: editData.details?.end_date,
        capacity: editData.booking.capacity,
        passType: editData.booking.pass_type,
        entryType: editData.booking.entry_type,
        chargeType: editData.booking.charge_type,
        maxPass: editData.booking.max_pass,
        razorpayKey: editData.booking.razorpay_key,
        includeTax: editData.booking.include_tax === 1 || editData.booking.include_tax === true,
        priceType: editData.booking.price_type,
        currency: editData.booking.currency,
        earlyBirdExpire: editData.booking.early_bird_expire,
        earlyBirdExpireDate: editData.booking.early_bird_expire
          ? editData.booking.early_bird_expire.split("T")[0].split("-").reverse().join("/")
          : "",
        earlyBirdExpireTime: editData.booking.early_bird_expire
          ? (() => {
            const timePart = editData.booking.early_bird_expire.split("T")[1];
            if (!timePart) return "";
            return convert24to12(timePart);
          })()
          : ""
      }
      : {},
    layout: editData?.layout
      ? {
        floorType: editData.layout.master?.floor_type,
        dayBased: editData.layout.master?.day_based === 1 || editData.layout.master?.day_based === true,
        personPass: editData.layout.master?.person_pass,
        includeTax: editData.layout.master?.include_tax === 1 || editData.layout.master?.include_tax === true,
        taxes: editData.layout.master?.taxes ? JSON.parse(editData.layout.master.taxes) : [],
        stalls: editData.layout.stalls?.map(st => ({
          stallName: st.stall_name,
          size: st.stall_size,
          sizeRange: st.size_range,
          visibility: st.visibility,
          type: st.stall_type,
          priceINR: st.price_inr,
          priceUSD: st.price_usd,
          primeSeat: st.prime_seat === 1 || st.prime_seat === true,
          primePriceINR: st.prime_price_inr,
          primePriceUSD: st.prime_price_usd
        })) || [],
        amenities: editData.layout.amenities?.map(am => ({
          stallName: am.stall_name,
          amenity: am.amenity,
          qty: am.qty
        })) || []
      }
      : { stalls: [], amenities: [] },
    documents: editData
      ? {
        banner: null,
        bannerPreview: editData.files?.find(f => f.file_type === "banner")?.url || null,
        docs: editData.files?.filter(f => f.file_type !== "banner").map(f => ({
          id: f.id,
          type: f.doc_type,
          number: f.doc_number,
          file: null,
          preview: f.url,
          name: f.file_name,
          isExisting: true
        })) || [],
        existingFiles: editData.files || []
      }
      : {
        banner: null,
        bannerPreview: null,
        docs: [],
        existingFiles: []
      },
    terms: editData?.terms?.map(t => ({
      policyGroup: t.policy_group || t.policyGroup,
      policyType: t.policy_type || t.policyType,
      policyName: t.policy_name || t.policyName,
      description: t.description || t.policy_description || t.policy_desc || "",
      isDefault: t.is_default || t.isDefault || false
    })) || [],
    vendors: editData?.vendor_data
      ? {
        vendors: editData.vendor_data.vendors?.map(v => ({
          vendorType: v.vendor_type,
          vendorName: v.vendor_name,
          passCount: v.pass_count
        })),
        sponsors: editData.vendor_data.sponsors?.map(s => ({
          sponsorName: s.sponsor_name,
          sponsorship: s.sponsorship_type
        })),
        guests: editData.vendor_data.guests?.map(g => ({
          name: g.guest_name,
          designation: g.designation,
          contact: g.contact,
          image: g.image
        }))
      }
      : { vendors: [], sponsors: [], guests: [] },
  });

  // const validateStep = (checkAll = false) => {
  //   const event = formData.eventDetails || {};
  //   const booking = formData.booking || {};
  //   const layout = formData.layout || {};
  //   const documents = formData.documents || {};

  //   const showError = (msg, stepNum) => {
  //     setPopup({ show: true, message: msg });
  //     if (checkAll && stepNum) setStep(stepNum);
  //     return false;
  //   };
  // if (checkAll || step === 1) {
  //   if (!event.eventName) return showError("Event Name is required", 1);
  //   if (!event.category) return showError("Event Category is required", 1);
  //   if (!event.description)
  //     return showError("Event Description is required", 1);
  //   if (!event.includeProgram)
  //     return showError("Include Program selection is required", 1);
  //   if (!event.visibility)
  //     return showError("Visibility selection is required", 1);
  //   if (!event.startDate) return showError("Start Date is required", 1);
  //   if (!event.startTime) return showError("Start Time is required", 1);
  //   if (!event.endDate) return showError("End Date is required", 1);
  //   if (!event.endTime) return showError("End Time is required", 1);
  //   if (!event.venue) return showError("Venue is required", 1);
  //   if (!event.address) return showError("Address is required", 1);
  // }

  // Step 2: Booking
  // if (checkAll || step === 2) {
  //   if (!booking.bookingStartDate)
  //     return showError("Booking Start Date is required", 2);
  //   if (!booking.bookingEndDate)
  //     return showError("Booking End Date is required", 2);
  //   if (!booking.capacity) return showError("Event Capacity is required", 2);
  //   if (!booking.passType) return showError("Pass Type is required", 2);
  //   if (!booking.entryType) return showError("Entry Type is required", 2);
  //   if (!booking.chargeType) return showError("Charge Type is required", 2);
  // }

  // Step 3 & beyond validation can be skipped or simplified for updates if needed,
  // but for now we keep it same.
  // if (!editData) {
  //   // Step 3: Layout & Stall
  //   if (checkAll || step === 3) {
  //     if (!layout.stalls || layout.stalls.length === 0) {
  //       return showError("At least one stall must be added", 3);
  //     }
  //   }

  // Step 4: Documents
  // if (checkAll || step === 4) {
  //   if (!documents.banner) return showError("Event Banner (Image/Video) is required", 4);
  // }

  // Step 5: Terms
  // if (checkAll || step === 5) {
  //   if (!formData.terms || formData.terms.length === 0)
  //     return showError("Terms must be added", 5);
  // }

  // Step 6: Vendor/Sponsor
  // if (checkAll || step === 6) {
  //   const {
  //     vendors = [],
  //     sponsors = [],
  //   } = formData.vendors || {};
  //   if (
  //     vendors.length === 0 &&
  //     sponsors.length === 0
  //   ) {
  //     return showError(
  //       "At least one Vendor, Sponsor or Guest is required",
  //       6,
  //     );
  //   }
  // }
  //   }

  //   return true;
  // };

  useEffect(() => {
    if (organizer?.name) {
      setFormData((prev) => ({
        ...prev,
        eventDetails: {
          ...prev.eventDetails,
          created_by: organizer.name,
        },
      }));
    }
  }, [organizer?.name]);


  const getFormValidationErrors = () => {
    const event = formData.eventDetails || {};
    const booking = formData.booking || {};
    const documents = formData.documents || {};
    const errors = [];

    if (!event.eventName) errors.push("Event Name");
    if (!event.category) errors.push("Event Category");
    if (!event.description) errors.push("Event Description");
    if (!event.startDate) errors.push("Event Start Date");
    if (!event.startTime) errors.push("Event Start Time");
    if (!event.endDate) errors.push("Event End Date");
    if (!event.endTime) errors.push("Event End Time");
    if (!event.venue) errors.push("Event Venue");
    if (!event.address) errors.push("Event Address");
    if (!booking.bookingStartDate) errors.push("Booking Start Date");
    if (!booking.bookingEndDate) errors.push("Booking End Date");
    if (!booking.capacity) errors.push("Event Capacity");
    if (!booking.passType) errors.push("Pass Type");
    if (!booking.entryType) errors.push("Entry Permissions");
    if (!booking.chargeType) errors.push("Pass Charge Type");
    if (!booking.maxPass) errors.push("Max Passes/Person");
    if (booking.chargeType === "Paid" && !booking.earlyBirdExpire) {
      errors.push("Early Bird Expiry");
    }
    if (!documents.banner && !documents.bannerPreview) {
      errors.push("Event Banner");
    }

    return errors;
  };

  const isFormValid = () => {
    return getFormValidationErrors().length === 0;
  };

  const validateStep1 = (details) => {
    if (!details) return false;
    return !!(
      details.category &&
      details.eventName &&
      details.eventName.trim() &&
      details.eventName.length <= 50 &&
      details.description &&
      details.description.trim() &&
      details.startDate &&
      details.startTime &&
      details.endDate &&
      details.endTime &&
      details.venue &&
      details.address &&
      details.address.trim()
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // if (!validateStep(true)) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();

      // Convert times from 12-hour AM/PM to 24-hour format
      const eventDetailsToSend = {
        ...formData.eventDetails,
        startTime: convert12to24(formData.eventDetails?.startTime),
        endTime: convert12to24(formData.eventDetails?.endTime),
        created_by: organizer.name,
        user_id: organizer.id,
      };

      // JSON fields
      fd.append("eventDetails", JSON.stringify(eventDetailsToSend));
      fd.append("booking", JSON.stringify(formData.booking));
      fd.append("layout", JSON.stringify(formData.layout));
      fd.append("terms", JSON.stringify(formData.terms));
      fd.append("vendors", JSON.stringify(formData.vendors));
      fd.append("foodProvision", JSON.stringify(formData.foodProvision || { items: [] }));
      fd.append("vehicleProvision", JSON.stringify(formData.vehicleProvision || { details: [], addons: [] }));

      // Files
      if (formData.documents.banner) {
        fd.append("banner", formData.documents.banner);
      } else if (!formData.documents.bannerPreview) {
        fd.append("delete_banner", "true");
      }

      const newDocs = formData.documents.docs.filter(doc => !doc.isExisting);
      newDocs.forEach((doc, index) => {
        fd.append(`docs_${index}`, doc.file);
        fd.append(`doc_type_${index}`, doc.type);
        fd.append(`doc_number_${index}`, doc.number);
      });
      fd.append("doc_count", newDocs.length);

      const existingDocIds = formData.documents.docs
        .filter(doc => doc.isExisting)
        .map(doc => doc.id);
      fd.append("existing_doc_ids", JSON.stringify(existingDocIds));

      // Call Update or Create
      let res;
      if (editData) {
        res = await updateEvent(editData.details.id, fd);
      } else {
        res = await completeEvent(fd);
      }
      console.log("Response:", res);

      setPopup({
        show: true,
        message: editData ? "Event Updated Successfully ✅" : "Event Created Successfully ✅",
        type: "success",
      });

      // 🚀 Redirect after 2 sec
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      console.error(err);
      setPopup({
        show: true,
        message: err.response?.data?.error || "Something went wrong ❌",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  const allSteps = [
    { label: "Event Details", Component: Step1EventDetails },
    { label: "Booking", Component: Step2Booking },
    ...(formData.eventDetails?.food ? [{ label: "Food Provision", Component: StepFoodProvision }] : []),
    ...(formData.eventDetails?.vehiclePass ? [{ label: "Vehicle Provision", Component: StepVehicleProvision }] : []),
    { label: "Layout & Stall", Component: Step3LayoutStall },
    { label: "Documents", Component: Step4Documents },
    { label: "Terms & Conditions", Component: Step5Terms },
    { label: "Vendor, Sponsor & Guest", Component: Step6VendorSponsor },
  ];

  const CurrentStepComponent = allSteps[step - 1].Component;

  return (
    <div className="flex flex-col min-h-screen bg-white rounded shadow">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 pt-2 pb-0">
        <h1 className="text-xl font-bold mb-2">
          {isView ? "View Event Page" : editData ? "Edit Event Page" : "Create Event"}
        </h1>

        <div className="flex flex-wrap gap-4 md:gap-6 pb-0 mb-0 text-sm">
          {allSteps.map((s, idx) => (
            <span
              key={idx}
              className={`transition-all duration-300 pb-2 ${step === idx + 1 ? "font-bold text-indigo-600 border-b-2 border-indigo-600" : "text-gray-400"
                }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="pt-3 pb-20 px-2">
        <fieldset disabled={isView} className={isView ? "opacity-90" : ""}>
          <CurrentStepComponent
            formData={formData}
            setFormData={(val) => {
              if (isView) return;
              setFormData(val);
            }}
            organizerId={organizer?.id}
            showStep1Errors={step1Touched}
            showStep2Errors={step2Touched}
            showStep3Errors={step3Touched}
            showStep4Errors={step4Touched}
          />
        </fieldset>
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-12 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-8 py-4 flex justify-between items-center">
        <button
          onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
          className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded-xl hover:bg-gray-50 font-semibold transition-all"
        >
          ← Back
        </button>

        {step < allSteps.length ? (
          <button
            onClick={() => {
              const currentStepLabel = allSteps[step - 1].label;
              if (currentStepLabel === "Event Details") {
                setStep1Touched(true);
              }
              if (currentStepLabel === "Booking") {
                setStep2Touched(true);
              }
              if (currentStepLabel === "Layout & Stall") {
                setStep3Touched(true);
              }
              if (currentStepLabel === "Documents") {
                setStep4Touched(true);
              }
              setStep(step + 1);
            }}
            className="bg-sky-700 text-white px-8 py-2.5 rounded-xl hover:bg-sky-800 transition-all shadow-md font-semibold"
          >
            Next →
          </button>
        ) : (
          !isView && (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid()}
                className={`px-8 py-2.5 rounded-xl text-white font-semibold transition-all shadow-md
      ${isSubmitting || !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {!isFormValid() && (
                <span className="text-[11px] text-red-500 font-bold max-w-xs text-right mt-1">
                  Required: {getFormValidationErrors().join(", ")}
                </span>
              )}
            </div>
          )
        )}
      </div>

      {popup.show && (
        <div className="fixed top-16 right-6 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-slideIn
      ${popup.type === "success" ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            <span className="font-semibold">{popup.message}</span>

            <button
              onClick={() => setPopup({ show: false, message: "", type: "" })}
              className="text-white font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEvent;
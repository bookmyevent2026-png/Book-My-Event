import React, { useState, useEffect } from "react";

import {
  saveEventDetails,
  saveBooking,
  saveLayout,
  saveDocuments,
  saveTerms,
  saveVendors,
  finalSubmit,
} from "../../../Services/api";

import Step1EventDetails from "./steps/Step1EventDetails";
import Step2Booking from "./steps/Step2Booking";
import Step3LayoutStall from "./steps/step3layout";
import Step4Documents from "./steps/Step4Documents";
import Step5Terms from "./steps/Step5Terms";
import Step6VendorSponsor from "./steps/Step6VendorSponsor";

const CreateEvent = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [popup, setPopup] = useState({
    show: false,
    message: "",
  });
  useEffect(() => {
    if (popup.show) {
      const timer = setTimeout(() => {
        setPopup({ show: false, message: "" });
      }, 2000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [popup.show]);
  const validateStep = (checkAll = false) => {
    const event = formData.eventDetails || {};
    const booking = formData.booking || {};
    const layout = formData.layout || {};
    const documents = formData.documents || {};

    const showError = (msg, stepNum) => {
      setPopup({ show: true, message: msg });
      if (checkAll && stepNum) setStep(stepNum);
      return false;
    };

    // Step 1: Event Details
    if (checkAll || step === 1) {
      if (!event.eventName) return showError("Event Name is required", 1);
      if (!event.category) return showError("Event Category is required", 1);
      if (!event.description)
        return showError("Event Description is required", 1);
      if (!event.includeProgram)
        return showError("Include Program selection is required", 1);
      if (!event.visibility)
        return showError("Visibility selection is required", 1);
      if (!event.startDate) return showError("Start Date is required", 1);
      if (!event.startTime) return showError("Start Time is required", 1);
      if (!event.endDate) return showError("End Date is required", 1);
      if (!event.endTime) return showError("End Time is required", 1);
      if (!event.venue) return showError("Venue is required", 1);
      if (!event.address) return showError("Address is required", 1);
    }

    // Step 2: Booking
    if (checkAll || step === 2) {
      if (!booking.bookingStartDate)
        return showError("Booking Start Date is required", 2);
      if (!booking.bookingEndDate)
        return showError("Booking End Date is required", 2);
      if (!booking.capacity) return showError("Event Capacity is required", 2);
      if (!booking.passType) return showError("Pass Type is required", 2);
      if (!booking.entryType) return showError("Entry Type is required", 2);
      if (!booking.chargeType) return showError("Charge Type is required", 2);
    }

    // Step 3: Layout & Stall
    if (checkAll || step === 3) {
      if (!layout.stalls || layout.stalls.length === 0) {
        return showError("At least one stall must be added", 3);
      }
    }

    // Step 4: Documents
    if (checkAll || step === 4) {
      if (!documents.banner) return showError("Event Banner is required", 4);
      if (!documents.docs || documents.docs.length === 0)
        return showError("At least one document is required", 4);
    }

    // Step 5: Terms
    if (checkAll || step === 5) {
      if (!formData.terms || formData.terms.length === 0)
        return showError("Terms must be added", 5);
    }

    // Step 6: Vendor/Sponsor
    if (checkAll || step === 6) {
      const {
        vendors = [],
        sponsors = [],
        guests = [],
      } = formData.vendors || {};
      if (
        vendors.length === 0 &&
        sponsors.length === 0 &&
        guests.length === 0
      ) {
        return showError(
          "At least one Vendor, Sponsor or Guest is required",
          6,
        );
      }
    }

    return true;
  };

  const [formData, setFormData] = useState({
    eventDetails: {},
    booking: {},
    layout: { stalls: [] },
    documents: {
      banner: null,
      docs: [],
    },
    terms: [],
    vendors: { vendors: [], sponsors: [], guests: [] },
  });

  const handleSubmit = async () => {
    if (!validateStep(true)) return; // Check all steps before submission

    try {
      // STEP 1
      const res = await saveEventDetails(formData.eventDetails);
      const event_id = res.event_id;
      console.log("Event ID:", event_id);

      // STEP 2–6
      await saveBooking({ ...formData.booking, event_id });
      await saveLayout({ ...formData.layout, event_id });

      // 🔥 FILE UPLOAD
      const fd = new FormData();

      fd.append("event_id", event_id);

      // Banner
      if (formData.documents.banner) {
        fd.append("banner", formData.documents.banner);
      }

      // Documents
      formData.documents.docs.forEach((doc, index) => {
        fd.append(`docs_${index}`, doc.file);
        fd.append(`doc_type_${index}`, doc.type);
        fd.append(`doc_number_${index}`, doc.number);
      });

      fd.append("doc_count", formData.documents.docs.length);
      console.log("FormData entries:", fd.entries());
      await saveDocuments(fd); // 🔥 send FormData

      await saveTerms({ terms: formData.terms, event_id });
      await saveVendors({ ...formData.vendors, event_id });

      // FINAL
      await finalSubmit({ event_id });

      alert("Event Created Successfully");
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  return (
    <div className="p-2 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>

      <div className="flex gap-6 border-b pb-2 mb-6 text-sm">
        <span className={step === 1 ? "font-bold text-indigo-600" : ""}>
          Event Details
        </span>
        <span className={step === 2 ? "font-bold text-indigo-600" : ""}>
          Booking
        </span>
        <span className={step === 3 ? "font-bold text-indigo-600" : ""}>
          Layout & Stall
        </span>
        <span className={step === 4 ? "font-bold text-indigo-600" : ""}>
          Documents
        </span>
        <span className={step === 5 ? "font-bold text-indigo-600" : ""}>
          Terms
        </span>
        <span className={step === 6 ? "font-bold text-indigo-600" : ""}>
          Vendor
        </span>
      </div>

      {step === 1 && (
        <Step1EventDetails formData={formData} setFormData={setFormData} />
      )}

      {step === 2 && (
        <Step2Booking formData={formData} setFormData={setFormData} />
      )}

      {step === 3 && (
        <Step3LayoutStall formData={formData} setFormData={setFormData} />
      )}

      {step === 4 && (
        <Step4Documents formData={formData} setFormData={setFormData} />
      )}

      {step === 5 && (
        <Step5Terms formData={formData} setFormData={setFormData} />
      )}

      {step === 6 && (
        <Step6VendorSponsor formData={formData} setFormData={setFormData} />
      )}

      <div className="flex justify-between mt-10">
        <button
          onClick={() => (step === 1 ? onBack() : setStep(step - 1))}
          className="border px-4 py-2 rounded"
        >
          Back
        </button>

        {step < 6 ? (
          <button
            onClick={() => {
              if (!validateStep()) return;
              setStep(step + 1);
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        )}
      </div>
      {popup.show && (
        <div className="fixed top-16 right-6 z-50">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-slideIn">
            <span className="font-semibold">{popup.message}</span>

            <button
              onClick={() => setPopup({ show: false, message: "" })}
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

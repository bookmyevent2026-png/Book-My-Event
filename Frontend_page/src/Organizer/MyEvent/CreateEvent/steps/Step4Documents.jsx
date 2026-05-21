import React, { useState, useEffect } from "react";
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  Trash2,
  Check,
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";

const Step4Documents = ({ formData, setFormData }) => {
  const [bannerType, setBannerType] = useState("image");
  const [docType, setDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docPreview, setDocPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveBanner, setDragActiveBanner] = useState(false);

  const [bannerError, setBannerError] = useState("");
  const [docError, setDocError] = useState("");
  const [previewModal, setPreviewModal] = useState({
    open: false,
    file: null,
    url: "",
  });

  useEffect(() => {
    if (formData.documents?.banner) {
      if (formData.documents.banner.type.startsWith("video/")) {
        setBannerType("video");
      } else {
        setBannerType("image");
      }
    } else {
      const preview = formData.documents?.bannerPreview;
      if (preview) {
        const isVideo = [".mp4", ".mov", ".avi", ".webm", ".mkv"].some(ext => preview.toLowerCase().endsWith(ext));
        setBannerType(isVideo ? "video" : "image");
      }
    }
  }, [formData.documents?.banner, formData.documents?.bannerPreview]);

  // =========================
  // 🔥 BANNER UPLOAD
  // =========================
  const validateVideo = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          resolve({ valid: false, message: "Video must be 1 minute or less ⏳" });
        } else {
          resolve({ valid: true });
        }
      };
      video.onerror = () => resolve({ valid: false, message: "Invalid video file ❌" });
      video.src = URL.createObjectURL(file);
    });
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerError("");

    if (bannerType === "video") {
      if (!file.type.startsWith("video/")) {
        setBannerError("Invalid file type. Please upload a video.");
        return;
      }
      const check = await validateVideo(file);
      if (!check.valid) {
        setBannerError(check.message);
        return;
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setBannerError("Invalid file type. Supported Files: JPG, PNG, JPEG, WEBP");
        return;
      }
    }

    const previewURL = URL.createObjectURL(file);

    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        banner: file,
        bannerPreview: previewURL,
      },
    });
  };

  const handleBannerDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveBanner(true);
    } else if (e.type === "dragleave") {
      setDragActiveBanner(false);
    }
  };

  const handleBannerDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveBanner(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setBannerError("");

    if (bannerType === "video") {
      if (!file.type.startsWith("video/")) {
        setBannerError("Invalid file type. Please upload a video.");
        return;
      }
      const check = await validateVideo(file);
      if (!check.valid) {
        setBannerError(check.message);
        return;
      }
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setBannerError("Invalid file type. Supported Files: JPG, PNG, JPEG, WEBP");
        return;
      }
    }

    const previewURL = URL.createObjectURL(file);
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        banner: file,
        bannerPreview: previewURL,
      },
    });
  };

  // =========================
  // 🔥 DOCUMENT UPLOAD
  // =========================
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setDocError("Invalid file type. Supported Files: JPEG, PNG, WEBP, PDF");
      return;
    }

    const previewURL = URL.createObjectURL(file);

    setDocPreview({
      file,
      preview: previewURL,
    });
  };

  const handleDocDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDocDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    setDocError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      setDocError("Invalid file type. Supported Files: JPEG, PNG, WEBP, PDF");
      return;
    }

    const previewURL = URL.createObjectURL(file);
    setDocPreview({
      file,
      preview: previewURL,
    });
  };

  // =========================
  // 🔥 ADD DOCUMENT
  // =========================
  const addDocument = () => {
    if (!docPreview || !docType || !docNumber) {
      alert("Please fill all fields");
      return;
    }

    const newDoc = {
      type: docType,
      number: docNumber,
      file: docPreview.file,
      preview: docPreview.preview,
    };

    const updatedDocs = [...(formData.documents.docs || []), newDoc];

    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        docs: updatedDocs,
      },
    });

    setDocType("");
    setDocNumber("");
    setDocPreview(null);
  };

  const openPreview = (file, url) => {
    setPreviewModal({
      open: true,
      file,
      url,
    });
  };

  const closePreview = () => {
    setPreviewModal({
      open: false,
      file: null,
      url: "",
    });
  };

  // =========================
  // 🔥 DELETE DOCUMENT
  // =========================
  const removeDoc = (index) => {
    const updatedDocs = formData.documents.docs.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        docs: updatedDocs,
      },
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-none mb-1">
            Documents & Media
          </h1>
          <p className="text-xs text-gray-500">
            Upload your banner and important documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ========================= */}
          {/* 🔥 BANNER SECTION */}
          {/* ========================= */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-1"></div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    {bannerType === "image" ? (
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Video className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Banner</h2>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-4 mb-4 p-2 bg-gray-50/50 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-2 cursor-pointer group/label">
                    <input
                      type="radio"
                      checked={bannerType === "image"}
                      onChange={() => setBannerType("image")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-gray-600">
                      Image
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group/label">
                    <input
                      type="radio"
                      checked={bannerType === "video"}
                      onChange={() => setBannerType("video")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-xs font-semibold text-gray-600">
                      Video <span className="text-[10px] text-gray-400 font-normal">(1 min max)</span>
                    </span>
                  </label>
                </div>

                {/* Upload Area */}
                <label
                  className={`relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer min-h-[160px] ${dragActiveBanner
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  onDragEnter={handleBannerDrag}
                  onDragLeave={handleBannerDrag}
                  onDragOver={handleBannerDrag}
                  onDrop={handleBannerDrop}
                >
                  {!formData.documents.bannerPreview ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <div className="p-3 bg-blue-100 rounded-full group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-gray-900">
                          Drop your {bannerType} here
                        </span>
                        <span className="text-xs text-gray-400">
                          or click to browse
                        </span>
                        {bannerType === "image" && (
                          <span className="block text-[10px] text-gray-400 mt-1">
                            Supported Files: JPG, PNG, JPEG, WEBP
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 w-full h-full p-2">
                      {/* IMAGE */}
                      {bannerType === "image" && (
                        <div className="relative group/banner">
                          <img
                            src={formData.documents.bannerPreview}
                            className="max-h-32 rounded-xl object-cover shadow-lg ring-4 ring-white"
                            alt="Banner preview"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openPreview(formData.documents.banner, formData.documents.bannerPreview);
                            }}
                            className="absolute -top-2 -right-2 z-10 bg-indigo-600 text-white p-1.5 rounded-full shadow hover:bg-indigo-700 opacity-0 group-hover/banner:opacity-100 transition-opacity"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      )}

                      {/* VIDEO */}
                      {bannerType === "video" && (
                        <div className="relative group/banner">
                          <video
                            src={formData.documents.bannerPreview}
                            controls
                            className="max-h-32 rounded-xl shadow-lg ring-4 ring-white"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openPreview(formData.documents.banner, formData.documents.bannerPreview);
                            }}
                            className="absolute -top-2 -right-2 z-10 bg-indigo-600 text-white p-1.5 rounded-full shadow hover:bg-indigo-700 opacity-0 group-hover/banner:opacity-100 transition-opacity"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            documents: {
                              ...formData.documents,
                              banner: null,
                              bannerPreview: null,
                            },
                          });
                        }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={12} /> Clear {bannerType}
                      </button>
                      {bannerType === "image" && (
                        <span className="text-[10px] text-gray-400 mt-2">
                          Supported Files: JPG, PNG, JPEG, WEBP
                        </span>
                      )}
                    </div>
                  )}

                  <input
                    type="file"
                    className="hidden"
                    accept={bannerType === "image" ? "image/jpeg,image/png,image/jpg,image/webp" : "video/*"}
                    onChange={handleBannerUpload}
                  />
                </label>

                {bannerError && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700">
                      {bannerError}
                    </span>
                  </div>
                )}

                {formData.documents.bannerPreview && !bannerError && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-green-50/50 border border-green-100 rounded-xl">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">
                      Banner ready for upload
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================= */}
          {/* 🔥 DOCUMENTS SECTION */}
          {/* ========================= */}
          <div className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1"></div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 bg-indigo-100 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Documents <span className="text-xs font-normal text-gray-400 font-sans italic">(Optional)</span>
                  </h2>
                </div>

                {/* Form Inputs - Side by Side */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Identity Proof
                    </label>

                    <select
                      value={docType}
                      onChange={(e) => {
                        setDocType(e.target.value);
                        setDocNumber(""); // reset when switching type
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-xs font-bold text-gray-700 cursor-pointer appearance-none"
                    >
                      <option value="">Select</option>
                      <option value="Aadhar">Aadhar</option>
                      <option value="PAN">PAN</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Number
                    </label>

                    <input
                      type="text"
                      placeholder={
                        docType === "PAN"
                          ? "ABCDE1234F"
                          : "XXXX-XXXX-XXXX"
                      }
                      maxLength={docType === "PAN" ? 10 : 12}
                      value={docNumber}
                      onChange={(e) => {
                        let value = e.target.value;

                        if (docType === "Aadhar") {
                          value = value.replace(/\D/g, "").slice(0, 12); // only 12 digits
                        }

                        if (docType === "PAN") {
                          value = value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "")
                            .slice(0, 10); // PAN 10 chars
                        }

                        setDocNumber(value);
                      }}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all text-xs font-bold placeholder:text-gray-300"
                    />
                  </div>
                </div>

                {/* Upload & Add Area */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4">
                  <label
                    className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[100px] ${dragActive
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    onDragEnter={handleDocDrag}
                    onDragLeave={handleDocDrag}
                    onDragOver={handleDocDrag}
                    onDrop={handleDocDrop}
                  >
                    {!docPreview ? (
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Upload className="w-5 h-5 text-indigo-400" />
                        <span className="text-[10px] font-bold text-gray-500">
                          Drop file here
                        </span>
                        <span className="text-[9px] text-gray-400">
                          Supported Files: JPEG, PNG, WEBP, PDF
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 w-full">
                        <div className="shrink-0 relative group/staging">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              openPreview(docPreview.file, docPreview.preview);
                            }}
                            className="absolute -top-2 -right-2 z-10 bg-indigo-600 text-white p-1 rounded-full shadow hover:bg-indigo-700 opacity-0 group-hover/staging:opacity-100 transition-opacity"
                          >
                            <Eye size={10} />
                          </button>
                          {docPreview.file.type.startsWith("image/") ? (
                            <img
                              src={docPreview.preview}
                              className="w-12 h-12 rounded-lg object-cover shadow-sm"
                              alt="preview"
                            />
                          ) : docPreview.file.type === "application/pdf" ? (
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
                              <FileText className="w-6 h-6 text-red-500" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-gray-700 truncate">
                            {docPreview.file.name}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setDocPreview(null);
                            }}
                            className="text-[9px] font-bold text-indigo-600 hover:underline"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleDocUpload}
                    />
                  </label>

                  <button
                    onClick={addDocument}
                    disabled={!docPreview || !docType || !docNumber}
                    className="h-full bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 shadow-lg shadow-blue-100 group"
                  >
                    <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Plus className="w-4 h-4" />
                    </div>

                    <span className="text-[10px] tracking-wider">
                      Add
                    </span>
                  </button>
                </div>
                <div className="mt-2 px-1">
                  <span className="text-[10px] text-gray-400 italic">
                    Supported Files: JPEG, PNG, WEBP, PDF
                  </span>
                </div>

                {docError && (
                  <div className="flex items-center gap-2 mt-2 p-2 bg-red-50 border border-red-100 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-700">
                      {docError}
                    </span>
                  </div>
                )}

                {/* Documents List - Internal Scroll */}
                <div className="mt-6 flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                      Documents ({(formData.documents.docs || []).length})
                    </p>
                    {formData.documents.docs?.length > 0 && (
                      <span className="text-[9px] font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
                        Scroll to see more
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent max-h-[140px]">
                    {(formData.documents.docs || []).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center gap-2 border border-dashed border-gray-100 rounded-2xl py-8 opacity-40">
                        <AlertCircle className="w-6 h-6 text-gray-300" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">
                          No items added
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 pb-2">
                        {(formData.documents.docs || []).map((doc, index) => (
                          <div
                            key={index}
                            className="group/item p-3 bg-gray-50/50 border border-gray-100 rounded-2xl hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-300 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="shrink-0 relative">
                                <button
                                  type="button"
                                  onClick={() => openPreview(doc.file, doc.preview)}
                                  className="absolute -top-2 -right-2 z-10 bg-indigo-600 text-white p-1 rounded-full shadow hover:bg-indigo-700"
                                >
                                  <Eye size={10} />
                                </button>
                                {(() => {
                                  const isPdf = doc.file 
                                    ? doc.file.type === "application/pdf" 
                                    : (doc.preview || "").toLowerCase().endsWith(".pdf") || (doc.name || "").toLowerCase().endsWith(".pdf");
                                  
                                  if (isPdf) {
                                    return (
                                      <div className="flex items-center justify-center h-10 w-10 bg-red-50 rounded-xl border border-red-100">
                                        <FileText className="w-5 h-5 text-red-500" />
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <img
                                        src={doc.preview}
                                        className="h-10 w-10 rounded-xl object-cover shadow-sm ring-2 ring-white"
                                        alt={doc.type}
                                      />
                                    );
                                  }
                                })()}

                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-xs leading-none mb-1">
                                  {doc.type}
                                </p>
                                <p className="text-[10px] font-medium text-gray-400 truncate tracking-tight">
                                  {doc.number}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => removeDoc(index)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover/item:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewModal.open && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] relative overflow-hidden shadow-2xl">

            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <X size={18} />
            </button>

            {(() => {
              const urlLower = (previewModal.url || "").toLowerCase();
              const isPdf = previewModal.file 
                ? previewModal.file.type === "application/pdf"
                : urlLower.endsWith(".pdf");
              const isVideo = previewModal.file
                ? previewModal.file.type?.startsWith("video/")
                : [".mp4", ".mov", ".avi", ".webm", ".mkv"].some(ext => urlLower.endsWith(ext));
              const isImage = previewModal.file
                ? previewModal.file.type?.startsWith("image/")
                : !isPdf && !isVideo;

              if (isImage) {
                return (
                  <img
                    src={previewModal.url}
                    alt="Preview"
                    className="w-full h-full object-contain bg-black"
                  />
                );
              } else if (isPdf) {
                return (
                  <iframe
                    src={previewModal.url}
                    title="PDF Preview"
                    className="w-full h-full"
                  />
                );
              } else if (isVideo) {
                return (
                  <video
                    src={previewModal.url}
                    controls
                    autoPlay
                    className="w-full h-full bg-black"
                  />
                );
              } else {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Preview not available
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Documents;
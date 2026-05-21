import React from 'react';

const Help = () => {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-4xl font-bold text-teal-900 mb-8 border-b pb-4">Book My Event Help & Documentation</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 bg-teal-50 rounded-xl border border-teal-100 text-center">
                        <div className="text-3xl mb-2">🚀</div>
                        <h3 className="font-bold text-teal-800">Getting Started</h3>
                        <p className="text-xs text-teal-600 mt-2">New to the platform? Start here for a quick tour.</p>
                    </div>
                    <div className="p-6 bg-blue-50 rounded-xl border border-blue-100 text-center">
                        <div className="text-3xl mb-2">📖</div>
                        <h3 className="font-bold text-blue-800">User Manual</h3>
                        <p className="text-xs text-blue-600 mt-2">Detailed guides for every module and feature.</p>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center">
                        <div className="text-3xl mb-2">🛠️</div>
                        <h3 className="font-bold text-amber-800">Troubleshooting</h3>
                        <p className="text-xs text-amber-600 mt-2">Common issues and how to resolve them.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3 underline decoration-teal-300">How to use Check-In/Out</h2>
                        <p className="text-gray-600 mb-4">The Check-In module allows you to track visitor arrivals in real-time. Simply search for a visitor code or name and click the check-in button. The status will update instantly on the dashboard.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3 underline decoration-teal-300">Bulk Uploading Data</h2>
                        <p className="text-gray-600 mb-4">You can upload bulk visitor registrations using the provided Excel template. Ensure all required fields (Name, Email, Phone) are filled before uploading to avoid validation errors.</p>
                    </section>
                </div>

                
            </div>
        </div>
    );
};

export default Help;
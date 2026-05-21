import React from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPolicy = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <div 
                className="relative h-48 flex flex-col justify-center px-12 bg-cover bg-center" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80")' 
                }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">Cancellation and Refund Policy</h1>
                <div className="flex items-center gap-2 text-sm">
                    <span 
                        onClick={() => navigate("/")} 
                        className="text-yellow-500 cursor-pointer hover:underline"
                    >
                        Home
                    </span>
                    <span className="text-white opacity-60">{'>'}</span>
                    <span className="text-white opacity-80">Cancellation and Refund Policy</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto py-12 px-8">
                <h2 className="text-xl font-bold text-blue-600 mb-6">
                    Cancellations and Refunds Policy
                </h2>

                <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">1. Cancellations, Refunds, and Modifications</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">1.1 Customer Cancellations</h4>
                                <p>
                                    If a customer cancels their booking, the refund terms depend on the event organizer's cancellation policy, which will be stated at the time of booking. 
                                    Refunds may be partial or full depending on the timing of the cancellation and the terms of the event organizer.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">1.2 Event Organizer Cancellations</h4>
                                <p>
                                    If an event organizer cancels an event, the customer will be entitled to a full refund, minus any non-refundable platform fees and transaction charges.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">1.3 Modification of Bookings</h4>
                                <p>
                                    Modifications to event bookings (such as date or time changes) can be made subject to approval by both the customer and the event organizer in accordance with their mutual agreement. 
                                    Platform owners are not responsible for modifications or cancellations and merely act as an intermediary for the event booking process.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">2. Late Payments</h3>
                        <p>
                            <span className="font-bold">Customer Delays:</span> If a customer fails to complete payment by the booking deadline, the platform may cancel the event or booking. A late fee may be applied, depending on the platform's policy.
                        </p>
                        <p>
                            <span className="font-bold">Event Organizer Delays:</span> If an event organizer delays in receiving or providing funds for an event, it may result in the suspension or termination of their ability to list.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">3. Dispute Resolution</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">3.1 Customer Disputes</h4>
                                <p>
                                    Customers must first contact the event organizer directly via the platform's messaging system for any event-related issues. If the issue cannot be resolved, the platform will mediate and work to resolve the dispute.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">3.2 Event Organizer Disputes</h4>
                                <p>
                                    Event organizers who have concerns with the platform's processing of payments or policies must notify the platform immediately. The platform will review and attempt to resolve the dispute.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">3.3 Arbitration</h4>
                                <p>
                                    Any disputes that cannot be resolved amicably shall be settled through binding arbitration in [jurisdiction/country], in accordance with the [insert relevant arbitration rules].
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">4. Platform's Rights and Responsibilities</h3>
                        <p>
                            <span className="font-bold">Intermediary Role:</span> The platform acts as an intermediary to facilitate the booking and payment between the customer and event organizer. The platform is not responsible for the delivery of services or the quality of events.
                        </p>
                        <p>
                            <span className="font-bold">Suspension of Services:</span> The platform reserves the right to suspend or terminate access to any user (customer or event organizer) who violates these Terms and Conditions or engages in fraudulent activity.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">5. Intellectual Property</h3>
                        <p>
                            The content available on the platform, including text, images, logos, designs, and other media, is owned or licensed by the platform owners. You may not use any of these materials without express permission from the platform owners. Users may not upload, share, or distribute content that violates the intellectual property rights of others.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">6. User Conduct</h3>
                        <p>
                            <span className="font-bold">Customer Responsibilities:</span> Customers agree to provide accurate information when making a booking and comply with the event organizer's policies, including their cancellation policy and any event-specific rules.
                        </p>
                        <p>
                            <span className="font-bold">Event Organizer Responsibilities:</span> Event organizers agree to provide accurate descriptions of their events, ensure availability on the listed dates, and comply with all applicable laws and regulations in the execution of their services. Users must not engage in fraudulent or malicious activities, including using false information, attempting to manipulate payments, or violating the privacy of other users.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">7. Limitation of Liability</h3>
                        <p>
                            The platform owners are not liable for any direct, indirect, incidental, or consequential damages resulting from the use of the platform, including issues related to event cancellations, poor service quality, or financial transactions.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">8. Modifications to the Terms</h3>
                        <p>
                            The platform owners reserve the right to modify these Terms and Conditions at any time. Users will be notified of any significant changes, and continued use of the platform after such modifications will constitute acceptance of the updated terms.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
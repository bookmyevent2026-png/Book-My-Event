import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Hero Section */}
            <div 
                className="relative h-48 flex flex-col justify-center px-12 bg-cover bg-center" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80")' 
                }}
            >
                <h1 className="text-4xl font-bold text-white mb-2">Terms and Conditions</h1>
                <div className="flex items-center gap-2 text-sm">
                    <span 
                        onClick={() => navigate("/")} 
                        className="text-yellow-500 cursor-pointer hover:underline"
                    >
                        Home
                    </span>
                    <span className="text-white opacity-60">{'>'}</span>
                    <span className="text-white opacity-80">Terms and Conditions</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto py-12 px-8">
                <h2 className="text-xl font-bold text-blue-600 mb-6">
                    Terms & Conditions for Use of the Book My Event
                </h2>

                <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
                    <p className="text-gray-600">
                        These Terms and Conditions ("Agreement") govern the use of the Book My Event website and services ("Platform"). Including the booking, payment, and interaction between customers, event organizers, and platform owners. By using the Platform, you ("User") agree to be bound by these terms.
                    </p>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">1. Introduction</h3>
                        <p>
                            These Terms and Conditions apply to the relationship between the platform owners ("we", "us", or "our"), event organizers ("Event Organizers"), and customers ("Customers") using our platform to book, organize, and pay for events. This Agreement governs the services provided by the platform, including but not limited to the payment processes, event booking, and dispute resolution.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">2. Parties</h3>
                        <ul className="space-y-2 list-none">
                            <li><span className="font-bold">Customer:</span> The person or entity who books an event through the platform.</li>
                            <li><span className="font-bold">Event Organizer:</span> The person or entity providing the event services (such as venues, performers, equipment) for booking on the platform.</li>
                            <li><span className="font-bold">Platform Owners:</span> The owners and operators of the platform, which acts as an intermediary to facilitate event bookings and related payments.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">3. Account Creation and Eligibility</h3>
                        <ul className="space-y-3 list-disc pl-5">
                            <li>To use the platform, you must create an account by providing accurate and complete information. You must be at least 18 years of age to book events or offer services through the platform.</li>
                            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                            <li>You agree to immediately notify the platform of any unauthorized use of your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-gray-900 mb-2">4. Payment and Fees</h3>
                        
                        <div className="mt-4 space-y-6">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">4.1 Payment Methods</h4>
                                <p>
                                    Payments for event bookings on the platform must be made through the following methods: Credit/Debit cards (Visa, MasterCard, etc.), online payment services (PayPal, Stripe), or bank transfer, as available on the platform.
                                    Payments made through the platform are processed via third-party gateways to ensure secure transactions.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">4.2 Platform Fees</h4>
                                <p>
                                    The platform charges a service fee, which is deducted from the total payment made by the customer to the event organizer. The applicable service fee is disclosed at the time of booking.
                                    Additional transaction fees, as imposed by payment processors, may apply and are either passed on to the customer or event organizer.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">4.3 Payment to Event Organizer</h4>
                                <p>
                                    Event organizers will receive payment for their services, minus the platform's service fees, after the event is confirmed and payment is processed.
                                    Event organizers must provide accurate payment details (e.g., bank account or online wallet information) to receive funds.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Terms;

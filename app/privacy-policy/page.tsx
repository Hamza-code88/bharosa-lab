import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last Updated: July 2026</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to <strong>Bharosa Lab</strong>. We value your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and services for home blood sample collection and lab testing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Personal Information:</strong> Name, phone number, age, and gender to process your lab tests and identify patients accurately.</li>
              <li><strong>Location Data:</strong> Your exact GPS location (latitude and longitude) and home address are collected solely for our riders to navigate and reach your destination for sample collection.</li>
              <li><strong>Medical Data:</strong> Details of the tests you book and the resulting medical reports, handled with strict confidentiality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">Your information is used strictly to provide and improve our healthcare services:</p>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li>To dispatch a rider to your specific location for sample collection.</li>
              <li>To communicate with you regarding your bookings, rider status, and test reports.</li>
              <li>To process payments and maintain your booking history.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing and Security</h2>
            <p className="leading-relaxed">
              We do not sell or rent your personal information to third parties. Your data is only shared with our verified lab partners and riders strictly for fulfilling your booked service. We use industry-standard security measures (including secure database infrastructure) to protect your personal and medical information from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to request access to the data we hold about you, and to request correction or deletion of your personal data. If you have any concerns regarding your privacy, please contact our support team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at support@bharosalab.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

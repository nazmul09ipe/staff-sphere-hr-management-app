// @flow strict
import * as React from "react";

import PageTitle from '../Shared/PageTitle';

function Terms() {
  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 py-10 px-5 sm:px-10 lg:px-24">
      <PageTitle title="Terms and Conditions"></PageTitle>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-800 dark:text-orange-400 text-center mb-10">
        StuffSphere – Terms and Conditions
      </h1>

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 sm:p-10 space-y-8 transition-colors duration-500">
        <section className="text-center">
          <p className="text-base font-medium mb-1 text-gray-700 dark:text-gray-300">
            Effective Date: July 2025
          </p>
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Welcome to StuffSphere!
          </h2>
          <p className="text-left text-gray-700 dark:text-gray-300">
            By accessing or using StuffSphere (the “Website”), you agree to be
            bound by these Terms and Conditions (“Terms”). Please read them
            carefully. If you do not agree with any part of these Terms, please
            do not use the Website.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">1. About StuffSphere</h3>
          <p className="text-gray-700 dark:text-gray-300">
            StuffSphere is a platform that helps users discover and book repair and maintenance services
            around them. We provide listings, descriptions, and relevant
            details to help users find trusted service providers.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">2. Use of the Website</h3>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
            <li>You must be at least 13 years old to use StuffSphere.</li>
            <li>You agree to use the Website only for lawful purposes.</li>
            <li>You may not use the Website to post or share harmful, offensive, or illegal content.</li>
            <li>You agree not to attempt to hack, disrupt, or misuse the platform.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">3. User Accounts (if applicable)</h3>
          <p className="text-gray-700 dark:text-gray-300">If StuffSphere allows users to create accounts:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700 dark:text-gray-300">
            <li>You are responsible for keeping your login credentials secure.</li>
            <li>You agree not to share your account or use someone else’s without permission.</li>
            <li>You are responsible for all activity under your account.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">4. Service Information</h3>
          <p className="text-gray-700 dark:text-gray-300">
            Services listed on StuffSphere are provided for informational purposes.
            While we try to ensure accuracy, we do not guarantee that details
            are always correct, up to date, or error-free. We are not responsible
            for cancellations, delays, or the quality of third-party services.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">5. Third-Party Links</h3>
          <p className="text-gray-700 dark:text-gray-300">
            StuffSphere may include links to third-party websites or platforms.
            We are not responsible for the content, policies, or actions of those sites.
            Use them at your own risk.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">6. Intellectual Property</h3>
          <p className="text-gray-700 dark:text-gray-300">
            All content on StuffSphere, including logos, design, and text, is owned or licensed by us.
            You may not copy, distribute, or use any part of the Website for commercial purposes without permission.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">7. Limitation of Liability</h3>
          <p className="text-gray-700 dark:text-gray-300">
            To the fullest extent allowed by law, StuffSphere is provided “as is” without warranties of any kind.
            We are not liable for any damages or losses resulting from your use of the Website or reliance on service information.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">8. Termination</h3>
          <p className="text-gray-700 dark:text-gray-300">
            We reserve the right to suspend or terminate your access to StuffSphere at any time
            for violating these Terms or for any other reason deemed appropriate.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">9. Changes to These Terms</h3>
          <p className="text-gray-700 dark:text-gray-300">
            We may update these Terms occasionally. Changes will take effect when posted on this page.
            Continued use of StuffSphere after changes means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h3 className="font-bold mb-2 text-gray-900 dark:text-gray-100">10. Contact Us</h3>
          <p className="text-gray-700 dark:text-gray-300">
            If you have any questions about these Terms, contact us:
            <br />
            📧 <a href="mailto:fixitnow2025@gmail.com" className="text-blue-700 dark:text-blue-400 underline">fixitnow2025@gmail.com</a>
            <br />
            🌐 <a href="https://www.fixitnow.com" className="text-blue-700 dark:text-blue-400 underline">https://www.fixitnow.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}

export default Terms;

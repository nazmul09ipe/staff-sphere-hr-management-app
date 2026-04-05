import React from "react";
import PageTitle from "../Shared/PageTitle";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-10 sm:py-16">
      <PageTitle title="Terms & Conditions" />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center sm:text-left">
          Terms & Conditions
        </h1>

        <p className="mb-4 text-base sm:text-lg leading-relaxed">
          By creating an account, you agree to follow our rules, respect other
          users, and use the platform responsibly.
        </p>

        <p className="mb-4 text-base sm:text-lg leading-relaxed">
          We may update these terms occasionally. Continued use of our service
          means you accept the changes.
        </p>

        <p className="mb-4 text-base sm:text-lg leading-relaxed">
          For any questions, feel free to contact our support team.
        </p>
      </div>
    </div>
  );
};

export default Terms;
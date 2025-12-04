import React from "react";
import PageTitle from "../Shared/PageTitle";

const Terms = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100">
      <PageTitle title="Terms & Conditions" />

      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        By creating an account, you agree to follow our rules, respect other
        users, and use the platform responsibly.
      </p>

      <p className="mb-4">
        We may update these terms occasionally. Continued use of our service
        means you accept the changes.
      </p>

      <p className="mb-4">
        For any questions, feel free to contact our support team.
      </p>
    </div>
  );
};

export default Terms;

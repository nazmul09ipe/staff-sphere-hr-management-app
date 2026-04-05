import React from "react";
import PageTitle from "../../Shared/PageTitle";
import HeroSlider from "./HeroSlider";
import OurProducts from "./OurProducts";
import OurBuyers from './OurBuyers';
import CEOTestimonials from "./CEOTestimonials";
import Certifications from './Certifications';
import StatsDashboard from './StatsDashboard';

const Home = () => {
  return (
    <div className="relative w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      
      {/* Page Meta */}
      <PageTitle title="Home" />

      {/* Hero Section */}
      <section className="relative z-0">
        <HeroSlider />
      </section>

      {/* Products Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 lg:px-20">
        <OurProducts />
      </section>

      {/* Buyers / Clients Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 lg:px-20 bg-gray-100 dark:bg-gray-800 rounded-t-3xl">
        <OurBuyers />
      </section>

      {/* CEO Testimonials Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 lg:px-20">
        <CEOTestimonials />
      </section>

      {/* Certifications / Achievements Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 lg:px-20 bg-gray-100 dark:bg-gray-800 rounded-t-3xl">
        <Certifications />
      </section>

      {/* Stats Dashboard Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-10 lg:px-20">
        <StatsDashboard />
      </section>

    </div>
  );
};

export default Home;
import React from "react";
import PageTitle from "../../Shared/PageTitle";
import HeroSlider from "./HeroSlider";
import OurProducts from "./OurProducts";
import OurBuyers from './OurBuyers';
import CEOTestimonials from "./CEOTestimonials";
import Certifications from './Certifications';




const Home = () => {
  return (
    <div className="relative w-full">
      <PageTitle title="Home" />
      <HeroSlider />
      <OurProducts></OurProducts>
      <OurBuyers></OurBuyers>
       <CEOTestimonials></CEOTestimonials>
       <Certifications></Certifications>
     
     
      
      
    </div>
  );
};

export default Home;
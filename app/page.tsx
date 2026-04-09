import Image from "next/image";
import HeroSection from "@/components/home/Hero";
import ServicesPage from "./services/page";
import IndustriesSection from "@/components/home/Industries";
import OurTeamSection from "@/components/home/OurTeam";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesPage />
      <IndustriesSection />
      <OurTeamSection />
    </div>
  );
}

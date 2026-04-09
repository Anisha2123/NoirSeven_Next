import WhoWeAre from "@/components/about/Whoweare";
import MeetTheLeader from "../AboutUs/page";
import VisionMissionFounder from "@/components/about/Vision";
import AboutUs from "@/components/about/Aboutus";


// app/page.tsx
export default function Page() {
  return (
    <main>
        <AboutUs />
      <MeetTheLeader />
      <WhoWeAre />
      <VisionMissionFounder />
    </main>
  );
}

import WhoWeAre from "@/components/about/Whoweare";
import MeetTheLeader from "@/components/about/MeettheLeader";
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

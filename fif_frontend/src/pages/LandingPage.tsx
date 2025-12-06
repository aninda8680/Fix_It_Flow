import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import UploadIssue from "../components/UploadIssue";

export default function LandingPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <UploadIssue />
    </div>
  );
}

import Hero from "../components/Hero";
import Hero1 from "../components/Hero1";
import { useAuth } from "../context/AuthContext";
// import HowItWorks from "../components/HowItWorks";
// import UploadIssue from "../components/UploadIssue";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {user ? <Hero1 /> : <Hero />}
      {/* <HowItWorks />
      <UploadIssue /> */}
    </div>
  );
}

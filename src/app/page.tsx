import VideoSection from "@/components/VideoSection/VideoSection";
import AboutUs from "@/components/AboutUs/AboutUs";
import Review from "@/components/Review/Review";
import Contact from "@/components/Contact/Contact";
import Projects from "@/components/Projects/ProjectsSection";
import WorkSpace from "@/components/WorkSpace/WorkSpace";


export default function Home() {
  return (
    <>
    
   <VideoSection bannerVideo="/banner-video.mp4"/>
   <AboutUs />
   <Projects />
   <WorkSpace />
   <Review />
   <Contact />
    </>
  );
}

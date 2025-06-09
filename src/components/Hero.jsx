import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

// Enable ScrollTrigger plugin for GSAP
gsap.registerPlugin(ScrollTrigger);

// --- HELPER ---
// It's good practice to keep your data definitions separate.
const videoData = [
  { id: 1, src: "videos/hero-1.mp4", poster: "videos/poster-1.jpg" },
  { id: 2, src: "videos/hero-2.mp4", poster: "videos/poster-2.jpg" },
  { id: 3, src: "videos/hero-3.mp4", poster: "videos/poster-3.jpg" },
  { id: 4, src: "videos/hero-4.mp4", poster: "videos/poster-4.jpg" },
];

const Hero = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Use 0-based index
  const [isMainVideoLoaded, setIsMainVideoLoaded] = useState(false);
  const [areInteractiveVideosReady, setAreInteractiveVideosReady] =
    useState(false);

  // --- REFS ---
  // Use separate, descriptive refs for each element
  const transitionVideoRef = useRef(null);
  const clickableThumbRef = useRef(null);

  const handleMainVideoLoad = () => {
    setIsMainVideoLoaded(true);
  };

  // --- LAZY LOADING ---
  // Preload the interactive videos after the main content is visible or on hover.
  const prepareInteractiveVideos = () => {
    if (!areInteractiveVideosReady) {
      setAreInteractiveVideosReady(true);
    }
  };

  const handleMiniVideoClick = () => {
    // Animate the transition video
    gsap.to(transitionVideoRef.current, {
      scale: 1,
      width: "100%",
      height: "100%",
      duration: 1,
      ease: "power2.inOut",
      onStart: () => {
        transitionVideoRef.current.style.visibility = "visible";
        transitionVideoRef.current.play();
      },
      onComplete: () => {
        // When the animation is done, update the main video index
        const nextIndex = (currentVideoIndex + 1) % videoData.length;
        setCurrentVideoIndex(nextIndex);
        // Reset the transition video for the next click
        gsap.set(transitionVideoRef.current, {
          scale: 0.25, // Or your initial size
          width: "16rem", // 256px
          height: "16rem", // 256px
          visibility: "hidden",
        });
      },
    });
  };

  // --- ANIMATIONS ---
  useGSAP(() => {
    // Initial animation for the frame shape
    gsap.fromTo(
      "#video-frame",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        borderRadius: "0 0 0 0",
      },
      {
        clipPath: "polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)",
        borderRadius: "0 0 40% 10%",
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: "#video-frame",
          start: "center center",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);

  const currentVideo = videoData[currentVideoIndex];
  const nextVideo = videoData[(currentVideoIndex + 1) % videoData.length];

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {/* --- LOADER --- */}
      {/* The loader now only depends on the main background video */}
      {!isMainVideoLoaded && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}

      {/* --- VIDEO CONTAINER --- */}
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
        {/* Main background video */}
        <video
          key={currentVideo.src} // Use key to force React to re-render the component on src change
          src={currentVideo.src}
          poster={currentVideo.poster} // INSTANT visual feedback
          autoPlay
          loop
          muted
          playsInline // Important for mobile browsers
          onLoadedData={handleMainVideoLoad}
          className="absolute left-0 top-0 size-full object-cover object-center"
        />

        {/* --- INTERACTIVE ELEMENTS --- */}
        <div
          className="mask-clip-path absolute-center z-50 size-64 cursor-pointer overflow-hidden rounded-lg"
          onMouseEnter={prepareInteractiveVideos} // Lazy load on hover
        >
          {/* This inner div is what the user clicks */}
          <div
            ref={clickableThumbRef}
            onClick={handleMiniVideoClick}
            className="group size-full"
          >
            {/* The clickable thumbnail video (the "next" video) */}
            {areInteractiveVideosReady && (
              <video
                src={nextVideo.src}
                loop
                muted
                playsInline
                autoPlay // Start playing on hover
                className="size-full origin-center object-cover object-center opacity-0 transition-all duration-500 ease-in-out group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </div>
        </div>

        {/* The video that scales up on click */}
        {areInteractiveVideosReady && (
          <video
            ref={transitionVideoRef}
            src={nextVideo.src}
            loop
            muted
            playsInline
            id="transition-video"
            // Start invisible and small, centered. GSAP will control it.
            className="absolute-center invisible z-20 size-64 scale-50 object-cover"
          />
        )}
      </div>

      {/* --- UI OVERLAYS --- */}
      <div className="absolute left-0 top-0 z-40 size-full pointer-events-none">
        <div className="mt-24 px-5 sm:px-10">
          <h1 className="special-font hero-heading text-blue-100">
            redefi<b>n</b>ed
          </h1>
          <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
            Enter the Metagame Layer <br />
            Unleash the Play Economy
          </p>
          <Button
            id="watch-trailer"
            title="Watch Trailer"
            leftIcon={<TiLocationArrow />}
            containerClass="!bg-yellow-300 flex-center gap-1 pointer-events-auto"
          />
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          G<b>a</b>ming
        </h1>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;

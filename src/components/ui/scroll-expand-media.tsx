"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface ScrollExpandMediaProps {
  initialMode?: "video" | "image";
  videoSrc?: string;
  imageSrc?: string;
  videoTitleLeft?: string;
  videoTitleRight?: string;
  imageTitleLeft?: string;
  imageTitleRight?: string;
  onStartLearning?: () => void;
  onTryDemo?: () => void;
  className?: string;
}

export const ScrollExpandMedia: React.FC<ScrollExpandMediaProps> = ({
  initialMode = "video",
  videoSrc = "https://vjs.zencdn.net/v/oceans.mp4",
  imageSrc = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop",
  videoTitleLeft = "Interactive",
  videoTitleRight = "Video Showcase",
  imageTitleLeft = "Dynamic",
  imageTitleRight = "Image Showcase",
  onStartLearning,
  onTryDemo,
  className = "",
}) => {
  const [mediaType, setMediaType] = useState<"video" | "image">(initialMode);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll inside the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scale media from compact card to full viewport width and height
  const mediaWidth = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["min(520px, 85vw)", "100vw"]
  );

  const mediaHeight = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["min(340px, 50vh)", "100vh"]
  );

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.55],
    ["28px", "0px"]
  );

  // Left and right text split outward and fade as user scrolls down
  const textLeftX = useTransform(scrollYProgress, [0, 0.35], [0, -260]);
  const textRightX = useTransform(scrollYProgress, [0, 0.35], [0, 260]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);

  // Subtle dark overlay to ensure readability
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.55], [0.15, 0.35]);

  const isVideo = mediaType === "video";

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[220vh] bg-[#070e0b] text-white select-none ${className}`}
    >
      {/* Sticky Fullscreen Stage */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        
        {/* Top Floating Segmented Switch: Video | Image */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 flex items-center bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/15 shadow-xl">
          <button
            type="button"
            onClick={() => setMediaType("video")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
              isVideo
                ? "bg-white text-black shadow-md"
                : "text-white/75 hover:text-white"
            }`}
          >
            Video
          </button>
          <button
            type="button"
            onClick={() => setMediaType("image")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer ${
              !isVideo
                ? "bg-white text-black shadow-md"
                : "text-white/75 hover:text-white"
            }`}
          >
            Image
          </button>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-700/20 rounded-full blur-[140px] pointer-events-none" />

        {/* Background Split Titles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 sm:px-12 md:px-24 z-10">
          <motion.div
            style={{ x: textLeftX, opacity: textOpacity }}
            className="flex-1 text-right pr-6 sm:pr-10"
          >
            <span className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white/90 drop-shadow-lg">
              {isVideo ? videoTitleLeft : imageTitleLeft}
            </span>
          </motion.div>

          {/* Spacer corresponding to center card */}
          <div className="w-48 sm:w-72 md:w-96 flex-shrink-0" />

          <motion.div
            style={{ x: textRightX, opacity: textOpacity }}
            className="flex-1 text-left pl-6 sm:pl-10"
          >
            <span className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white/90 drop-shadow-lg">
              {isVideo ? videoTitleRight : imageTitleRight}
            </span>
          </motion.div>
        </div>

        {/* Central Expanding Media Container */}
        <motion.div
          style={{
            width: mediaWidth,
            height: mediaHeight,
            borderRadius: borderRadius,
          }}
          className="relative overflow-hidden shadow-2xl z-20 transition-shadow duration-300 border border-white/10"
        >
          {isVideo ? (
            <video
              key="video-media"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              src={videoSrc}
            />
          ) : (
            <img
              key="image-media"
              src={imageSrc}
              alt="Dynamic Showcase"
              className="w-full h-full object-cover"
              loading="eager"
            />
          )}

          {/* Dark scrim overlay */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-black pointer-events-none"
          />

          {/* Subtle bottom scroll cue on the card when compact */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none text-center"
          >
            <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase px-3 py-1 rounded-full bg-black/40 backdrop-blur border border-white/15 inline-flex items-center gap-1">
              <span>Scroll to Expand</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </span>
          </motion.div>
        </motion.div>

      </div>

      {/* Editorial Content Revealed When Scrolled Down */}
      <div className="relative z-30 bg-[#070e0b] text-white px-6 sm:px-12 lg:px-24 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Interactive Component Showcase
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              About This Component
            </h2>
            
            <p className="text-base sm:text-lg text-white/80 leading-relaxed font-light">
              This is a demonstration of the{" "}
              <strong className="text-white font-medium">ScrollExpandMedia</strong>{" "}
              component with {isVideo ? "a video" : "an image"}. As you scroll, the{" "}
              {isVideo ? "video" : "image"} expands to fill more of the screen, creating
              an immersive experience. This component is perfect for showcasing{" "}
              {isVideo ? "video" : "visual"} content in a modern, interactive way.
            </p>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
              The ScrollExpandMedia component provides a unique way to engage users
              with your content through interactive scrolling. Try switching between
              video and image modes to see different implementations.
            </p>
          </div>

          {/* Connected AstraLearn Actions */}
          {(onStartLearning || onTryDemo) && (
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
              {onStartLearning && (
                <button
                  type="button"
                  onClick={onStartLearning}
                  className="px-6 py-3 rounded-full bg-white hover:bg-white/90 text-black font-semibold text-sm transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  Start Learning with AstraLearn
                </button>
              )}
              {onTryDemo && (
                <button
                  type="button"
                  onClick={onTryDemo}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm transition-all cursor-pointer"
                >
                  Load Cloud Computing Demo
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ScrollExpandMedia;

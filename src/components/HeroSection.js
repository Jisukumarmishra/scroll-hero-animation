"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Statistics data                                                    */
/* ------------------------------------------------------------------ */
const stats = [
  { value: "58%", label: "Bold design that stands out." },
  { value: "23%", label: "A fresh take on everyday performance." },
  { value: "27%", label: "Made for people who move differently." },
  { value: "40%", label: "A distinctive driving experience." },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const carRef = useRef(null);
  const statsRef = useRef([]);
  const heroRef = useRef(null);
  const scrollHintRef = useRef(null);
  const bgGlowRef = useRef(null);

  useEffect(() => {
    /* Respect reduced-motion preference */
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      document
        .querySelectorAll(".gsap-hidden")
        .forEach((el) => (el.style.visibility = "visible"));
      return;
    }

    /* GSAP context for clean React cleanup in Strict Mode */
    const ctx = gsap.context(() => {
      /* --------------------------------------------------------------- */
      /*  1. Intro timeline — time-based entrance sequence                */
      /* --------------------------------------------------------------- */
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Headline fades in and rises into position
      introTl.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0, visibility: "hidden" },
        { y: 0, opacity: 1, visibility: "visible", duration: 1.2 }
      );

      // Car slides in from right with scale
      introTl.fromTo(
        carRef.current,
        { x: 150, opacity: 0, scale: 0.9, visibility: "hidden" },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          visibility: "visible",
          duration: 1.4,
          ease: "power2.out",
        },
        "-=0.7"
      );

      // Statistics animate in sequentially with staggered delay
      statsRef.current.forEach((stat, i) => {
        if (!stat) return;
        introTl.fromTo(
          stat,
          { y: 40, opacity: 0, visibility: "hidden" },
          {
            y: 0,
            opacity: 1,
            visibility: "visible",
            duration: 0.7,
            ease: "power2.out",
          },
          `-=${i === 0 ? 0.5 : 0.5}`
        );
      });

      // Scroll hint fades in last
      if (scrollHintRef.current) {
        introTl.fromTo(
          scrollHintRef.current,
          { opacity: 0 },
          { opacity: 0.4, duration: 0.6 },
          "-=0.3"
        );
      }

      /* --------------------------------------------------------------- */
      /*  2. Scroll-driven car animation (scrubbed)                      */
      /* --------------------------------------------------------------- */
      const vw = window.innerWidth;
      const isMobile = vw < 640;
      const isTablet = vw >= 640 && vw < 1024;

      // Responsive animation distances
      const xDistance = isMobile ? -60 : isTablet ? -180 : -320;
      const yDistance = isMobile ? -30 : isTablet ? -50 : -100;
      const scaleEnd = isMobile ? 0.88 : isTablet ? 0.85 : 0.82;
      const rotateEnd = isMobile ? -1 : -3;

      /*
       * Pin the hero section for the duration of 100vh of extra scroll,
       * giving enough scroll distance for a smooth car movement.
       * "end: +=100%" means the pin lasts for one additional viewport height.
       */
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Car cinematic movement: translate left-upward, scale down, slight rotation
      scrollTl.to(
        carRef.current,
        {
          x: xDistance,
          y: yDistance,
          scale: scaleEnd,
          rotation: rotateEnd,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Headline fades and drifts upward as user scrolls
      scrollTl.to(
        headlineRef.current,
        {
          y: -60,
          opacity: 0.15,
          scale: 0.95,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Stats fade out with slight upward drift
      scrollTl.to(
        statsRef.current.filter(Boolean),
        {
          y: -30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "none",
        },
        0
      );

      // Background glow shifts color as scroll progresses
      if (bgGlowRef.current) {
        scrollTl.to(
          bgGlowRef.current,
          {
            opacity: 0.35,
            scale: 1.3,
            duration: 1,
            ease: "none",
          },
          0
        );
      }

      // Scroll hint hides immediately on scroll
      if (scrollHintRef.current) {
        scrollTl.to(
          scrollHintRef.current,
          {
            opacity: 0,
            duration: 0.15,
            ease: "none",
          },
          0
        );
      }

      /* Refresh ScrollTrigger after everything loads */
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* ============================================================= */}
      {/*  HERO — pinned during scroll-driven car animation              */}
      {/* ============================================================= */}
      <section
        ref={heroRef}
        className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
        aria-label="Hero section"
      >
        {/* ── Background ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#050505]" />

          {/* Warm ambient glow behind the car area */}
          <div
            ref={bgGlowRef}
            className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#1a1510] opacity-20 blur-[140px]"
          />

          {/* Subtle side vignettes */}
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/40 to-transparent" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="gsap-hidden text-center select-none"
          >
            <span className="block text-[clamp(1.8rem,7vw,5.5rem)] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] text-white/90 leading-tight">
              Welcome
            </span>
            <span className="block text-[clamp(2.2rem,9vw,7.5rem)] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] bg-gradient-to-r from-[#c0a46e] via-[#e8d5a3] to-[#c0a46e] bg-clip-text text-transparent leading-none mt-1 sm:mt-2">
              Itz Fizz
            </span>
          </h1>

          {/* Car Image */}
          <div
            ref={carRef}
            className="gsap-hidden relative w-full max-w-[850px] mt-2 sm:mt-4 lg:mt-6"
            style={{ willChange: "transform" }}
          >
            <Image
              src="/images/car.svg"
              alt="Luxury sports car — hero visual"
              width={1200}
              height={500}
              priority
              className="w-full h-auto object-contain drop-shadow-[0_25px_80px_rgba(192,164,110,0.12)]"
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 850px"
              unoptimized
            />
          </div>

          {/* Statistics */}
          <div className="w-full max-w-4xl mt-6 sm:mt-8 lg:mt-12 px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  ref={(el) => (statsRef.current[i] = el)}
                  className="gsap-hidden text-center"
                >
                  <p className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-bold text-[#c0a46e] leading-none font-mono">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[clamp(0.65rem,1.1vw,0.8rem)] text-[#777] leading-snug tracking-wider uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint indicator */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#666] font-light">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#666] to-transparent" />
        </div>
      </section>

      {/* ============================================================= */}
      {/*  After-scroll content — provides space below the pinned hero   */}
      {/* ============================================================= */}
      <section className="relative w-full min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-[#555] text-sm sm:text-base tracking-[0.25em] uppercase font-light">
            The journey begins here
          </p>
        </div>
      </section>
    </div>
  );
}

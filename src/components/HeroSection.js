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
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const carRef = useRef(null);
  const statsRef = useRef([]);
  const scrollSectionRef = useRef(null);

  useEffect(() => {
    /* Respect reduced-motion preference */
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      /* Make everything visible immediately */
      document
        .querySelectorAll(".gsap-hidden")
        .forEach((el) => (el.style.visibility = "visible"));
      return;
    }

    /* GSAP context for clean React cleanup */
    const ctx = gsap.context(() => {
      /* --------------------------------------------------------------- */
      /*  1. Intro timeline — time-based entrance animation               */
      /* --------------------------------------------------------------- */
      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // Headline entrance
      introTl.fromTo(
        headlineRef.current,
        { y: 60, opacity: 0, visibility: "hidden" },
        { y: 0, opacity: 1, visibility: "visible", duration: 1.2 }
      );

      // Car entrance
      introTl.fromTo(
        carRef.current,
        { x: 120, opacity: 0, scale: 0.92, visibility: "hidden" },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          visibility: "visible",
          duration: 1.4,
          ease: "power2.out",
        },
        "-=0.8"
      );

      // Stats sequential entrance
      statsRef.current.forEach((stat, i) => {
        if (!stat) return;
        introTl.fromTo(
          stat,
          { y: 40, opacity: 0, visibility: "hidden" },
          {
            y: 0,
            opacity: 1,
            visibility: "visible",
            duration: 0.8,
            ease: "power2.out",
          },
          `-=${i === 0 ? 0.6 : 0.55}`
        );
      });

      /* --------------------------------------------------------------- */
      /*  2. Scroll-driven car animation                                  */
      /* --------------------------------------------------------------- */
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      // Adapt movement distances for screen size
      const xDistance = isMobile ? -80 : isTablet ? -200 : -350;
      const yDistance = isMobile ? -40 : isTablet ? -60 : -80;
      const scaleEnd = isMobile ? 0.85 : 0.88;

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          // Prevent overwriting intro animation values
          invalidateOnRefresh: true,
        },
      });

      scrollTl
        .to(carRef.current, {
          x: xDistance,
          y: yDistance,
          scale: scaleEnd,
          rotation: -2,
          duration: 1,
          ease: "none",
        })
        .to(
          headlineRef.current,
          {
            y: -50,
            opacity: 0.3,
            duration: 1,
            ease: "none",
          },
          0
        )
        .to(
          statsRef.current,
          {
            y: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "none",
          },
          0
        );

      /* Refresh ScrollTrigger after fonts/images load */
      const handleLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", handleLoad);

      return () => {
        window.removeEventListener("load", handleLoad);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* ============================================================= */}
      {/*  HERO / SCROLL SECTION — pinned during scroll animation        */}
      {/* ============================================================= */}
      <section
        ref={scrollSectionRef}
        className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
        aria-label="Hero section"
      >
        {/* Subtle background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#060606]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[#1a1510] opacity-20 blur-[120px]" />
        </div>

        {/* Content container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 sm:px-8 lg:px-16">
          {/* ── Headline ── */}
          <h1
            ref={headlineRef}
            className="gsap-hidden text-center select-none"
          >
            <span className="block text-[clamp(2rem,8vw,6rem)] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] lg:tracking-[0.5em] text-white leading-tight">
              Welcome
            </span>
            <span className="block text-[clamp(2.5rem,10vw,8rem)] font-black uppercase tracking-[0.35em] sm:tracking-[0.45em] lg:tracking-[0.55em] bg-gradient-to-r from-[#c0a46e] via-[#e8d5a3] to-[#c0a46e] bg-clip-text text-transparent leading-none mt-1 sm:mt-2">
              Itz Fizz
            </span>
          </h1>

          {/* ── Car Image ── */}
          <div
            ref={carRef}
            className="gsap-hidden relative w-full max-w-[900px] mt-4 sm:mt-6 lg:mt-8"
          >
            <Image
              src="/images/car.svg"
              alt="Luxury sports car — hero visual"
              width={1200}
              height={500}
              priority
              className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(192,164,110,0.15)]"
              sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 900px"
              unoptimized
            />
          </div>

          {/* ── Statistics ── */}
          <div className="w-full max-w-4xl mt-8 sm:mt-10 lg:mt-14 px-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  ref={(el) => (statsRef.current[i] = el)}
                  className="gsap-hidden text-center group"
                >
                  <p className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#c0a46e] leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[clamp(0.7rem,1.2vw,0.85rem)] text-[#888] leading-snug tracking-wide uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          aria-hidden="true"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[#888]">
            Scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#888] to-transparent" />
        </div>
      </section>

      {/* ============================================================= */}
      {/*  After-scroll content — gives space after the pinned section    */}
      {/* ============================================================= */}
      <section className="relative w-full h-screen bg-[#060606] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-[#888] text-sm sm:text-base tracking-[0.2em] uppercase">
            The journey begins here
          </p>
        </div>
      </section>
    </div>
  );
}

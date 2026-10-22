"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "58%", label: "Bold design that stands out." },
  { value: "23%", label: "A fresh take on everyday performance." },
  { value: "27%", label: "Made for people who move differently." },
  { value: "40%", label: "A distinctive driving experience." },
];

function getCarMotion() {
  const viewportWidth = window.innerWidth;

  if (viewportWidth < 640) {
    return { x: -32, y: -14, scale: 0.9, rotation: -1 };
  }

  if (viewportWidth < 1024) {
    return { x: -120, y: -40, scale: 0.86, rotation: -2 };
  }

  return { x: -240, y: -70, scale: 0.82, rotation: -3 };
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const headlineScrollRef = useRef(null);
  const carMotionRef = useRef(null);
  const carEntranceRef = useRef(null);
  const statsRef = useRef([]);
  const statsScrollRef = useRef(null);
  const scrollHintRef = useRef(null);
  const bgGlowRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      containerRef.current
        ?.querySelectorAll(".gsap-hidden")
        .forEach((element) => {
          element.style.visibility = "visible";
        });
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro.fromTo(
        headlineRef.current,
        { y: 52, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1 }
      );

      intro.fromTo(
        carEntranceRef.current,
        { x: 120, scale: 0.94, autoAlpha: 0 },
        { x: 0, scale: 1, autoAlpha: 1, duration: 1.25, ease: "power2.out" },
        "-=0.65"
      );

      intro.fromTo(
        statsRef.current.filter(Boolean),
        { y: 28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.16,
          ease: "power2.out",
        },
        "-=0.55"
      );

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTimeline.to(
        carMotionRef.current,
        {
          x: () => getCarMotion().x,
          y: () => getCarMotion().y,
          scale: () => getCarMotion().scale,
          rotation: () => getCarMotion().rotation,
          duration: 1,
          ease: "none",
        },
        0
      );

      scrollTimeline.to(
        headlineScrollRef.current,
        { y: -48, autoAlpha: 0.18, scale: 0.96, duration: 1, ease: "none" },
        0
      );

      scrollTimeline.to(
        statsScrollRef.current,
        { y: -24, autoAlpha: 0, duration: 1, ease: "none" },
        0
      );

      scrollTimeline.to(
        bgGlowRef.current,
        { opacity: 0.34, scale: 1.22, duration: 1, ease: "none" },
        0
      );

      scrollTimeline.to(
        scrollHintRef.current,
        { autoAlpha: 0, duration: 0.15, ease: "none" },
        0
      );

      ScrollTrigger.refresh();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section
        ref={heroRef}
        className="hero-section relative w-full overflow-hidden bg-[#0a0a0a]"
        aria-label="Hero section"
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#050505]" />
          <div
            ref={bgGlowRef}
            className="absolute left-1/2 top-[15%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[#1a1510] opacity-20 blur-[140px]"
          />
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black/40 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-8 lg:px-16">
          <div ref={headlineScrollRef} className="text-center">
            <h1 ref={headlineRef} className="gsap-hidden select-none">
              <span className="block text-[clamp(1.8rem,7vw,5.5rem)] font-bold uppercase leading-tight tracking-[0.3em] text-white/90 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                Welcome
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#c0a46e] via-[#e8d5a3] to-[#c0a46e] bg-clip-text text-[clamp(2.2rem,9vw,7.5rem)] font-black uppercase leading-none tracking-[0.3em] text-transparent sm:mt-2 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                Itz Fizz
              </span>
            </h1>
          </div>

          <div
            ref={carMotionRef}
            className="car-motion relative mt-1 sm:mt-3"
            style={{ willChange: "transform" }}
          >
            <div ref={carEntranceRef} className="gsap-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/car-hero-v2.png`}
                alt="Graphite luxury sports coupe with warm studio highlights"
                width={1774}
                height={887}
                className="h-auto w-full object-contain drop-shadow-[0_25px_80px_rgba(192,164,110,0.14)]"
                fetchPriority="high"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </div>

          <dl
            ref={statsScrollRef}
            className="mt-4 grid w-full max-w-4xl grid-cols-2 gap-x-4 gap-y-5 px-2 sm:mt-6 sm:gap-x-6 lg:mt-8 lg:grid-cols-4 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                ref={(element) => {
                  statsRef.current[index] = element;
                }}
                className="gsap-hidden text-center"
              >
                <dt className="font-mono text-[clamp(1.6rem,3.5vw,2.8rem)] font-bold leading-none text-[#c0a46e]">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-[clamp(0.65rem,1.1vw,0.8rem)] uppercase leading-snug tracking-wider text-[#999]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 sm:bottom-8"
          style={{ opacity: 0.45 }}
          aria-hidden="true"
        >
          <span className="text-[10px] font-light uppercase tracking-[0.35em] text-[#777]">
            Scroll
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-[#777] to-transparent" />
        </div>
      </section>
    </div>
  );
}

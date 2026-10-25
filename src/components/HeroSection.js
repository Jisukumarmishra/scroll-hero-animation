"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "58%", label: "A bold, distinctive silhouette." },
  { value: "23%", label: "Everyday performance, elevated." },
  { value: "27%", label: "Built for a different perspective." },
  { value: "40%", label: "An unmistakable drive." },
];

const statRevealPositions = [0.12, 0.2, 0.28, 0.36];

function getCarTravelDistance(stage) {
  const viewportWidth = document.documentElement.clientWidth;
  const stageStyles = window.getComputedStyle(stage);
  const edgeInset = Number.parseFloat(stageStyles.left) || 0;
  return Math.max(
    0,
    viewportWidth - stage.offsetWidth - edgeInset * 2
  );
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
  const scrollProgressRef = useRef(null);
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
          x: () => getCarTravelDistance(carMotionRef.current),
          y: -8,
          scale: 0.96,
          rotation: 0.4,
          duration: 1,
          ease: "none",
        },
        0
      );

      scrollTimeline.to(
        headlineScrollRef.current,
        { y: -42, autoAlpha: 0.56, scale: 0.97, duration: 1, ease: "none" },
        0
      );

      scrollTimeline.to(
        statsScrollRef.current,
        { y: -14, autoAlpha: 1, duration: 1, ease: "none" },
        0
      );

      statsRef.current.filter(Boolean).forEach((stat, index) => {
        scrollTimeline.to(
          stat,
          {
            "--scroll-card-progress": 1,
            duration: 0.32,
            ease: "power2.out",
          },
          statRevealPositions[index]
        );
      });

      scrollTimeline.to(
        bgGlowRef.current,
        { opacity: 0.34, scale: 1.22, duration: 1, ease: "none" },
        0
      );

      scrollTimeline.to(
        scrollProgressRef.current,
        { scaleX: 1, duration: 1, ease: "none" },
        0
      );

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef}>
      <section
        ref={heroRef}
        className="hero-section relative w-full overflow-hidden"
        aria-label="Hero section"
      >
        <div className="hero-backdrop pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-grid absolute inset-0" />
          <div
            ref={bgGlowRef}
            className="hero-glow absolute left-1/2 top-[12%] h-[600px] w-[900px] -translate-x-1/2 rounded-full"
          />
          <div className="hero-floor-glow absolute left-1/2" />
        </div>

        <div className="hero-runway pointer-events-none absolute inset-x-0" aria-hidden="true">
          <div className="hero-runway-surface absolute inset-0" />
          <div className="hero-runway-centerline absolute inset-x-0" />
          <span className="hero-runway-marker hero-runway-start absolute">Start</span>
          <span className="hero-runway-marker hero-runway-finish absolute">Finish</span>
          <div className="hero-runway-progress absolute inset-x-0">
            <div
              ref={scrollProgressRef}
              className="h-full origin-left scale-x-0 bg-[#c0a46e]"
            />
          </div>
        </div>

        <div className="hero-car-path pointer-events-none absolute inset-x-0">
          <div
            ref={carMotionRef}
            className="car-motion hero-car-stage relative"
            style={{ willChange: "transform" }}
          >
            <div ref={carEntranceRef} className="hero-car-image gsap-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/car-hero-v2.png`}
                alt="Graphite luxury sports coupe facing right on the hero runway"
                width={1774}
                height={887}
                className="hero-car-visual h-auto w-full object-contain"
                fetchPriority="high"
                onLoad={() => ScrollTrigger.refresh()}
              />
            </div>
          </div>
        </div>

        <header className="hero-header absolute inset-x-0 top-0 z-20 flex items-center justify-between">
          <div className="hero-brand flex items-center gap-3">
            <span className="hero-brand-mark grid place-items-center">IF</span>
            <span className="flex flex-col">
              <span className="hero-brand-name">ITZ FIZZ</span>
              <span className="hero-brand-caption">Automotive studio</span>
            </span>
          </div>
          <span className="hero-header-center hidden sm:block">
            The art of motion
          </span>
          <span className="hero-edition flex items-center gap-2">
            <span className="hero-edition-dot" />
            <span>Concept 01</span>
          </span>
        </header>

        <div className="hero-content relative z-10 flex h-full flex-col items-center justify-between px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-16">
          <div ref={headlineScrollRef} className="hero-title-block text-center">
            <p className="hero-kicker">
              <span /> A study in design and performance <span />
            </p>
            <h1 ref={headlineRef} className="gsap-hidden select-none">
              <span className="hero-headline-primary block text-[clamp(1.8rem,7vw,5.5rem)] font-bold uppercase leading-tight tracking-[0.3em] text-white/90 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                Welcome
              </span>
              <span className="hero-headline-secondary mt-1 block bg-gradient-to-r from-[#c0a46e] via-[#e8d5a3] to-[#c0a46e] bg-clip-text text-[clamp(2.2rem,9vw,7.5rem)] font-black uppercase leading-none tracking-[0.3em] text-transparent sm:mt-2 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                Itz Fizz
              </span>
            </h1>
            <p className="hero-caption">
              Presence in every line. Purpose in every drive.
            </p>
          </div>

          <dl
            ref={statsScrollRef}
            className="hero-stats mt-4 grid w-full max-w-5xl grid-cols-2 gap-x-4 gap-y-5 px-2 sm:mt-6 sm:grid-cols-4 sm:gap-x-6 lg:mt-8 lg:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                ref={(element) => {
                  statsRef.current[index] = element;
                }}
                className="hero-stat gsap-hidden text-center"
              >
                <dt className="font-mono text-[clamp(1.6rem,3.5vw,2.8rem)] font-bold leading-none text-[#c0a46e]">
                  <span className="hero-stat-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className="hero-stat-value">{stat.value}</span>
                </dt>
                <dd className="mt-2 text-[clamp(0.65rem,1.1vw,0.8rem)] uppercase leading-snug tracking-wider text-[#999]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="hero-scroll-cue absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#0b0b0bd9] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/75 sm:bottom-7">
            <span>Scroll to drive</span>
            <svg
              className="h-3 w-3"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 1.5v8m0 0L2.5 6m3.5 3.5L9.5 6"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

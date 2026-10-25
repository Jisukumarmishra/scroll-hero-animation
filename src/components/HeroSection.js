"use client";

import { useEffect, useRef, useCallback } from "react";
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

/* ── Parse numeric value from stat string (e.g. "58%" → 58) ──── */
function parseStatValue(str) {
  const match = str.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

function getStatSuffix(str) {
  const match = str.match(/\d+(.*)$/);
  return match ? match[1] : "";
}

/* ── Split text into per-character spans ─────────────────────── */
function SplitText({ text, className }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={`char-span ${className || ""}`}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </>
  );
}

/* ── Floating particles ──────────────────────────────────────── */
function createParticles(container) {
  const count = 22;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    const size = 1 + Math.random() * 2.5;
    const x = Math.random() * 100;
    const y = 25 + Math.random() * 55;
    const opacity = 0.12 + Math.random() * 0.28;
    Object.assign(dot.style, {
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(224, 190, 128, ${opacity}), transparent 70%)`,
      pointerEvents: "none",
      willChange: "transform, opacity",
    });
    fragment.appendChild(dot);
  }
  container.appendChild(fragment);
  return container.children;
}

function animateParticles(particles) {
  Array.from(particles).forEach((dot) => {
    const duration = 7 + Math.random() * 12;
    const drift = -25 - Math.random() * 55;
    const sway = -25 + Math.random() * 50;

    gsap.to(dot, {
      y: drift,
      x: `+=${sway}`,
      opacity: 0,
      duration,
      repeat: -1,
      delay: Math.random() * 6,
      ease: "none",
      onRepeat() {
        gsap.set(dot, {
          opacity: 0.12 + Math.random() * 0.28,
          x: 0,
          y: 0,
          left: `${Math.random() * 100}%`,
          top: `${25 + Math.random() * 55}%`,
        });
      },
    });
  });
}

export default function HeroSection() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const headlineScrollRef = useRef(null);
  const carMotionRef = useRef(null);
  const carEntranceRef = useRef(null);
  const statsRef = useRef([]);
  const statValueRefs = useRef([]);
  const statsScrollRef = useRef(null);
  const scrollProgressRef = useRef(null);
  const bgGlowRef = useRef(null);
  const particlesRef = useRef(null);
  const scrollCueRef = useRef(null);
  const speedLinesRef = useRef(null);
  const kickerRef = useRef(null);
  const captionRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });

  /* ── Mouse parallax handler ──────────────────────────────────── */
  const handleMouseMove = useCallback((e) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, []);

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
      /* ── Particles ───────────────────────────────────────────── */
      if (particlesRef.current) {
        const particles = createParticles(particlesRef.current);
        animateParticles(particles);
      }

      /* ── Mouse parallax on glow ──────────────────────────────── */
      const glowEl = bgGlowRef.current;
      if (glowEl) {
        const tickerFn = () => {
          const { x, y } = mousePos.current;
          gsap.to(glowEl, {
            x: (x - 0.5) * 50,
            y: (y - 0.5) * 30,
            duration: 1.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };
        gsap.ticker.add(tickerFn);
        // Cleanup is handled by ctx.revert()
      }

      /* ── Intro timeline ──────────────────────────────────────── */
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      // Kicker fade in
      if (kickerRef.current) {
        intro.fromTo(
          kickerRef.current,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          0
        );
        // Kicker lines expand
        const kickerLines = kickerRef.current.querySelectorAll("span");
        if (kickerLines.length) {
          intro.fromTo(
            kickerLines,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.8, ease: "power2.out" },
            0.2
          );
        }
      }

      // Letter-by-letter headline
      const primaryChars = headlineRef.current?.querySelectorAll(
        ".hero-headline-primary .char-span"
      );
      const secondaryChars = headlineRef.current?.querySelectorAll(
        ".hero-headline-secondary .char-span"
      );

      // Make headline visible before animating individual letters
      gsap.set(headlineRef.current, { autoAlpha: 1 });

      if (primaryChars?.length) {
        intro.fromTo(
          primaryChars,
          { y: 30, autoAlpha: 0, rotationX: -40 },
          {
            y: 0,
            autoAlpha: 1,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.035,
            ease: "power2.out",
          },
          0.1
        );
      }

      if (secondaryChars?.length) {
        intro.fromTo(
          secondaryChars,
          { y: 40, autoAlpha: 0, scale: 0.85 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.65,
            stagger: 0.04,
            ease: "back.out(1.2)",
          },
          0.35
        );
      }

      // Caption
      if (captionRef.current) {
        intro.fromTo(
          captionRef.current,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.65 },
          "-=0.4"
        );
      }

      // Car entrance with blur clear
      intro.fromTo(
        carEntranceRef.current,
        { x: 160, scale: 0.88, autoAlpha: 0, filter: "blur(6px)" },
        {
          x: 0,
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power2.out",
        },
        0.3
      );

      // Stats stagger in with scale
      intro.fromTo(
        statsRef.current.filter(Boolean),
        { y: 28, autoAlpha: 0, scale: 0.94 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.7"
      );

      // Counter animation on stat values
      statValueRefs.current.filter(Boolean).forEach((el, idx) => {
        const target = parseStatValue(stats[idx].value);
        const suffix = getStatSuffix(stats[idx].value);
        const proxy = { val: 0 };
        intro.to(
          proxy,
          {
            val: target,
            duration: 1.2,
            ease: "power2.out",
            onUpdate() {
              el.textContent = `${Math.round(proxy.val)}${suffix}`;
            },
          },
          "-=1.0"
        );
      });

      // Scroll cue fade in
      if (scrollCueRef.current) {
        intro.fromTo(
          scrollCueRef.current,
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.55 },
          "-=0.5"
        );
      }

      /* ── Scroll-driven timeline ──────────────────────────────── */
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Fade out scroll cue quickly
            if (scrollCueRef.current) {
              const cueOpacity = Math.max(0, 1 - self.progress * 6);
              gsap.set(scrollCueRef.current, { autoAlpha: cueOpacity });
            }
            // Speed lines intensity
            if (speedLinesRef.current) {
              const linesOpacity = Math.min(0.5, self.progress * 1.2);
              gsap.set(speedLinesRef.current, { opacity: linesOpacity });
            }
          },
        },
      });

      // Car travel across the runway
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

      // Headline parallax on scroll
      scrollTimeline.to(
        headlineScrollRef.current,
        { y: -42, autoAlpha: 0.56, scale: 0.97, duration: 1, ease: "none" },
        0
      );

      // Stats parallax
      scrollTimeline.to(
        statsScrollRef.current,
        { y: -14, autoAlpha: 1, duration: 1, ease: "none" },
        0
      );

      // Stat card reveals
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

      // Background glow grow
      scrollTimeline.to(
        bgGlowRef.current,
        { opacity: 0.34, scale: 1.22, duration: 1, ease: "none" },
        0
      );

      // Progress bar
      scrollTimeline.to(
        scrollProgressRef.current,
        { scaleX: 1, duration: 1, ease: "none" },
        0
      );

      // Ambient glow color shift
      scrollTimeline.to(
        bgGlowRef.current,
        {
          background:
            "radial-gradient(ellipse, rgba(200, 175, 120, 0.20), rgba(170, 145, 95, 0.07) 28%, rgba(140, 110, 70, 0.03) 52%, transparent 74%)",
          duration: 1,
          ease: "none",
        },
        0
      );

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}>
      <section
        ref={heroRef}
        className="hero-section relative w-full overflow-hidden"
        aria-label="Hero section"
      >
        {/* ── Backdrop layers ────────────────────────────────────── */}
        <div className="hero-backdrop pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="hero-grid absolute inset-0" />
          <div
            ref={bgGlowRef}
            className="hero-glow absolute left-1/2 top-[12%] h-[600px] w-[900px] -translate-x-1/2 rounded-full"
          />
          <div className="hero-floor-glow absolute left-1/2" />
          {/* Floating particles */}
          <div
            ref={particlesRef}
            className="hero-particles absolute inset-0"
          />
        </div>

        {/* ── Film grain & vignette ──────────────────────────────── */}
        <div className="hero-noise absolute inset-0 z-[1]" aria-hidden="true" />
        <div className="hero-vignette absolute inset-0 z-[2]" aria-hidden="true" />

        {/* ── Speed lines (appear on scroll) ─────────────────────── */}
        <div
          ref={speedLinesRef}
          className="hero-speed-lines pointer-events-none absolute inset-0 z-[5]"
          aria-hidden="true"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="speed-line absolute"
              style={{
                top: `${40 + i * 3.5}%`,
                left: "3%",
                width: `${10 + i * 3}%`,
                opacity: 0.15 + (i * 0.06),
              }}
            />
          ))}
        </div>

        {/* ── Runway ─────────────────────────────────────────────── */}
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

        {/* ── Car ─────────────────────────────────────────────────── */}
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
              {/* Car reflection */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/car-hero-v2.png`}
                alt=""
                aria-hidden="true"
                width={1774}
                height={887}
                className="hero-car-reflection h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── Header ──────────────────────────────────────────────── */}
        <header className="hero-header absolute inset-x-0 top-0 z-20 flex items-center justify-between">
          <div className="hero-brand flex items-center gap-3 cursor-pointer">
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

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="hero-content relative z-10 flex h-full flex-col items-center justify-between px-4 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24 lg:px-16">
          <div ref={headlineScrollRef} className="hero-title-block text-center">
            <p ref={kickerRef} className="hero-kicker gsap-hidden">
              <span /> A study in design and performance <span />
            </p>
            <h1 ref={headlineRef} className="gsap-hidden select-none">
              <span className="hero-headline-primary block text-[clamp(1.8rem,7vw,5.5rem)] font-bold uppercase leading-tight tracking-[0.3em] text-white/90 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                <SplitText text="Welcome" />
              </span>
              <span className="hero-headline-secondary mt-1 block bg-gradient-to-r from-[#c0a46e] via-[#e8d5a3] to-[#c0a46e] bg-clip-text text-[clamp(2.2rem,9vw,7.5rem)] font-black uppercase leading-none tracking-[0.3em] text-transparent sm:mt-2 sm:tracking-[0.4em] lg:tracking-[0.5em]">
                <SplitText text="Itz Fizz" />
              </span>
            </h1>
            <p ref={captionRef} className="hero-caption gsap-hidden">
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
                  <span
                    className="hero-stat-value"
                    ref={(el) => {
                      statValueRefs.current[index] = el;
                    }}
                  >
                    {stat.value}
                  </span>
                </dt>
                <dd className="mt-2 text-[clamp(0.65rem,1.1vw,0.8rem)] uppercase leading-snug tracking-wider text-[#999]">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── Scroll cue ──────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div
            ref={scrollCueRef}
            className="hero-scroll-cue absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#0b0b0bd9] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/75 sm:bottom-7"
          >
            <div className="scroll-mouse-icon">
              <div className="scroll-mouse-dot" />
            </div>
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

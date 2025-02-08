import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorOuterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorOuter = cursorOuterRef.current;

    if (!cursor || !cursorOuter) return;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set(cursorOuter, {
      xPercent: -50,
      yPercent: -50,
    });

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: pos.x, y: pos.y };
    const speed = 0.2;

    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");
    const xSetOuter = gsap.quickSetter(cursorOuter, "x", "px");
    const ySetOuter = gsap.quickSetter(cursorOuter, "y", "px");

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.getAttribute('role') === 'button';

      if (isInteractive) {
        gsap.to(cursorOuter, {
          scale: 1.5,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(cursorOuter, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
      xSetOuter(mouse.x);
      ySetOuter(mouse.y);
    });

    return () => {
      gsap.ticker.remove(() => {});
    };
  }, []);

  return (
    <>
      <div
        ref={cursorOuterRef}
        className="custom-cursor-outer pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 rounded-full border border-primary/50 transition-transform duration-200 ease-out"
      />
      <div
        ref={cursorRef}
        className="custom-cursor pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full bg-primary transition-transform duration-200 ease-out"
      />
    </>
  );
}
import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FloatingLetter = ({ char }) => {
  const letterRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!letterRef.current) return;

      // 1. ADIM: Konum, opaklık ve görünürlüğü AYNI ANDA set et
      gsap.set(letterRef.current, {
        x: (Math.random() * window.innerWidth) - (window.innerWidth / 2),
        y: (Math.random() * window.innerHeight) - (window.innerHeight / 2),
        opacity: 0,
        scale: Math.random() * 0.3 + 0.8,
        visibility: "visible" // CSS'teki gizliliği burada kırıyoruz
      });

      const animateBounce = () => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const side = Math.floor(Math.random() * 4);
        let targetX = 0, targetY = 0;
        const padding = 120;

        switch (side) {
          case 0: targetX = (Math.random() * (vw - padding * 2)) - (vw / 2) + padding; targetY = -(vh / 2) + padding; break;
          case 1: targetX = (vw / 2) - padding; targetY = (Math.random() * (vh - padding * 2)) - (vh / 2) + padding; break;
          case 2: targetX = (Math.random() * (vw - padding * 2)) - (vw / 2) + padding; targetY = (vh / 2) - padding; break;
          case 3: targetX = -(vw / 2) + padding; targetY = (Math.random() * (vh - padding * 2)) - (vh / 2) + padding; break;
          default: break;
        }

        gsap.to(letterRef.current, {
          x: targetX, y: targetY,
          rotation: `+=${Math.random() * 360 - 180}`,
          duration: Math.random() * 6 + 6,
          ease: "none",
          onComplete: animateBounce,
        });
      };

      const animateOpacity = () => {
        gsap.to(letterRef.current, {
          opacity: Math.random() * 0.15 + 0.1,
          duration: Math.random() * 3 + 2,
          ease: "sine.inOut",
          onComplete: animateOpacity,
        });
      };

      animateBounce();
      animateOpacity();
    }, letterRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={letterRef}
      className="floating-letter"
      style={{ opacity: 0, visibility: 'hidden' }} // CSS Koruma
    >
      {char}
    </div>
  );
};

export default FloatingLetter;
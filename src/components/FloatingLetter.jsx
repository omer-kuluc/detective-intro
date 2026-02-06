import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';


const FloatingLetter = ({ char }) => {
  const letterRef = useRef(null);

  useEffect(() => {
    if (!letterRef.current) return;

    // Hareket animasyonu: Ekran kenarlarından sekme
    const animateBounce = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      const side = Math.floor(Math.random() * 4); // 0: üst, 1: sağ, 2: alt, 3: sol
      let targetX = 0;
      let targetY = 0;

      const padding = 120;

      switch (side) {
        case 0: // Üst
          targetX = (Math.random() * (vw - padding * 2)) - (vw / 2) + padding;
          targetY = -(vh / 2) + padding;
          break;
        case 1: // Sağ
          targetX = (vw / 2) - padding;
          targetY = (Math.random() * (vh - padding * 2)) - (vh / 2) + padding;
          break;
        case 2: // Alt
          targetX = (Math.random() * (vw - padding * 2)) - (vw / 2) + padding;
          targetY = (vh / 2) - padding;
          break;
        case 3: // Sol
          targetX = -(vw / 2) + padding;
          targetY = (Math.random() * (vh - padding * 2)) - (vh / 2) + padding;
          break;
        default:
          break;
      }

      gsap.to(letterRef.current, {
        x: targetX,
        y: targetY,
        rotation: `+=${Math.random() * 360 - 180}`,
        duration: Math.random() * 6 + 6,
        ease: "none",
        onComplete: animateBounce,
      });
    };

    // Opaklık animasyonu (Pulse etkisi)
    const animateOpacity = () => {
      gsap.to(letterRef.current, {
        opacity: Math.random() * 0.15 + 0.1,
        duration: Math.random() * 3 + 2,
        ease: "sine.inOut",
        onComplete: animateOpacity,
      });
    };

    // Başlangıç durumu
    gsap.set(letterRef.current, {
      x: (Math.random() * window.innerWidth) - (window.innerWidth / 2),
      y: (Math.random() * window.innerHeight) - (window.innerHeight / 2),
      opacity: 0.15,
      scale: Math.random() * 0.3 + 0.8,
    });

    animateBounce();
    animateOpacity();
  }, []);

  return (
    <div ref={letterRef} className="floating-letter">
      {char}
    </div>
  );
};

export default FloatingLetter;
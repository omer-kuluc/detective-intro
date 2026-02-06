import React, { useLayoutEffect, useRef, useState } from 'react'; // useLayoutEffect ekledik
import { gsap } from 'gsap';
import FloatingLetter from './FloatingLetter';

const Password = () => {
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const inputRef = useRef(null);
  const guessMsgRef = useRef(null);
  const [message, setMessage] = useState('');

  useLayoutEffect(() => {
    // 1. Context oluştur: Tüm animasyonları bir grupta topla
    let ctx = gsap.context(() => {

      // Başlangıçta elemanları görünmez veya hazır konuma getir (Flaş çakmasını önler)
      gsap.set([phoneRef.current, guessMsgRef.current], { opacity: 0 });
      gsap.set(inputRef.current, { scale: 1, x: 0 });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      const updateSlot = (index, char) => {
        const slots = inputRef.current?.children;
        if (slots && slots[index]) {
          slots[index].innerText = char;
          gsap.fromTo(slots[index], { opacity: 0.5 }, { opacity: 1, duration: 0.2 });
        }
      };

      const clearSlots = () => {
        const slots = inputRef.current?.children;
        if (slots) Array.from(slots).forEach(s => s.innerText = '');
      };

      const setPassColor = (color) => {
        const slots = inputRef.current?.children;
        if (slots) gsap.to(slots, { color, duration: 0.2 });
      };

      const shakeInput = () => {
        gsap.to(inputRef.current, {
          x: 10, duration: 0.05, repeat: 5, yoyo: true,
          onComplete: () => gsap.set(inputRef.current, { x: 0 })
        });
      };

      // Telefonu yumuşakça göster (Timeline başlamadan hemen önce)
      tl.to(phoneRef.current, { opacity: 1, duration: 0.5 });

      // --- Faz 1: 221B ---
      tl.to({}, { duration: 1 })
        .call(() => updateSlot(0, '2')).to({}, { duration: 0.2 })
        .call(() => updateSlot(1, '2')).to({}, { duration: 0.2 })
        .call(() => updateSlot(2, '1')).to({}, { duration: 0.2 })
        .call(() => updateSlot(3, 'B'))
        .to({}, { duration: 0.5 })
        .call(() => {
          setPassColor('#ef4444');
          shakeInput();
          setMessage('2 guesses left');
        })
        .to(guessMsgRef.current, { opacity: 1, duration: 0.3 })
        .to({}, { duration: 1.5 })
        .to(guessMsgRef.current, { opacity: 0, duration: 0.3 })
        .call(() => { clearSlots(); setPassColor('#ffffff'); });

      // --- Faz 2: 1826 ---
      tl.to({}, { duration: 0.5 })
        .call(() => updateSlot(0, '1')).to({}, { duration: 0.2 })
        .call(() => updateSlot(1, '8')).to({}, { duration: 0.2 })
        .call(() => updateSlot(2, '2')).to({}, { duration: 0.2 })
        .call(() => updateSlot(3, '6'))
        .to({}, { duration: 0.5 })
        .call(() => {
          setPassColor('#ef4444');
          shakeInput();
          setMessage('1 guesses left');
        })
        .to(guessMsgRef.current, { opacity: 1, duration: 0.3 })
        .to({}, { duration: 1.5 })
        .to(guessMsgRef.current, { opacity: 0, duration: 0.3 })
        .call(() => { clearSlots(); setPassColor('#ffffff'); });

      // --- Faz 3: **** ---
      tl.to({}, { duration: 0.5 })
        .call(() => updateSlot(0, '*')).to({}, { duration: 0.2 })
        .call(() => updateSlot(1, '*')).to({}, { duration: 0.2 })
        .call(() => updateSlot(2, '*')).to({}, { duration: 0.2 })
        .call(() => updateSlot(3, '*'))
        .to({}, { duration: 0.5 })
        .call(() => {
          setPassColor('#22c55e');
          setMessage('UNLOCKED');
        })
        .to(guessMsgRef.current, { opacity: 1, color: '#22c55e', duration: 0.3 })
        .to(inputRef.current, { scale: 1.05, duration: 0.4 })
        .to({}, { duration: 2.5 })
        .to(phoneRef.current, { opacity: 0, duration: 0.8 })
        .call(() => {
          clearSlots();
          setPassColor('#ffffff');
          setMessage('');
          gsap.set(inputRef.current, { scale: 1, x: 0 });
          gsap.set(guessMsgRef.current, { color: '#ffffff' });
        })
        .to(phoneRef.current, { opacity: 1, duration: 0.8 });

    }, containerRef); // Scoped selection

    return () => ctx.revert(); // Bellek temizliği
  }, []);

  return (
    <div ref={containerRef} className="password-main-container flash-prevent">
      <div className="floating-letters-container">
        <FloatingLetter char="s" />
        <FloatingLetter char="h" />
        <FloatingLetter char="e" />
        <FloatingLetter char="r" />
      </div>

      <div ref={phoneRef} className="phone-body">
        <div className="phone-content">
          <div className="label-text">I AM</div>
          <div ref={inputRef} className="passcode-wrapper">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="passcode-slot"></div>
            ))}
          </div>
          <div className="label-text">LOCKED</div>
          <div ref={guessMsgRef} className="feedback-message">
            {message}
          </div>
        </div>
        <div className="phone-indicator" />
      </div>
      <div className="cinematic-vignette" />
    </div>
  );
};

export default Password;
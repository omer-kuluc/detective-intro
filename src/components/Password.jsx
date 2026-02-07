import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import FloatingLetter from './FloatingLetter';

const Password = () => {
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const inputRef = useRef(null);
  const guessMsgRef = useRef(null);
  const [message, setMessage] = useState('');

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. ADIM: Her şeyi daha en baştan (paint öncesi) görünmez ve hazır konuma çek
      gsap.set(containerRef.current, { visibility: "hidden", opacity: 0 });
      gsap.set(phoneRef.current, { opacity: 0, y: 30 });
      gsap.set(['.passcode-slot', '.label-text'], { opacity: 0 });
      gsap.set(inputRef.current, { scale: 1, x: 0 });

      // 2. ADIM: Sahneyi görünür yap ama içindekiler hala opacity 0
      gsap.set(containerRef.current, { visibility: "visible", opacity: 1 });

      // 3. ADIM: Giriş Animasyonu (Sadece 1 kere çalışır)
      const introTl = gsap.timeline();
      introTl.to(phoneRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" })
        .to('.label-text', { opacity: 1, duration: 0.8, stagger: 0.2 }, "-=0.8")
        .to('.passcode-slot', { opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.5");

      // 4. ADIM: Ana Döngü (Timeline)
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2, delay: 1 });

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

      // --- FAZLAR ---
      tl.to({}, { duration: 0.5 })
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

      tl.to({}, { duration: 0.5 })
        .call(() => updateSlot(0, '1')).to({}, { duration: 0.2 })
        .call(() => updateSlot(1, '8')).to({}, { duration: 0.2 })
        .call(() => updateSlot(2, '9')).to({}, { duration: 0.2 })
        .call(() => updateSlot(3, '5'))
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
        .to(inputRef.current, { scale: 1.1, duration: 0.4 })
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

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="password-main-container">
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
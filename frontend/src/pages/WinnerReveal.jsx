import React, { useState, useEffect, useRef } from 'react';
import NFTRevealCard from '../components/auction/NFTRevealCard';
import WinnerDetails from '../components/auction/WinnerDetails';

export default function WinnerReveal() {
  const confettiCanvasRef = useRef(null);
  const [revealState, setRevealState] = useState('loading'); // 'loading' | 'ready' | 'revealed'
  const [progress, setProgress] = useState(0);
  const [victoryBadgeVisible, setVictoryBadgeVisible] = useState(false);

  // Simulate unlocking progress bar
  useEffect(() => {
    const duration = 2000; // 2s progress load
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setRevealState('ready');
          }, 600);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Simple Canvas Confetti triggers when the card flips
  const handleReveal = () => {
    setRevealState('revealed');
    setTimeout(() => {
      setVictoryBadgeVisible(true);
      startConfetti();
    }, 400);
  };

  const startConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const colors = ['#D3A01E', '#F5BE3E', '#FFFFFF', '#1F1E26'];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.weight = Math.random() * 2 + 1;
        this.directionX = Math.random() * 3 - 1.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 5 - 2.5;
      }
      update() {
        this.y += this.weight;
        this.x += this.directionX;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup after 8 seconds
    setTimeout(() => {
      cancelAnimationFrame(animationId);
      particles = [];
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 8000);
  };

  return (
    <div className="relative pt-32 pb-section-gap flex flex-col items-center min-h-screen bg-background">
      {/* Confetti Canvas */}
      <canvas ref={confettiCanvasRef} className="pointer-events-none fixed inset-0 z-[100]" />

      {/* Cinematic Reveal Section */}
      <section className="w-full max-w-container-max px-margin-desktop flex flex-col items-center relative overflow-hidden">
        
        {/* Animated Victory Badge */}
        <div 
          className={`absolute top-10 right-10 z-20 animate-float transition-all duration-1000 ${
            victoryBadgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <div className="victory-badge bg-secondary text-on-secondary px-6 py-2 rounded-full font-label text-label-md flex items-center gap-2 font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px]">stars</span>
            VICTORY
          </div>
        </div>

        {/* Loading / Decrypting states */}
        {revealState === 'loading' && (
          <div className="my-32 text-center transition-opacity duration-500">
            <p className="font-mono text-mono-sm text-secondary uppercase tracking-[0.2em] mb-2 font-semibold animate-pulse">
              System Decrypting
            </p>
            <h2 className="font-headline text-headline-lg text-on-surface font-bold">
              Unlocking Digital Vault...
            </h2>
            <div className="w-64 h-[2px] bg-outline-variant/30 mx-auto mt-6 relative overflow-hidden rounded-full">
              <div 
                className="absolute inset-y-0 left-0 bg-secondary transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Reveal Card display area */}
        {revealState !== 'loading' && (
          <div className="w-full flex flex-col items-center transition-all duration-1000">
            {/* Flip card component */}
            <div className="mb-12">
              <NFTRevealCard onReveal={handleReveal} />
            </div>

            {/* Reveal status detail cards */}
            <div 
              className={`transition-all duration-1000 delay-500 ${
                revealState === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
              }`}
            >
              <WinnerDetails />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

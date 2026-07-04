import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PageContainer from '../components/layout/PageContainer';
import FeatureCard from '../components/cards/FeatureCard';
import StatCard from '../components/cards/StatCard';
import GoldButton from '../components/buttons/GoldButton';
import GhostButton from '../components/buttons/GhostButton';
import { MOCK_FEATURES } from '../data/features';
import { MOCK_STEPS } from '../data/steps';

export default function Landing() {
  const bgCanvasRef = useRef(null);
  const sphereCanvasRef = useRef(null);

  // Background gradient shader animation (simulated in 2D canvas for Vite portability)
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.clientHeight || window.innerHeight);

    let time = 0;

    const render = () => {
      time += 0.005;
      
      // Clear with solid background
      ctx.fillStyle = '#0E0E13';
      ctx.fillRect(0, 0, width, height);

      // Draw linear gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#17171F');
      gradient.addColorStop(1, '#0E0E13');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1.0;

      // Draw dynamic luxury waves
      ctx.strokeStyle = 'rgba(211, 160, 30, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 10) {
          const y = height * 0.5 + Math.sin(x * 0.003 + time + i * 0.5) * 80 * Math.cos(time * 0.5);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Add grain
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      for (let i = 0; i < 1000; i++) {
        const gx = Math.random() * width;
        const gy = Math.random() * height;
        ctx.fillRect(gx, gy, 1, 1);
      }

      animationId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || window.innerWidth;
      height = canvas.height = canvas.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 3D Wireframe brain sphere animation (simulated in 2D canvas for portability)
  useEffect(() => {
    const canvas = sphereCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = canvas.clientWidth || 500);
    let height = (canvas.height = canvas.clientHeight || 500);

    let angleX = 0;
    let angleY = 0;

    // Create 3D points on an icosahedron / sphere
    const points = [];
    const numPoints = 80;
    const radius = 120;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(-1 + (2 * i) / numPoints);
      const phi = Math.sqrt(numPoints * Math.PI) * theta;
      points.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.sin(theta) * Math.sin(phi),
        z: Math.cos(theta)
      });
    }

    // Blockchain ring points
    const ringPoints = [];
    const ringCount = 12;
    const ringRadius = 180;
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      ringPoints.push({
        x: Math.cos(angle),
        y: 0,
        z: Math.sin(angle)
      });
    }

    const project = (p, rotationX, rotationY) => {
      // Rotate Y
      let x1 = p.x * Math.cos(rotationY) - p.z * Math.sin(rotationY);
      let z1 = p.x * Math.sin(rotationY) + p.z * Math.cos(rotationY);

      // Rotate X
      let y2 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      let z2 = p.y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

      // Perspective projection
      const depth = 350;
      const scale = depth / (depth + z2 * radius);
      const xProjected = x1 * radius * scale + width / 2;
      const yProjected = y2 * radius * scale + height / 2;

      return { x: xProjected, y: yProjected, scale };
    };

    const projectRing = (p, rotationX, rotationY) => {
      // Rotate Y (opposite direction for ring)
      let x1 = p.x * Math.cos(-rotationY) - p.z * Math.sin(-rotationY);
      let z1 = p.x * Math.sin(-rotationY) + p.z * Math.cos(-rotationY);

      // Rotate X
      let y2 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      let z2 = p.y * Math.sin(rotationX) + z1 * Math.cos(rotationX);

      const depth = 350;
      const scale = depth / (depth + z2 * ringRadius);
      const xProjected = x1 * ringRadius * scale + width / 2;
      const yProjected = y2 * ringRadius * scale + height / 2;

      return { x: xProjected, y: yProjected, scale };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      angleY += 0.005;
      angleX += 0.002;

      // Draw connections for sphere (wireframe)
      ctx.strokeStyle = 'rgba(211, 160, 30, 0.2)';
      ctx.lineWidth = 0.5;
      const projected = points.map(p => project(p, angleX, angleY));

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dist = Math.hypot(projected[i].x - projected[j].x, projected[i].y - projected[j].y);
          if (dist < 45) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw points (neurons)
      projected.forEach(p => {
        ctx.fillStyle = '#D3A01E';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw blockchain ring (surrounding boxes)
      const projectedRing = ringPoints.map(p => projectRing(p, 0.5, angleY));
      projectedRing.forEach(p => {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(p.x - 3 * p.scale, p.y - 3 * p.scale, 6 * p.scale, 6 * p.scale);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10 * p.scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      animationId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth || 500;
      height = canvas.height = canvas.clientHeight || 500;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Dynamic Background Shader Canvas */}
      <canvas ref={bgCanvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none z-0" />

      {/* Navigation */}
      <Navbar variant="landing" />

      {/* Hero Header */}
      <header className="relative min-h-screen flex items-center pt-24 z-10">
        <PageContainer className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          <div className="lg:col-span-7 flex flex-col justify-center gap-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full w-fit">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              <span className="font-mono text-mono-sm text-secondary uppercase tracking-widest">
                Next-Gen Liquidity Layer
              </span>
            </div>
            
            <h1 className="font-display text-5xl md:text-display-lg text-white max-w-2xl leading-[1.05]">
              The AI Auction Strategist for <span className="text-secondary">Blind NFT Bundle</span> Auctions
            </h1>
            
            <p className="font-body text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
              Autonomous agents orchestrating high-value bundle auctions on-chain. Precision engineered for the next generation of digital assets.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/marketplace">
                <GoldButton className="px-10 py-5">
                  Marketplace
                  <span className="material-symbols-outlined">arrow_outward</span>
                </GoldButton>
              </Link>
              <Link to="/seller">
                <GhostButton variant="gold" className="px-10 py-5">
                  Sell NFT's
                </GhostButton>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[500px] flex items-center justify-center">
            {/* Spinning Wireframe Sphere Canvas */}
            <canvas ref={sphereCanvasRef} className="w-full max-w-[500px] aspect-square" />
          </div>
        </PageContainer>
      </header>

      {/* Features Grid Section */}
      <section className="py-section-gap bg-surface relative z-10" id="features">
        <PageContainer>
          <div className="flex flex-col gap-4 mb-20 text-center items-center">
            <h2 className="font-headline text-headline-lg text-on-surface">Architected for Precision</h2>
            <div className="w-24 h-1 bg-secondary rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_FEATURES.map((feature) => (
              <div 
                key={feature.id}
                className={feature.id === 'blitz-60' || feature.id === 'natural-interface' ? 'md:col-span-1.5' : ''}
              >
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Pipeline How It Works Section */}
      <section className="py-section-gap bg-surface-container-lowest relative z-10" id="how-it-works">
        <PageContainer>
          <h2 className="font-headline text-headline-lg text-on-surface text-center mb-24">
            The Execution Pipeline
          </h2>
          
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-12">
            {MOCK_STEPS.map((step, idx) => (
              <div key={idx} className="relative z-10 group cursor-default">
                <div className="mb-8 w-16 h-16 rounded-full border border-secondary flex items-center justify-center bg-surface-container transition-all group-hover:bg-secondary group-hover:text-on-secondary font-mono font-bold">
                  {step.step}
                </div>
                <h4 className="font-headline text-headline-md text-secondary mb-4">
                  {step.title}
                </h4>
                <p className="font-body text-body-md text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}

            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-16 right-16 h-px bg-outline-variant/30 -z-0">
              <div className="h-full bg-secondary w-0 group-hover:w-full transition-all duration-1000 ease-in-out"></div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-surface relative z-10" id="stats">
        <PageContainer className="grid grid-cols-1 md:grid-cols-3 gap-gutter text-center">
          <StatCard label="Total Value Flow" value="$2.4B+" />
          <StatCard label="Successful Events" value="60K+" showBorder />
          <StatCard label="Settlement Latency" value="0.2s" />
        </PageContainer>
      </section>

      {/* Footer */}
      <Footer variant="landing" />
    </div>
  );
}

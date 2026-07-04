import { useState, useEffect, useRef } from 'react';

export default function useAnimateOnView(options = { threshold: 0.1, triggerOnce: true }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(elementRef.current);
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current && !options.triggerOnce) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return [elementRef, isIntersecting];
}

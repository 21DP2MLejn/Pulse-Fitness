"use client";

import { useEffect } from 'react';

const GlobalLayout = ({ children }) => {
  useEffect(() => {
    const blob = document.getElementById("blob");

    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      // Calculate the position ensuring the blob stays within the viewport
      const x = Math.min(Math.max(0, clientX), innerWidth);
      const y = Math.min(Math.max(0, clientY), innerHeight);

      blob.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
          opacity: (x < 0 || x > innerWidth || y < 0 || y > innerHeight) ? 0 : 0.8,
        },
        { duration: 3000, fill: "forwards" }
      );
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <div id="blob"></div>
      <div id="blur"></div>
      <div style={{ position: 'relative', zIndex: 0 }}> 
        {children}
      </div>
      <style jsx>{`
        #blob {
          background-color: white;
          height: 34vmax;
          aspect-ratio: 1;
          position: fixed;
          left: 50%;
          top: 50%;
          translate: -50% -50%;
          border-radius: 50%;
          background: linear-gradient(to right, aquamarine, mediumpurple);
          animation: rotate 20s infinite;
          opacity: 0.8;
          z-index: -1;
        }

        #blur {
          height: 100%;
          width: 100%;
          position: absolute;
          z-index: -1;
          backdrop-filter: blur(12vmax);
        }

        body {
          margin: 0;
          overflow-x: hidden;
          background: none;
        }

        body.dark #blob {
          background: linear-gradient(to right, darkslateblue, darkcyan);
        }
      `}</style>
    </div>
  );
};

export default GlobalLayout;

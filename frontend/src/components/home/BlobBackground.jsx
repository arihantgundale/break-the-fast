import { useEffect, useRef } from 'react';

/**
 * Personio-style animated blob background.
 * Renders soft, morphing gradient blobs that float and pulse across the viewport.
 */
export default function BlobBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const blobs = containerRef.current?.querySelectorAll('.blob');
    if (!blobs) return;

    // Randomise starting positions slightly on mount
    blobs.forEach((blob) => {
      const rx = Math.random() * 30 - 15;
      const ry = Math.random() * 30 - 15;
      blob.style.setProperty('--rx', `${rx}px`);
      blob.style.setProperty('--ry', `${ry}px`);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Blob 1 — warm saffron, top-left */}
      <div className="blob blob-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-[#E67E22] to-[#F5B041]" />

      {/* Blob 2 — deep crimson, bottom-right */}
      <div className="blob blob-2 absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-[#C0392B] to-[#E74C3C]" />

      {/* Blob 3 — soft green, centre-right */}
      <div className="blob blob-3 absolute top-1/3 right-0 w-[450px] h-[450px] rounded-full opacity-20 blur-3xl bg-gradient-to-bl from-[#27AE60] to-[#58D68D]" />

      {/* Blob 4 — cream-gold, centre-left */}
      <div className="blob blob-4 absolute top-2/3 -left-20 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl bg-gradient-to-tr from-[#F39C12] to-[#FDEBD0]" />

      {/* Blob 5 — light saffron, top-centre */}
      <div className="blob blob-5 absolute -top-20 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full opacity-20 blur-3xl bg-gradient-to-b from-[#FAD7A0] to-[#E67E22]" />
    </div>
  );
}

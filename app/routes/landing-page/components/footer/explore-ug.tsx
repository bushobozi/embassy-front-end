import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa6";

export default function ExploreUG() {
  const videoId = "SJrIPSPuASU";
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [embedSrc, setEmbedSrc] = useState("");

  useEffect(() => {
    const origin = encodeURIComponent(window.location.origin);
    setEmbedSrc(
      `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${origin}`
    );
  }, [videoId]);

  const sendPlayerCommand = (command: "playVideo" | "pauseVideo") => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "*"
    );
  };

  const togglePlay = () => {
    sendPlayerCommand(isPlaying ? "pauseVideo" : "playVideo");
    setIsPlaying(!isPlaying);
  };

  return (
    <div id="explore-heading" className="max-w-7xl mx-auto py-2 pb-12 mt-16">
      <h2 className="text-5xl font-semibold mb-4 border-b pb-4 border-gray-200">
        Explore Uganda
      </h2>
      <div className="relative w-full pt-[56.25%] mt-4">
        {embedSrc ? (
          <iframe
            ref={iframeRef}
            title="Explore Uganda"
            src={embedSrc}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0 rounded-3xl"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full bg-transparent flex items-center justify-center text-gray-500">
            Loading video...
          </div>
        )}

        <button
          type="button"
          onClick={togglePlay}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="absolute cursor-pointer inset-0 flex items-center justify-center bg-transparent rounded-none hover:bg-transparent transition-colors"
        >
          <span className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 shadow-lg">
            {isPlaying ? (
              <FaPause className="text-2xl text-gray-800 cursor-pointer" />
            ) : (
              <FaPlay className="text-2xl text-gray-800 ml-0.5 cursor-pointer" />
            )}
          </span>
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-600 text-center">
        If the video doesn't play, open it directly:
        <a
          href={`https://www.youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:underline ml-1"
        >
          Watch on YouTube
        </a>
      </p>
    </div>
  );
}

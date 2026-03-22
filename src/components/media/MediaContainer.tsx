import { useRef, useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { AnnotationCanvas } from "../canvas/AnnotationCanvas";
import { Upload, Play, Pause } from "lucide-react";

export const MediaContainer = () => {
  const { mediaUrl, mediaType, setMedia } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isPlaying, setIsPlaying] = useState(false);

  // Measure the intrinsic vs rendered size of the media container
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect(); // prevents memory leaks
  }, [mediaUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    setMedia(url, type);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  //  UPLOAD STATE
  if (!mediaUrl) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-2xl h-96 border-2 border-dashed border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-300 font-medium mb-2">
          Drag & drop or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Supports Image or Video (.mp4)
        </p>
        <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md cursor-pointer transition-colors">
          Select File
          <input
            type="file"
            className="hidden"
            accept="image/*,video/mp4"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    );
  }

  //  LOADED MEDIA STATE
  return (
    <div className="flex flex-col items-center w-full max-w-5xl">
      {/* The Relative Wrapper - This ensures the Canvas bounds match the Media bounds exactly */}
      <div
        ref={containerRef}
        className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-700 bg-black flex items-center justify-center"
        style={{ maxHeight: "75vh" }}
      >
        {mediaType === "video" ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            className="max-h-full max-w-full object-contain"
            onEnded={() => setIsPlaying(false)}
            //  disable native controls because the Konva canvas covers them
          />
        ) : (
          <img
            src={mediaUrl}
            alt="Uploaded media"
            className="max-h-full max-w-full object-contain"
          />
        )}

        {/* The Glass Pane Overlay */}
        {dimensions.width > 0 && (
          <AnnotationCanvas
            width={dimensions.width}
            height={dimensions.height}
          />
        )}
      </div>

      {/* Custom Video Controls */}
      {mediaType === "video" && (
        <div className="mt-6 flex items-center gap-4 bg-gray-800 px-6 py-3 rounded-full border border-gray-700">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors font-medium"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          <span className="text-sm text-gray-400">
            Annotations will remain anchored during playback
          </span>
        </div>
      )}
    </div>
  );
};

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
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: number | undefined;

    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);

      // debounce to avoid rapid state updates during resizing
      timeoutId = setTimeout(() => {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }, 100);
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [mediaUrl]);

  const processFile = (file: File) => {
    if (!file) return;

    // file validation - only allow images and videos
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload a valid image or video file.");
      return;
    }

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    setMedia(url, type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("video/") ? "video" : "image";
    setMedia(url, type);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); //  Prevents the browser from opening the file in a new tab
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    // Grab the file from the drag event instead of the input element
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full max-w-2xl h-96 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out ${
          isDragging
            ? "border-blue-500 bg-blue-500/10 scale-[1.02]"
            : "border-gray-600 bg-gray-800/50 hover:bg-gray-800"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-300 font-medium mb-2">
          {isDragging ? "Drop file here!" : "Drag & drop or click to upload"}
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
        </div>
      )}
    </div>
  );
};

"use client";

import { Play } from "lucide-react";

export default function VideoPlayer({ url }: { url: string }) {
  // Check if it's a YouTube URL
  const isYoutube = url.includes("youtube.com") || url.includes("youtu.be");
  
  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (isYoutube) {
    const videoId = getYoutubeEmbed(url);
    return (
      <div className="aspect-video w-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full bg-black flex items-center justify-center">
      <video 
        controls 
        className="w-full h-full max-h-[600px]"
        src={url}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

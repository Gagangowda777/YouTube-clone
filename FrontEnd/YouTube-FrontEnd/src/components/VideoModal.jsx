import { useState } from 'react';

const VideoModal = ({ video, onClose }) => {
  if (!video) return null;

  const getEmbedUrl = (url) => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      if (hostname.includes('youtube.com')) {
        const videoId = parsed.searchParams.get('v');
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      if (hostname.includes('youtu.be')) {
        const videoId = parsed.pathname.slice(1);
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
      }
      return url;
    } catch (err) {
      return url;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{video.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            x
          </button>
        </div>
        <div className="p-4">
          <div className="aspect-video">
            <iframe
              title={video.title}
              src={getEmbedUrl(video.videoUrl)}
              className="w-full h-full border-0 rounded"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{video.channelName}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {video.category || 'Other'}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{video.description || 'No description provided.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
              <span>{video.views ?? 0} views</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
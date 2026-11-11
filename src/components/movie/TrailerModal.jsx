import { useState } from "react";
import Modal from "../common/Modal";

const TrailerModal = ({ isOpen, onClose, videos = [], title = "Trailer" }) => {
  const [activeKey, setActiveKey] = useState(null);

  const defaultTrailer =
    videos?.find(
      (v) =>
        v.site === "YouTube" &&
        (v.type === "Trailer" || v.name?.toLowerCase().includes("trailer")),
    ) ||
    videos?.find((v) => v.site === "YouTube") ||
    videos?.[0];

  const selectedKey = activeKey || defaultTrailer?.key || null;
  const youtubeVideos = videos?.filter((v) => v.site === "YouTube") || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={title}>
      <div className="bg-black rounded-b-2xl overflow-hidden">
        {selectedKey ? (
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${selectedKey}?autoplay=1&rel=0&modestbranding=1`}
              title="Movie Trailer"
              className="absolute inset-0 w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="py-20 text-center px-4">
            <p className="text-gray-400 text-sm">
              Hiện chưa có video trailer chính thức trên hệ thống cho phim này.
            </p>
          </div>
        )}

        {/* Danh sách các video khác (nếu có nhiều hơn 1) */}
        {youtubeVideos.length > 1 && (
          <div className="p-3 bg-gray-900 border-t border-gray-800 flex gap-2 overflow-x-auto">
            {youtubeVideos.slice(0, 5).map((v) => (
              <button
                key={v.id || v.key}
                onClick={() => setActiveKey(v.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedKey === v.key
                    ? "bg-primary text-white font-bold"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {v.type || "Clip"}: {v.name || "Video"}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TrailerModal;

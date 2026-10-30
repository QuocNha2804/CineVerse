import Modal from "../common/Modal";

const TrailerModal = ({ isOpen, onClose, videos }) => {
  const trailer =
    videos?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    videos?.find((v) => v.site === "YouTube");
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      {trailer ? (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="p-10 text-center text-gray-500">
          Không có trailer cho phim này.
        </p>
      )}
    </Modal>
  );
};
export default TrailerModal;

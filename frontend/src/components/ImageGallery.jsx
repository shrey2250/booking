import { useState } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, hotelName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index) => {
    setSelectedImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="image-gallery-placeholder">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=400&fit=crop"
          alt={`${hotelName} - No images available`}
          className="main-image"
        />
        <div className="no-images-message">No additional images available</div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div className="main-image-container">
        <img
          src={images[selectedImage]}
          alt={`${hotelName} - Image ${selectedImage + 1}`}
          className="main-image"
          onClick={() => openModal(selectedImage)}
        />
        <button
          className="expand-btn"
          onClick={() => openModal(selectedImage)}
          aria-label="View full size image"
        >
          🔍
        </button>
        {images.length > 1 && (
          <>
            <button
              className="nav-btn nav-btn-left"
              onClick={prevImage}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="nav-btn nav-btn-right"
              onClick={nextImage}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
        <div className="image-counter">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="thumbnail-gallery">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${hotelName} - Thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal for Full Size Images */}
      {isModalOpen && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal"
              onClick={closeModal}
              aria-label="Close image gallery"
            >
              ×
            </button>
            <img
              src={images[selectedImage]}
              alt={`${hotelName} - Full size ${selectedImage + 1}`}
              className="modal-image"
            />
            {images.length > 1 && (
              <>
                <button
                  className="modal-nav modal-nav-left"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="modal-nav modal-nav-right"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
            <div className="modal-counter">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
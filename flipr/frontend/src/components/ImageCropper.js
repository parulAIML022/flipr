import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import './ImageCropper.css';

const ImageCropper = ({ imageSrc, onCropComplete, onClose, aspectRatio = 450 / 350 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [initialCropComplete, setInitialCropComplete] = useState(false);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setInitialCropComplete(true);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to exact dimensions (450x350)
    const outputWidth = 450;
    const outputHeight = 350;
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw the cropped image and scale it to exact dimensions
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth,
      outputHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCrop = async () => {
    if (!croppedAreaPixels || !initialCropComplete) {
      alert('Please wait for the image to load and adjust the crop area');
      return;
    }
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again.');
    }
  };

  return (
    <div className="image-cropper-overlay">
      <div className="image-cropper-container">
        <div className="image-cropper-header">
          <h3>Crop Image</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="image-cropper-content">
          <div className="crop-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onCropComplete={onCropCompleteCallback}
            />
          </div>
          <div className="crop-controls">
            <div className="zoom-control">
              <label>Zoom:</label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="image-cropper-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCrop}>Crop & Save</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;


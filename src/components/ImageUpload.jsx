// src/components/ImageUpload.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveImageURL, fetchImages } from "../firebase";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [fetchedImages, setFetchedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dm23icoaz/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "ml_default";

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      setLoading(true);
      const response = await axios.post(CLOUDINARY_URL, formData);
      const uploadedURL = response.data.secure_url;

      console.log("Uploaded URL:", uploadedURL);

      await saveImageURL(uploadedURL);
      alert("Image uploaded and saved to Firestore successfully!");

      setPreview("");
      setImage(null);
      loadImages();
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      alert("Failed to upload image. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      setLoading(true);
      const images = await fetchImages();
      setFetchedImages(images);
    } catch (error) {
      console.error("Error fetching images:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleImageClick = (url) => {
    setZoomedImage(url);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload and Fetch Images</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "200px", marginTop: "10px", borderRadius: "5px" }}
        />
      )}
      <button
        onClick={handleUpload}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px 20px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>
      <div>
        <h3>Fetched Images:</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {fetchedImages.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Fetched ${index}`}
              style={{
                width: "150px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(url)}
            />
          ))}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "1000",
          }}
        >
          <div style={{ position: "relative", textAlign: "center" }}>
            {/* Close Button */}
            <button
              onClick={closeZoom}
              style={{
                position: "absolute",
                top: "10px",
                right: "25px",
                background: "red",
                color: "white",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </button>

            {/* Zoomed Image */}
            <img
              src={zoomedImage}
              alt="Zoomed"
              style={{
                maxWidth: "90%",
                maxHeight: "80vh",
                borderRadius: "10px",
              }}
            />

            {/* Download Button */}
            <a
              href={zoomedImage}
              download={`downloaded-image-${Date.now()}.jpg`}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              }}
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

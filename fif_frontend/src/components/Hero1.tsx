"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon } from "lucide-react";

export default function Hero1() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, token, logout } = useAuth();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userName = user?.firstName || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    
    if (uploadedFiles.length > 0) {
      // Validate file sizes (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const invalidFiles = uploadedFiles.filter(file => file.size > maxSize);
      
      if (invalidFiles.length > 0) {
        toast.error(`Some images exceed 5MB limit. Please select smaller images.`);
        // Clear the input
        e.target.value = "";
        return;
      }
      
      // Add new files to existing ones
      const newFiles = [...files, ...uploadedFiles];
      setFiles(newFiles);
      
      // Create previews for all images
      const newPreviews = uploadedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const fetchLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported!");
      setLoadingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
        toast.success("Location detected successfully!");
      },
      () => {
        toast.error("Unable to fetch location!");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (files.length === 0 || !description || !location) {
      toast.error("Please upload at least one image, add a description, and detect location.");
      return;
    }

    if (!token) {
      toast.error("Please login to submit a complaint.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      
      // Append all images
      files.forEach((file) => {
        formData.append("images", file);
      });
      
      formData.append("description", description);
      formData.append("lat", String(location.lat));
      formData.append("lng", String(location.lng));

      const API_URL = import.meta.env.VITE_BACKEND_API_URL;
      const res = await fetch(`${API_URL}/api/complaints/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Complaint submitted successfully!");
        // Reset form
        setFiles([]);
        setImagePreviews([]);
        setDescription("");
        setLocation(null);
        // Clear file input
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(data.message || "Failed to submit complaint. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 pt-20 flex justify-center relative transition-colors">
      <button
  onClick={handleLogout}
  className="absolute top-6 right-6 w-32 px-6 py-3
             bg-black dark:bg-white
             text-white dark:text-black
             rounded-xl
             hover:bg-zinc-800 dark:hover:bg-zinc-200
             transition font-medium text-lg
             text-center"
>
  Logout
</button>

      
       {/* Theme Toggle Button */}
      <button
  onClick={toggleTheme}
  type="button"
  aria-label="Toggle theme"
  className="
    absolute top-6 right-40
    h-13 w-13
    flex items-center justify-center
    rounded-full
    bg-black text-white
    dark:bg-white dark:text-black
    shadow-md
    hover:scale-105 transition
    z-50
  "
>
  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
</button>
      
      <div className="w-full max-w-5xl relative">

        {/* Title */}
        <h1
          style={{ fontFamily: "'Caveat Brush', cursive" }}
          className="text-6xl text-center mb-12 text-black dark:text-white"
        >
          Report Public Issues Instantly
        </h1>

        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Left Box — Image Upload */}
          <div className="border-2 border-dashed border-black/40 dark:border-white/30 rounded-2xl h-[420px] flex flex-col p-6">
            <div className="flex-1 overflow-y-auto">
              {imagePreviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        type="button"
                      >
                        ×
                      </button>
                      <span className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-black/40 dark:text-white/40 text-xl">
                  Upload Images
                </div>
              )}
            </div>

            <label className="cursor-pointer mt-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="bg-white dark:bg-black border border-black dark:border-white px-6 py-3 rounded-xl text-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition text-lg">
                {imagePreviews.length > 0 ? "Add More Images" : "Choose Images"}
              </div>
            </label>
            {imagePreviews.length > 0 && (
              <p className="text-xs text-center mt-2 text-black/60 dark:text-white/60">
                {imagePreviews.length} image{imagePreviews.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Middle Box — Description */}
          <div className="border-2 border-dashed border-black/40 dark:border-white/30 rounded-2xl h-[420px] p-6">
            <p className="font-semibold mb-4 text-xl text-black dark:text-white">What's the Issue?</p>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue here..."
              className="w-full h-full bg-transparent outline-none resize-none placeholder-black/40 dark:placeholder-white/40 text-black dark:text-white text-lg"
            />
          </div>

          {/* Right Column — Buttons */}
          <div className="flex flex-col justify-center gap-6">

            {userName && (
              <p
                style={{ fontFamily: "'Caveat Brush', cursive" }}
                className="text-center text-3xl text-black dark:text-white mb-2"
              >
                Welcome {userName}!
              </p>
            )}

            <button
              onClick={fetchLocation}
              className="border border-black dark:border-white px-6 py-3 rounded-xl text-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
            >
              {loadingLocation ? "Locating..." : location ? "📍 Location Saved" : "Auto Detect"}
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="border border-black dark:border-white px-6 py-3 rounded-xl text-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

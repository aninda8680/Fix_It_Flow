"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon } from "lucide-react";

export default function Hero1() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const userName = user?.firstName || "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setImagePreview(URL.createObjectURL(uploaded));
    }
  };

  const fetchLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert("Geolocation not supported!");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoadingLocation(false);
      },
      () => {
        alert("Unable to fetch location!");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!file || !description || !location) {
      alert("Please complete all steps.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("lat", String(location.lat));
    formData.append("lng", String(location.lng));

    const res = await fetch("/api/complaints/create", {
      method: "POST",
      body: formData,
    });

    if (res.ok) alert("Submitted successfully!");
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
          <div className="border-2 border-dashed border-black/40 dark:border-white/30 rounded-2xl h-[420px] flex flex-col justify-between p-6">
            <div className="flex-1 flex items-center justify-center text-black/40 dark:text-white/40 text-xl">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                "Upload Image"
              )}
            </div>

            <label className="cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="mt-4 bg-white dark:bg-black border border-black dark:border-white px-6 py-3 rounded-xl text-center hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition text-lg">
                Choose Files
              </div>
            </label>
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
              className="border border-black dark:border-white px-6 py-3 rounded-xl text-xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition"
            >
              Submit Complaint
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

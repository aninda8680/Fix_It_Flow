import {
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
  Image,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import { launchCamera } from "react-native-image-picker";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, X, Send, ImagePlus, AlertCircle, MapPin } from "lucide-react-native";
import api from "../services/api";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import BlurHeader from "../components/BlurHeader";


export default function Home1Camera({ navigation }: any) {
  const [images, setImages] = useState<any[]>([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  

  const toggleProblem = (id: string) => {
    setSelectedProblems((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };


  const requestCameraPermission = async () => {
    if (Platform.OS !== "android") return true;

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "Camera Permission",
        message: "App needs access to your camera to report issues",
        buttonPositive: "OK",
        buttonNegative: "Cancel",
      }
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const openCamera = async () => {
    if (images.length >= 6) {
      Alert.alert("Limit reached", "Maximum 6 images allowed");
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await launchCamera({
      mediaType: "photo",
      quality: 0.7,
      saveToPhotos: true,
    });

    if (result?.assets?.length) {
      setImages((prev) => [...prev, result.assets![0]]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitComplaint = async () => {
    if (images.length === 0) {
      Alert.alert("Missing Info", "Please capture at least one photo of the issue.");
      return;
    }
    if (selectedProblems.length === 0) {
      Alert.alert("Missing Info", "Please select at least one problem type.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Missing Info", "Please enter a short description of the issue.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // Hardcoded location as per original logic
      const lat = "22.5726";
      const lng = "88.3639";

      const formData = new FormData();

      images.forEach((img: any, index: number) => {
        formData.append("images", {
          uri: img.uri,
          type: img.type || "image/jpeg",
          name: `photo_${index}.jpg`,
        } as any);
      });

      formData.append("description", description);
      formData.append("problemTypes", JSON.stringify(selectedProblems));

      formData.append("lat", lat);
      formData.append("lng", lng);

      const res = await api.post(
        "/api/complaints/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Success", "Complaint submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            setDescription("");
            setImages([]);
            setSelectedProblems([]); // ✅ reset multi-select
          },
        },
      ]);

      setDescription("");
      setImages([]);
      setSelectedProblems([]);

    } catch (err: any) {
      console.log("❌ Complaint Error:", err?.response?.data || err.message);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Submission failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Ambient Background Gradient */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300 }}>
        <Svg height="100%" width="100%" style={{ opacity: 1 }}>
          <Defs>
            <RadialGradient id="grad" cx="50%" cy="0%" rx="80%" ry="80%" fx="50%" fy="0%" gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#ffffffff" stopOpacity="0.4" />
              <Stop offset="1" stopColor="#000000" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Fixed Haze Overlay */}
<BlurHeader scrollY={scrollY} height={100} />

        <Animated.ScrollView 
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        >

          {/* Header */}
          <View style={{ marginBottom: 32, marginTop: 30 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <View style={{ width: 4, height: 28, backgroundColor: "#3b82f6", borderRadius: 2, marginRight: 12 }} />
              <Text style={{ color: "#fff", fontSize: 32, fontWeight: "700", letterSpacing: 0.5 }}>Report Issue</Text>
            </View>
            <Text style={{ color: "#a1a1aa", fontSize: 16, lineHeight: 24, marginLeft: 16 }}>
              Help us fix the city. Capture photos and describe the problem below.
            </Text>
          </View>

          {/* Photos Section */}
          <View style={{ marginBottom: 36 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ImagePlus size={20} color="#3b82f6" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Evidence</Text>
              </View>
              <View style={{ backgroundColor: "#27272a", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ color: "#a1a1aa", fontSize: 12, fontWeight: "600" }}>{images.length}/6 PHOTOS</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8 }}>
              {images.map((img, i) => (
                <View key={i} style={{ width: "33.33%", padding: 8 }}>
                  <View style={{
                    position: "relative",
                    aspectRatio: 1,
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#3f3f46",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5
                  }}>
                    <Image source={{ uri: img.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                    <TouchableOpacity
                      onPress={() => removeImage(i)}
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        borderRadius: 20,
                        padding: 6,
                      }}
                    >
                      <X size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {images.length < 6 && (
                <View style={{ width: "33.33%", padding: 8 }}>
                  <TouchableOpacity
                    onPress={openCamera}
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      borderRadius: 16,
                      backgroundColor: "#18181b",
                      borderWidth: 2,
                      borderColor: "#3f3f46",
                      justifyContent: "center",
                      alignItems: "center",
                      borderStyle: 'dashed'
                    }}
                  >
                    <Camera size={28} color="#71717a" />
                    <Text style={{ color: "#71717a", fontSize: 11, marginTop: 8, fontWeight: "600" }}>ADD PHOTO</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Problem Type Selector */}
          <View style={{ marginBottom: 36 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <MapPin size={20} color="#3b82f6" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Problem Type</Text>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: -6 }}>
              {[
                { id: "potholes", label: "Potholes" },
                { id: "broken_lamp", label: "Broken Lamp" },
                { id: "garbage_dump", label: "Garbage Dump" },
                { id: "water_logging", label: "Water Logging" },
                { id: "drainage_block", label: "Drainage" },
                { id: "street_light", label: "Street Light" },
              ].map((problem) => {
                const isSelected = (selectedProblems || []).includes(problem.id);
                return (
                  <TouchableOpacity
                    key={problem.id}
                    onPress={() => toggleProblem(problem.id)}
                    activeOpacity={0.7}
                    style={{
                      width: "31%",
                      marginHorizontal: "1.1%",
                      marginBottom: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 4,
                      borderRadius: 100,
                      borderWidth: 1,
                      borderStyle: "dashed",
                      borderColor: isSelected ? "#3b82f6" : "#3f3f46",
                      backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : "transparent",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? "#fff" : "#a1a1aa",
                        fontSize: 11,
                        fontWeight: isSelected ? "700" : "500",
                        textAlign: "center"
                      }}
                      numberOfLines={1}
                    >
                      {problem.label.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description Section */}
          <View style={{ marginBottom: 26 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <AlertCircle size={20} color="#3b82f6" style={{ marginRight: 8 }} />
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "600" }}>Description</Text>
            </View>

            <View style={{
              backgroundColor: "#18181b",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: focusedInput ? "#3b82f6" : "#27272a",
              padding: 4
            }}>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Write a detailed description of the issue here..."
                placeholderTextColor="#52525b"
                multiline
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                style={{
                  color: "#fff",
                  minHeight: 140,
                  padding: 16,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlignVertical: "top"
                }}
              />
            </View>
          </View>


          {/* Submit Button */}
          <TouchableOpacity
            onPress={submitComplaint}
            disabled={loading}
            style={{
              backgroundColor: "#3b82f6",
              paddingVertical: 18,
              borderRadius: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
              shadowColor: "#3b82f6",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700", marginRight: 10, letterSpacing: 0.5 }}>Submit Report</Text>
                <Send size={22} color="#fff" strokeWidth={2.5} />
              </>
            )}
          </TouchableOpacity>
          <View style={{ marginBottom: 26 }}></View>

        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

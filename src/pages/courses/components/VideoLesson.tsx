import React, { useState, useEffect, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  UploadCloud,
  FileVideo,
  Loader2,
  CheckCircle2,
  X,
  Clock,
  AlertCircle,
  Play,
  Upload,
  Video,
  MonitorPlay,
  Sparkles,
  Check,
  XCircle,
  Info
} from "lucide-react";
import {
  uploadVideo,
  updateVideo,
} from "../../../store/slices/vedio";
import axiosInstance from "../../../services/axiosConfig";

// Fixed interface to match your store structure
interface RootState {
  vedio: {
    loading: boolean;
    error: string | null;
    data: any;
  };
}

// Fixed props interface to include fileId
type VideoLessonProps = {
  lessonId: string;
  videoId?: string;
  fileId?: string; // Added this missing prop
  onClose: () => void;
  onSaveSuccess?: (data: any) => void;
};

const sourcePlatforms = [
  { value: "videocypher", label: "VdoCipher", icon: MonitorPlay },
  { value: "youtube", label: "YouTube", icon: Play },
];

// Enhanced popup component with better animations
const EnhancedPopup: React.FC<{
  isVisible: boolean;
  message: string;
  type: string;
  onClose: () => void;
  autoClose?: boolean;
}> = ({ isVisible, message, type, onClose, autoClose = true }) => {
  useEffect(() => {
    if (isVisible && autoClose && type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, type, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800";
      case "error":
        return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800";
      case "warning":
        return "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800";
      case "info":
        return "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0  bg-transparent backdrop-blur-xs transition-opacity flex items-center justify-center z-50 p-4">
      <div className={`max-w-md w-full rounded-xl border-2 p-6 max-h-[700px] overflow-scroll shadow-xl transform transition-all duration-300 scale-100 ${getTypeStyles()}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {type === "success" && (
          <div className="mt-4 bg-white bg-opacity-60 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-green-700">
              <Clock className="w-4 h-4" />
              <span>Processing will continue in the background</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Upload progress component
const UploadProgress: React.FC<{
  isVisible: boolean;
  progress: number;
  fileName: string;
  stage: string;
}> = ({ isVisible, progress, fileName, stage }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xs transition-opacity flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
            <Upload className="w-8 h-8 text-white animate-pulse" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Uploading to VdoCipher
          </h3>
          
          <p className="text-sm text-gray-600 mb-6">
            {fileName}
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>{stage}</span>
            <span>{progress}%</span>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Sparkles className="w-4 h-4" />
              <span>This may take a few minutes depending on file size</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoLesson: React.FC<VideoLessonProps> = ({
  lessonId,
  videoId,
  fileId,
  onClose,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.vedio
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    sourcePlatform: "",
    file: null as File | null,
    videoId: "",
    secureUrl: "",
    embedUrl: "",
    originalUrl: "",
    youtubeUrl: "",
    thumbnail: "", // Added for VdoCipher
    quality: "auto", // Added for VdoCipher
    status: "", // Added for VdoCipher
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [popup, setPopup] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const [uploadProgress, setUploadProgress] = useState({
    isVisible: false,
    progress: 0,
    fileName: "",
    stage: "Preparing upload...",
  });

  // Mock upload progress simulation
  const simulateUpload = (fileName: string) => {
    setUploadProgress({
      isVisible: true,
      progress: 0,
      fileName,
      stage: "Preparing upload...",
    });

    let progress = 0;
    const stages = [
      "Preparing upload...",
      "Uploading to VdoCipher...",
      "Processing video...",
      "Generating thumbnails...",
      "Finalizing...",
    ];

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(prev => ({ ...prev, isVisible: false }));
          showSuccessMessage();
        }, 1000);
      }

      const stageIndex = Math.floor((progress / 100) * stages.length);
      setUploadProgress({
        isVisible: true,
        progress: Math.min(progress, 100),
        fileName,
        stage: stages[Math.min(stageIndex, stages.length - 1)],
      });
    }, 500);
  };

  const showSuccessMessage = () => {
    setPopup({
      isVisible: true,
      message: "Video uploaded successfully! 🎉 Your video is now being processed by VdoCipher. You can check back in a few minutes to see the processed video with optimized streaming quality.",
      type: "success",
    });
  };

  // Enhanced getData function to handle VdoCipher data structure
  const getData = async () => {
    try {
      setIsEditMode(true);
      const response = await axiosInstance.get(`/video/${fileId}`);
      const videoData = response.data.data;
      
      setForm({
        title: videoData.title || "",
        description: videoData.description || "",
        sourcePlatform: videoData.sourcePlatform || "",
        file: null,
        videoId: videoData.videoId || "", // VdoCipher video ID
        secureUrl: videoData.secureUrl || "",
        embedUrl: videoData.secureUrl || "", // Use secureUrl for embed
        originalUrl: videoData.secureUrl || "",
        youtubeUrl: videoData.youtubeUrl || "",
        thumbnail: videoData.thumbnail || "",
        quality: videoData.quality || "auto",
        status: videoData.status || "",
      });
      
      console.log("Fetched VdoCipher video data:", videoData);
    } catch (error) {
      console.error("Error fetching video data:", error);
      setPopup({
        isVisible: true,
        message: "Failed to fetch video data",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (fileId) {
      getData();
    }
  }, [fileId]);

  useEffect(() => {
    if (isEditMode && data && !loading && !error) {
      setForm({
        title: data.title || "",
        description: data.description || "",
        sourcePlatform: data.sourcePlatform || "",
        file: null,
        videoId: data.videoId || "",
        secureUrl: data.secureUrl || "",
        embedUrl: data.embedUrl || data.secureUrl || "",
        originalUrl: data.originalUrl || data.secureUrl || "",
        youtubeUrl: data.youtubeUrl || "",
        thumbnail: data.thumbnail || "",
        quality: data.quality || "auto",
        status: data.status || "",
      });
    }
  }, [data, isEditMode, loading, error]);

  useEffect(() => {
    if (!loading && (data || error)) {
      if (data && !error) {
        if (onSaveSuccess) onSaveSuccess(data);
      } else if (error) {
        setPopup({
          isVisible: true,
          message: `Failed to ${isEditMode ? "update" : "upload"} video: ${error}`,
          type: "error",
        });
      }
    }
  }, [data, error, loading, isEditMode, onSaveSuccess]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setPopup({
        isVisible: true,
        message: "Please enter a video title.",
        type: "error",
      });
      return;
    }
    
    if (!form.sourcePlatform) {
      setPopup({
        isVisible: true,
        message: "Please select a source platform.",
        type: "error",
      });
      return;
    }

    // Enhanced validation for VdoCipher and YouTube
    if (form.sourcePlatform === "youtube") {
      if (!form.youtubeUrl.trim()) {
        setPopup({
          isVisible: true,
          message: "Please enter a YouTube URL.",
          type: "error",
        });
        return;
      }
      if (!isValidYouTubeUrl(form.youtubeUrl)) {
        setPopup({
          isVisible: true,
          message: "Please enter a valid YouTube URL.",
          type: "error",
        });
        return;
      }
    } else if (form.sourcePlatform === "videocypher") {
      // For new uploads, file is required
      if (!isEditMode && !form.file) {
        setPopup({
          isVisible: true,
          message: "Please select a video file to upload.",
          type: "error",
        });
        return;
      }
      // For updates, file is optional (only if user wants to replace video)
    }

    try {
      let response;
      
      // Show upload progress for VdoCipher videos
      if (form.sourcePlatform === "videocypher" && form.file) {
        simulateUpload(form.file.name);
      }
      
      if (isEditMode && (fileId || videoId)) {
        // For VdoCipher updates, we need to use the correct ID
        const updateId = fileId || videoId;
        
        // Show confirmation if replacing video file
        if (form.file && form.sourcePlatform === "videocypher") {
          const confirmReplace = window.confirm(
            `Are you sure you want to replace the current video with "${form.file.name}"? This action cannot be undone.`
          );
          if (!confirmReplace) {
            return;
          }
        }
        
        response = await dispatch(
          updateVideo({
            videoId: updateId!, // Use fileId for VdoCipher updates
            file: form.sourcePlatform === "youtube" ? null : form.file!,
            lessonId,
            sourcePlatform: form.sourcePlatform,
            title: form.title,
            description: form.description,
            youtubeUrl: form.sourcePlatform === "youtube" ? form.youtubeUrl : undefined,
            // Include VdoCipher specific fields if updating VdoCipher video
            ...(form.sourcePlatform === "videocypher" && {
              quality: form.quality,
              thumbnail: form.thumbnail,
              replaceVideo: !!form.file, // Flag to indicate video replacement
            }),
            accessToken: "",
            refreshToken: "",
          }) as any
        );
      } else {
        response = await dispatch(
          uploadVideo({
            file: form.sourcePlatform === "youtube" ? null : form.file!,
            lessonId,
            sourcePlatform: form.sourcePlatform,
            title: form.title,
            description: form.description,
            youtubeUrl: form.sourcePlatform === "youtube" ? form.youtubeUrl : undefined,
            // Include VdoCipher specific fields if uploading to VdoCipher
            ...(form.sourcePlatform === "videocypher" && {
              quality: form.quality || "auto",
            }),
            accessToken: "",
            refreshToken: "",
          }) as any
        );
      }
      
      console.log("Video operation response:", response);
      
      // For YouTube, show immediate success without progress
      if (form.sourcePlatform === "youtube") {
        if (response.payload?.success) {
          setPopup({
            isVisible: true,
            message: "YouTube video linked successfully! 🎬 Your video is now available for streaming.",
            type: "success",
          });
          // Close after a short delay to show success message
          setTimeout(() => {
            handleClose();
          }, 1500);
        } else {
          setPopup({
            isVisible: true,
            message: `Failed to ${isEditMode ? "update" : "link"} YouTube video: ${
              response.payload?.message || "Unknown error"
            }`,
            type: "error",
          });
        }
      } else {
        // For VdoCipher, the success message is shown by showSuccessMessage after upload simulation
        if (!response.payload?.success) {
          setUploadProgress(prev => ({ ...prev, isVisible: false }));
          setPopup({
            isVisible: true,
            message: `Failed to ${isEditMode ? "update" : "upload"} video: ${
              response.payload?.message || "Unknown error"
            }`,
            type: "error",
          });
        }
      }
    } catch (error: unknown) {
      console.error("Error saving video:", error);
      setUploadProgress(prev => ({ ...prev, isVisible: false }));
      setPopup({
        isVisible: true,
        message: `Failed to ${isEditMode ? "update" : "upload"} video: ${
          error instanceof Error ? error.message : "Network error"
        }`,
        type: "error",
      });
    }
  };

  const handleClose = () => {
    setPopup({ isVisible: false, message: "", type: "" });
    onClose();
  };

  // Enhanced render function to show VdoCipher status
  const renderVdoCipherInfo = () => {
    if (form.sourcePlatform === "videocypher" && isEditMode) {
      return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <MonitorPlay className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">VdoCipher Video Details</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Video ID</p>
              <p className="font-mono text-blue-800">{form.videoId || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                form.status === 'ready' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {form.status === 'ready' ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Ready
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Processing
                  </>
                )}
              </span>
            </div>
            <div>
              <p className="text-gray-600">Quality</p>
              <p className="text-blue-800 capitalize">{form.quality}</p>
            </div>
            <div>
              <p className="text-gray-600">Secure Streaming</p>
              <p className="text-green-600 font-medium">
                {form.secureUrl ? "✓ Enabled" : "Setting up..."}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSourceInput = () => {
    if (form.sourcePlatform === "youtube") {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            YouTube URL *
          </label>
          <div className="relative">
            <input
              type="url"
              name="youtubeUrl"
              value={form.youtubeUrl}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <Play className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
          </div>
          {form.youtubeUrl && !isValidYouTubeUrl(form.youtubeUrl) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              Please enter a valid YouTube URL
            </div>
          )}
          {form.youtubeUrl && isValidYouTubeUrl(form.youtubeUrl) && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Valid YouTube URL detected
            </div>
          )}
        </div>
      );
    } else if (form.sourcePlatform === "videocypher") {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Video File {!isEditMode ? '*' : ''}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              name="file"
              accept="video/*"
              onChange={handleChange}
              className="hidden"
              id="video-file"
              required={!isEditMode}
            />
            <label htmlFor="video-file" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Video className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {form.file ? form.file.name : "Click to select video file"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    MP4, AVI, MOV up to 2GB
                  </p>
                </div>
              </div>
            </label>
          </div>
          
          {form.file && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Selected: {form.file.name}</span>
              </div>
            </div>
          )}
          
          {isEditMode && !form.file && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                💡 Leave empty to keep current video, or select a new file to replace it
              </p>
            </div>
          )}
          
          {isEditMode && form.file && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  This will replace the current video with: {form.file.name}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="bg-white lg:w-[800px] rounded-2xl max-w-4xl w-full mx-auto shadow-2xl max-h-[700px] overflow-scroll">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileVideo className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Video Lesson" : "Upload Video Lesson"}
                </h2>
                <p className="text-blue-100 text-sm">
                  {isEditMode ? "Update your video content" : "Add a new video to your lesson"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 pb-36">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Video Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter an engaging title for your video"
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
              placeholder="Describe what students will learn from this video..."
            />
          </div>
          
          {/* Source Platform */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Source Platform *
            </label>
            <div className="grid grid-cols-2 gap-4">
              {sourcePlatforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div
                    key={platform.value}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      form.sourcePlatform === platform.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setForm(prev => ({ ...prev, sourcePlatform: platform.value }))}
                  >
                    <input
                      type="radio"
                      name="sourcePlatform"
                      value={platform.value}
                      checked={form.sourcePlatform === platform.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3">
                      <Icon className={`w-6 h-6 ${
                        form.sourcePlatform === platform.value 
                          ? "text-blue-600" 
                          : "text-gray-400"
                      }`} />
                      <span className={`font-medium ${
                        form.sourcePlatform === platform.value 
                          ? "text-blue-900" 
                          : "text-gray-700"
                      }`}>
                        {platform.label}
                      </span>
                    </div>
                    {form.sourcePlatform === platform.value && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {isEditMode && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-amber-800 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>Changing platform will replace the current video</span>
                </div>
              </div>
            )}
          </div>

          {/* Platform-specific inputs */}
          {form.sourcePlatform && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              {renderSourceInput()}
            </div>
          )}
          
          {/* VdoCipher info */}
          {renderVdoCipherInfo()}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex fixed bottom-0 w-full justify-between items-center">
          <div className="text-sm text-gray-600">
            * Required fields
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-6 py-2 rounded-xl font-semibold text-gray-700 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || uploadProgress.isVisible}
              className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 ${
                loading || uploadProgress.isVisible
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading || uploadProgress.isVisible ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isEditMode ? "Updating..." : "Processing..."}
                </>
              ) : (
                <>
                  {form.sourcePlatform === "youtube" ? (
                    <Play className="w-5 h-5" />
                  ) : (
                    <UploadCloud className="w-5 h-5" />
                  )}
                  {isEditMode
                    ? "Update Video"
                    : form.sourcePlatform === "youtube"
                    ? "Link Video"
                    : "Upload Video"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Upload Progress Modal */}
      <UploadProgress
        isVisible={uploadProgress.isVisible}
        progress={uploadProgress.progress}
        fileName={uploadProgress.fileName}
        stage={uploadProgress.stage}
      />
      
      {/* Enhanced Popup */}
      <EnhancedPopup
        message={popup.message}
        type={popup.type}
        isVisible={popup.isVisible}
        onClose={() => setPopup({ isVisible: false, message: "", type: "" })}
      />
    </>
  );
};

export default VideoLesson;
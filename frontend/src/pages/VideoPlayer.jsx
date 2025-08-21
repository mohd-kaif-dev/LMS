import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Star,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  XCircle,
  Clock,
  CheckCircle,
} from "lucide-react";

// ======================================================================
// StarRating Component - A reusable component for star ratings
// ======================================================================
const StarRating = ({ rating, onRate, size = 20 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index) => {
    onRate(index + 1);
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={size}
          className={`cursor-pointer transition-colors duration-200 
            ${
              index + 1 <= (hoverRating || rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleStarClick(index)}
        />
      ))}
    </div>
  );
};

// ======================================================================
// VideoPlayer Component - The core video player and lecture details
// ======================================================================
const VideoPlayer = ({ lecture, isSidebarOpen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);

  const isYouTube = (url) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getYouTubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getEmbedUrl = (url) => {
    if (isYouTube(url)) {
      const videoId = getYouTubeId(url);
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`;
    }
    return url;
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleVolumeChange = (e) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handleProgressBarClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const newTime =
        (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
      videoRef.current.currentTime = newTime;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const videoElement = isYouTube(lecture.videoUrl) ? (
    <iframe
      src={getEmbedUrl(lecture.videoUrl)}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full absolute top-0 left-0"
    ></iframe>
  ) : (
    <video
      ref={videoRef}
      src={lecture.videoUrl}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      className="w-full absolute top-0 left-0"
    />
  );

  return (
    <div
      className={`flex flex-col bg-black text-white relative group ${
        !isSidebarOpen ? "px-48" : "px-0"
      }`}
    >
      <div className="relative bg-black  overflow-hidden shadow-2xl pb-[56.25%] h-0">
        {videoElement}

        {!isYouTube(lecture.videoUrl) && duration > 0 && (
          <div className="opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300">
            <div
              className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-2"
              onClick={handleProgressBarClick}
              ref={progressBarRef}
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${Math.min((currentTime / duration) * 100, 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="p-1 sm:p-2 text-white hover:text-gray-300"
                >
                  {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                </button>
                <button
                  onClick={() => handleSkip(-5)}
                  className="p-1 sm:p-2 text-white hover:text-gray-300 flex items-center"
                >
                  <ChevronsLeft size={24} />
                  <span className="text-xs sm:text-sm">5s</span>
                </button>
                <button
                  onClick={() => handleSkip(5)}
                  className="p-1 sm:p-2 text-white hover:text-gray-300 flex items-center"
                >
                  <span className="text-xs sm:text-sm">5s</span>
                  <ChevronsRight size={24} />
                </button>

                <div className="relative hidden sm:block">
                  <select
                    value={playbackSpeed}
                    onChange={(e) =>
                      handleSpeedChange(parseFloat(e.target.value))
                    }
                    className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm appearance-none cursor-pointer"
                  >
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="hidden sm:flex items-center space-x-2">
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 1)}
                    className="p-1 sm:p-2 text-white hover:text-gray-300"
                  >
                    {volume > 0 ? <Volume2 size={24} /> : <VolumeX size={24} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 sm:w-20 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleFullscreen}
                  className="p-1 sm:p-2 text-white hover:text-gray-300"
                >
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ======================================================================
// LectureDetails Component - The content below the video player
// ======================================================================
const LectureDetails = ({ lecture, userRating, onRate, courseMeta }) => {
  const [showScheduler, setShowScheduler] = useState(true);

  return (
    <div className="mt-8 px-4 sm:px-8 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        {lecture.title}
      </h1>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">
        {lecture.description}
      </p>

      <div className="flex flex-wrap items-center space-x-4 sm:space-x-8 mb-6">
        <div className="flex items-center space-x-2 text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {courseMeta.rating}
          </span>
          <StarRating rating={userRating} onRate={onRate} size={18} />
          <span className="text-gray-400 text-xs sm:text-sm">
            {courseMeta.students.toLocaleString()} ratings
          </span>
        </div>
        <div className="text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {courseMeta.students.toLocaleString()}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm"> students</span>
        </div>
        <div className="text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {courseMeta.totalHours}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm"> total hours</span>
        </div>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Last updated {courseMeta.lastUpdated}
      </p>
      <p className="text-gray-400 text-xs sm:text-sm">
        <span className="font-semibold text-white">English</span> [Auto],
        Bulgarian [Auto],{" "}
        <span className="underline text-purple-400 cursor-pointer">
          19 more
        </span>
      </p>

      {showScheduler && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Clock size={40} className="text-white flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Schedule learning time
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Learning a little each day adds up. Research shows that students
                who make learning a habit are more likely to reach their goals.
                Set time aside to learn and get reminders using your learning
                scheduler.
              </p>
            </div>
          </div>
          <div className="flex space-x-2 w-full md:w-auto">
            <button
              onClick={() => alert("Scheduler setup flow")}
              className="w-1/2 md:w-auto px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors"
            >
              Get started
            </button>
            <button
              onClick={() => setShowScheduler(false)}
              className="w-1/2 md:w-auto px-4 py-2 rounded-lg bg-transparent border border-white text-white font-semibold hover:bg-gray-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* By the numbers */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 text-gray-400">
        <div>
          <h4 className="font-semibold text-white">By the numbers</h4>
        </div>
        <div className="col-span-1 sm:col-span-2 lg:col-span-2"></div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Skill level:
          </span>
          <span className="text-xs sm:text-sm">All Levels</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Lectures:
          </span>
          <span className="text-xs sm:text-sm">{courseMeta.lectures}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Students:
          </span>
          <span className="text-xs sm:text-sm">
            {courseMeta.students.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Languages:
          </span>
          <span className="text-xs sm:text-sm">{courseMeta.language}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Video:
          </span>
          <span className="text-xs sm:text-sm">
            {courseMeta.totalHours} total hours
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle size={16} className="text-yellow-400" />
          <span className="text-xs sm:text-sm font-semibold text-white">
            Captions:
          </span>
          <span className="text-xs sm:text-sm">{courseMeta.captions}</span>
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// CourseContent Component - The collapsible sidebar content
// ======================================================================
const CourseContent = ({ courseContent }) => {
  return (
    <div className="w-full h-full">
      {courseContent.map((section, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4 mb-2">
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          <p className="text-sm text-gray-400">{section.duration}</p>
        </div>
      ))}
    </div>
  );
};

// ======================================================================
// FullCoursePage Component - The main page layout
// ======================================================================
const VideoPlayerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRating, setUserRating] = useState(0);

  const mockLecture = {
    title: "Web Design for Web Developers: Build Beautiful Websites!",
    description:
      "Learn web design in 1 hour with 25+ simple-to-use rules and guidelines - tons of amazing web design resources included!",
    videoUrl:
      "https://res.cloudinary.com/dy4pu0fvx/video/upload/v1755623161/Python_ki1ded.mp4",
  };

  const mockCourseContent = [
    { title: "Section 1: Course Introduction", duration: "0/3 | 3min" },
    {
      title: "Section 2: The 25+ Guidelines Of Amazing Web Design",
      duration: "0/13 | 45min",
    },
    { title: "Section 3: Course Summary", duration: "0/3 | 1hr 42min" },
    { title: "Section 4: Conclusion", duration: "0/2 | 4min" },
  ];

  const mockCourseMeta = {
    rating: 4.5,
    students: 809294,
    totalHours: "2.5 hours",
    lastUpdated: "November 2024",
    lectures: 19,
    language: "English",
    captions: "Yes",
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col lg:flex-row">
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:w-3/4" : "lg:w-full"
        } w-full`}
      >
        <VideoPlayer lecture={mockLecture} isSidebarOpen={isSidebarOpen} />
        <LectureDetails
          lecture={mockLecture}
          courseMeta={mockCourseMeta}
          userRating={userRating}
          onRate={setUserRating}
        />
      </div>

      <aside
        className={`relative z-40 transition-all duration-300 bg-gray-800 border-l border-gray-700 
        ${isSidebarOpen ? "w-full lg:w-1/4" : "w-0"} overflow-hidden`}
      >
        {isSidebarOpen && (
          <div className="h-full p-4 fixed top-20 bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Course content</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            <CourseContent courseContent={mockCourseContent} />
          </div>
        )}
      </aside>

      {!isSidebarOpen && (
        <div className="fixed top-[20%] right-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 bg-purple-800 text-white rounded-lg hover:bg-purple-900 transition-sm shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayerPage;

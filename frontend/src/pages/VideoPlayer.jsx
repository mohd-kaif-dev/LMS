import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle,
  ChevronDown,
  PlayCircle as LessonIcon,
} from "lucide-react";
import useCourseStore from "../store/useCourseStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { dateFormat } from "../utils/constant";

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

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

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
    url?.includes("youtube.com") || url?.includes("youtu.be");

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

  if (!lecture)
    return (
      <div className="text-white h-screen flex items-center justify-center">
        Refresh the Page, No lecture is provide
      </div>
    );

  const videoElement = isYouTube(lecture?.videoUrl) ? (
    <iframe
      src={getEmbedUrl(lecture?.videoUrl)}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full absolute top-0 left-0"
    ></iframe>
  ) : (
    <video
      ref={videoRef}
      src={lecture?.videoUrl}
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
  // const [showScheduler, setShowScheduler] = useState(true);

  return (
    <div className="mt-8 px-4 sm:px-8 mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
        {lecture?.title}
      </h1>
      <p className="text-gray-300 mb-6 text-sm sm:text-base">
        {lecture?.description}
      </p>

      <div className="flex flex-wrap items-center space-x-4 sm:space-x-8 mb-6">
        <div className="flex items-center space-x-2 text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {lecture?.rating}
          </span>
          <StarRating rating={userRating} onRate={onRate} size={18} />
          <span className="text-gray-400 text-xs sm:text-sm">
            {lecture?.rating?.toLocaleString()} ratings
          </span>
        </div>
        <div className="text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {lecture?.studentsEnrolled?.length}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm"> students</span>
        </div>
        <div className="text-white mb-2">
          <span className="font-bold text-base sm:text-lg">
            {lecture?.totalHours}
          </span>
          <span className="text-gray-400 text-xs sm:text-sm"> total hours</span>
        </div>
      </div>

      <p className="text-gray-400 text-xs sm:text-sm mb-4">
        Last updated {dateFormat(lecture?.createdAt)}
      </p>
      <p className="text-gray-400 text-xs sm:text-sm">
        <span className="font-semibold text-white">English</span> [Auto],
        Bulgarian [Auto],{" "}
        <span className="underline text-purple-400 cursor-pointer">
          19 more
        </span>
      </p>

      {/* <div className="mt-6 bg-gray-800 rounded-lg p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between">
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
        </div> */}

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

const CourseContentSidebar = ({
  content,
  currentLectureId,
  onLectureSelect,
}) => {
  const [openSection, setOpenSection] = useState(1); // Default open section 2
  const totalLectures = content?.reduce(
    (acc, section) => acc + section?.lessons?.length,
    0
  );
  const completedLectures =
    content &&
    content.flatMap((s) => s.lectures).filter((l) => l?.status === "watched")
      .length;
  const progress = Math.round((completedLectures / totalLectures) * 100);

  return (
    <GlassCard className="w-full h-full p-4 flex flex-col">
      <div className="p-2 mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Course Content</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#475569"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                className="transform -rotate-90 origin-center"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {progress}%
            </span>
          </div>
          <div>
            <p className="text-slate-300 text-sm">
              {completedLectures} / {totalLectures} lectures
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        {content?.map((section, index) => (
          <div key={index} className="mb-2">
            <button
              onClick={() =>
                setOpenSection(openSection === index ? null : index)
              }
              className="w-full flex justify-between items-center p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="font-semibold text-left">{section.title}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  openSection === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openSection === index && (
              <ul className="mt-2 space-y-1">
                {section.lessons.map((lecture) => (
                  <li
                    key={lecture._id}
                    onClick={() => onLectureSelect(lecture)}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      lecture._id === currentLectureId
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lecture?.status === "watched" ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <LessonIcon size={16} className="text-slate-500" />
                      )}
                      <span className="text-sm">{lecture.title}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {lecture.duration}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ======================================================================
// FullCoursePage Component - The main page layout
// ======================================================================
const VideoPlayerPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRating, setUserRating] = useState(0);
  // State to hold the currently active lecture object
  const [currentLecture, setCurrentLecture] = useState(null);

  const location = useLocation();
  const courseId = location?.state?.id;
  const navigate = useNavigate(); // Hook for navigation
  // Get both courseId and the specific lessonId from the URL
  const { lessonId: currentLectureId } = useParams();

  const { selectedCourse, fetchCourseById, isFetching } = useCourseStore();

  // Effect to fetch the course data when the component mounts or courseId changes
  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId, fetchCourseById]);

  // Effect to determine which lecture to play
  useEffect(() => {
    if (selectedCourse?.sections?.length > 0) {
      let lectureToPlay = null;

      // 1. Try to find the lecture specified in the URL
      if (currentLectureId) {
        for (const section of selectedCourse.sections) {
          const foundLecture = section.lessons.find(
            (l) => l._id === currentLectureId
          );
          if (foundLecture) {
            lectureToPlay = foundLecture;
            break;
          }
        }
      }

      // 2. If no lecture was found (or no lessonId in URL), default to the first one
      if (!lectureToPlay) {
        lectureToPlay = selectedCourse.sections[0]?.lessons[0];
      }

      // 3. Set the lecture and update the URL if it was missing the lessonId
      if (lectureToPlay) {
        setCurrentLecture(lectureToPlay);
        if (lectureToPlay._id !== currentLectureId) {
          navigate(
            `/courses/${selectedCourse?.title
              .replace(/\s+/g, "-")
              .toLowerCase()}/learn/${lectureToPlay._id}`,
            {
              state: {
                id: selectedCourse?._id,
              },
            }
          );
        }
      }
    }
  }, [selectedCourse, currentLectureId, courseId, navigate, location.state]);

  // Handler function to be called when a lecture is clicked in the sidebar
  const handleLectureSelect = (lecture) => {
    setCurrentLecture(lecture);
    // Update the URL to reflect the newly selected lecture
    navigate(
      `/courses/${selectedCourse?.title
        .replace(/\s+/g, "-")
        .toLowerCase()}/learn/${lecture?._id}`,
      {
        state: {
          id: selectedCourse?._id,
        },
      }
    );
  };

  // A loading state while fetching data
  if (isFetching) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex justify-center items-center">
        <p className="text-xl">Loading Course...</p>
      </div>
    );
  }

  // Create a dynamic course metadata object from the fetched course data
  const courseMeta = {
    rating: selectedCourse?.rating,
    students: selectedCourse?.studentsEnrolled?.length || 0,
    totalHours: `${(selectedCourse?.totalDuration / 3600).toFixed(1)}`,
    lastUpdated: dateFormat(selectedCourse?.updatedAt),
    lectures: selectedCourse?.sections?.reduce(
      (acc, section) => acc + section.lessons.length,
      0
    ),
    language: "English", // Assuming English, you can make this dynamic
    captions: "Yes", // Assuming Yes, you can make this dynamic
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col lg:flex-row">
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "lg:w-3/4" : "lg:w-full"
        } w-full`}
      >
        {/* Pass the dynamic `currentLecture` object */}
        {/* Add a `key` to force the VideoPlayer to re-mount when the lecture changes */}
        <VideoPlayer
          lecture={currentLecture}
          isSidebarOpen={isSidebarOpen}
          key={currentLecture?._id}
        />

        {/* Pass the dynamic `currentLecture` and `courseMeta` objects */}
        <LectureDetails
          lecture={currentLecture}
          courseMeta={courseMeta}
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
            <div className="relative z-40">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:bg-white/20 hover:text-white transition-colors absolute top-4 right-4 p-1 rounded-sm"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Pass the course content, active lecture ID, and the select handler */}
            <CourseContentSidebar
              content={selectedCourse?.sections}
              currentLectureId={currentLectureId}
              onLectureSelect={handleLectureSelect}
            />
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

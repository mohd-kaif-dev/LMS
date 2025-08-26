import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  CheckCircle,
  PlayCircle as LessonIcon,
  FileText,
  HelpCircle,
  Notebook,
  ChevronDown,
} from "lucide-react";

// ======================================================================
// Mock Data (For Standalone Demo)
// ======================================================================
const mockLecture = {
  id: "lec-02-01",
  title: "The 25+ Guidelines Of Amazing Web Design",
  description:
    "Learn web design in 1 hour with 25+ simple-to-use rules and guidelines - tons of amazing web design resources included!",
  videoUrl:
    "https://res.cloudinary.com/dy4pu0fvx/video/upload/v1755623161/Python_ki1ded.mp4",
};

const mockCourseContent = [
  {
    title: "Section 1: Course Introduction",
    duration: "3min",
    lectures: [
      {
        id: "lec-01-01",
        title: "Welcome to the Course!",
        duration: "1:30",
        status: "watched",
      },
      {
        id: "lec-01-02",
        title: "Setting Up Your Workspace",
        duration: "1:30",
        status: "watched",
      },
    ],
  },
  {
    title: "Section 2: The 25+ Guidelines",
    duration: "45min",
    lectures: [
      {
        id: "lec-02-01",
        title: "Guideline 1: Visual Hierarchy",
        duration: "15:00",
        status: "playing",
      },
      {
        id: "lec-02-02",
        title: "Guideline 2: Color Theory",
        duration: "15:00",
        status: "unwatched",
      },
      {
        id: "lec-02-03",
        title: "Guideline 3: Typography",
        duration: "15:00",
        status: "unwatched",
      },
    ],
  },
  {
    title: "Section 3: Course Summary",
    duration: "1hr 42min",
    lectures: [
      {
        id: "lec-03-01",
        title: "Project: Build a Landing Page",
        duration: "1:00:00",
        status: "unwatched",
      },
      {
        id: "lec-03-02",
        title: "Review and Feedback",
        duration: "42:00",
        status: "unwatched",
      },
    ],
  },
];

// ======================================================================
// Reusable UI Components
// ======================================================================
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-slate-700 rounded-full h-2.5">
    <div
      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

// ======================================================================
// Video Player Component
// ======================================================================
const VideoPlayer = ({ lecture }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);

  const togglePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => setCurrentTime(videoRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(videoRef.current.duration);
  const handleSeek = (e) => {
    const seekTime =
      (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
    videoRef.current.currentTime = seekTime;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group">
      <video
        ref={videoRef}
        src={lecture.videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full"
      />
      <div
        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={togglePlayPause}
      >
        {!isPlaying && <Play size={64} className="text-white/80" />}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-2"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlayPause}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => (videoRef.current.volume = volume > 0 ? 0 : 1)}
              >
                {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  videoRef.current.volume = newVolume;
                }}
                className="w-20 h-1 accent-blue-500"
              />
            </div>
            <span className="text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="bg-transparent text-xs appearance-none cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            <button>
              <Settings size={20} />
            </button>
            <button>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// Course Content Sidebar
// ======================================================================
const CourseContentSidebar = ({ content, currentLectureId }) => {
  const [openSection, setOpenSection] = useState(1); // Default open section 2
  const totalLectures = content.reduce(
    (acc, section) => acc + section.lectures.length,
    0
  );
  const completedLectures = content
    .flatMap((s) => s.lectures)
    .filter((l) => l.status === "watched").length;
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
        {content.map((section, index) => (
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
                {section.lectures.map((lecture) => (
                  <li
                    key={lecture.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      lecture.id === currentLectureId
                        ? "bg-blue-500/20 text-blue-300"
                        : "hover:bg-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {lecture.status === "watched" ? (
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
// Lecture Details (Tabbed Content)
// ======================================================================
const LectureDetails = ({ lecture }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview", icon: <FileText size={16} /> },
    { id: "q&a", label: "Q&A", icon: <HelpCircle size={16} /> },
    { id: "notes", label: "Notes", icon: <Notebook size={16} /> },
  ];

  return (
    <GlassCard className="mt-8 p-6">
      <div className="border-b border-slate-700 mb-4">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-white border-b-2 border-blue-500"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {activeTab === "overview" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {lecture.title}
            </h2>
            <p className="text-slate-300">{lecture.description}</p>
          </div>
        )}
        {activeTab === "q&a" && (
          <p className="text-slate-300">Q&A section coming soon.</p>
        )}
        {activeTab === "notes" && (
          <p className="text-slate-300">Notes section coming soon.</p>
        )}
      </div>
    </GlassCard>
  );
};

// ======================================================================
// Main Page Layout
// ======================================================================
const VideoPlayerPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 lg:w-2/3">
          <VideoPlayer lecture={mockLecture} />
          <LectureDetails lecture={mockLecture} />
        </div>
        {/* Sidebar */}
        <div className="w-full lg:w-1/3 lg:max-w-sm">
          <CourseContentSidebar
            content={mockCourseContent}
            currentLectureId={mockLecture.id}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;

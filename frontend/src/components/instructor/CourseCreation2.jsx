import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Video,
  ListOrdered,
  Rocket,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { toast } from "sonner";

import useCourseStore from "../../store/useCourseStore";
import { StepFour, StepOne, StepThree, StepTwo } from "./CourseCreation/Steps";
import { useNavigate } from "react-router-dom";

const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);

// ======================================================================
// Main CourseCreation Component
// ======================================================================
const CourseCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [lessonId, setLessonId] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [trailerUploadProgress, setTrailerUploadProgress] = useState(0);

  const lessonBeingUploadedRef = useRef(null);

  const navigate = useNavigate();

  const {
    createDraft,
    updateDraft,
    isLoading,
    isUploading,
    uploadVideoLesson,
    addCourseThumbnail,
    togglePublishCourse,
    isPublishing,
  } = useCourseStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    category: "",
    difficulty: "beginner",
    price: 0,
    originalPrice: 999,
    learningOutcomes: [""],
    requirements: [""],
    trailerUrl: "",
    thumbnailUrl: "",
    sections: [
      {
        title: "",
        lessons: [
          {
            title: "",
            videoUrl: "",
            duration: 0,
            description: "",
            uploadProgress: 0,
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const storedFormData = localStorage.getItem("courseCreationFormData");
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
    const courseId = localStorage.getItem("courseId");
    if (courseId) {
      setCourseId(courseId);
    }
    const sectionId = localStorage.getItem("sectionId");
    if (sectionId) {
      setSectionId(sectionId);
    }
    const lessonId = localStorage.getItem("lessonId");
    if (lessonId) {
      setLessonId(lessonId);
    }
  }, []);

  const handleNext = async () => {
    localStorage.setItem("courseCreationFormData", JSON.stringify(formData));
    if (currentStep === 1) {
      const {
        title,
        description,
        detailedDescription,
        category,
        difficulty,
        price,
        originalPrice,
        learningOutcomes,
        requirements,
        sections,
      } = formData;

      // if (!courseId) {
      const { success, course } = await createDraft({
        title,
        description,
        detailedDescription,
        category,
        difficulty,
        price,
        originalPrice,
        learningOutcomes,
        requirements,
        sections,
      });
      if (success) {
        console.log("Course Created", course._id);
        console.log("SectionId ", course.sections[0]._id);
        console.log("LessonId ", course.sections[0].lessons[0]._id);

        setCourseId(course._id);
        setSectionId(course.sections[0]._id);
        setLessonId(course.sections[0].lessons[0]._id);

        localStorage.setItem("courseId", course._id);
        localStorage.setItem("sectionId", course.sections[0]._id);
        localStorage.setItem("lessonId", course.sections[0].lessons[0]._id);

        setCurrentStep(2);
      }
    } else if (currentStep === 2 || currentStep === 3) {
      const { success, course } = await updateDraft(courseId, formData);

      setFormData((p) => ({
        ...p,
        title: course.title,
        description: course.description,
        detailedDescription: course.detailedDescription,
        category: course.category,
        difficulty: course.difficulty,
        price: course.price,
        originalPrice: course.originalPrice,
        learningOutcomes: course.learningOutcomes,
        requirements: course.requirements,
        sections: course.sections,
      }));

      if (success) {
        setCurrentStep((p) => p + 1);
      }
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    const response = await togglePublishCourse(courseId);
    if (response.success) {
      toast("Course published successfully.");
      localStorage.setItem("courseCreationFormData", null);
      localStorage.setItem("courseId", null);
      localStorage.setItem("sectionId", null);
      localStorage.setItem("lessonId", null);
      setCurrentStep(1);
      navigate("/instructor/my-courses");
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailUpload = async () => {
    if (!thumbnailFile || !courseId) {
      toast("Please select a file and complete Step 1 first.");
      return;
    }

    const response = await addCourseThumbnail(courseId, thumbnailFile);
    if (response.success) {
      setFormData((p) => ({
        ...p,
        thumbnailUrl: response.course.thumbnailUrl,
      }));
      toast("Thumbnail uploaded successfully.");
    }
  };

  const handleTrailerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !courseId) {
      toast("Please complete Step 1 first.");
      return;
    }
    const response = await new Promise((resolve) => {
      console.log("Uploading video...");
      setTrailerUploadProgress(0);
      return resolve;
    });
    if (response.success)
      setFormData((p) => ({ ...p, trailerUrl: response.url }));
  };

  const handleLessonVideoUpload = async (e, sectionIndex, lessonIndex) => {
    const file = e.target.files[0];

    if (!file || !courseId || !sectionId) {
      toast.error("Cannot upload video without a saved course and section.");
      return;
    }

    lessonBeingUploadedRef.current = `${sectionIndex}-${lessonIndex}`;

    // This function updates your component's local state to show the progress bar
    const onProgress = (progress) => {
      console.log("Progress reported from Zustand:", progress);
      setFormData((prev) => {
        // Using a deep copy is safer for nested state
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        newSections[sectionIndex].lessons[lessonIndex].uploadProgress =
          progress;
        return { ...prev, sections: newSections };
      });
    };

    // Call the Zustand action, passing the file and the onProgress function
    const response = await uploadVideoLesson(
      courseId,
      sectionId,
      lessonId,
      file,
      onProgress
    );

    // If the upload was successful, update the final URL
    if (response.success) {
      setFormData((prev) => {
        const newSections = JSON.parse(JSON.stringify(prev.sections));
        newSections[sectionIndex].lessons[lessonIndex].videoUrl =
          response.lesson.videoUrl;
        // Optional: Hide the progress bar after a short delay on success
        setTimeout(() => {
          newSections[sectionIndex].lessons[lessonIndex].uploadProgress = 0;
          setFormData({ ...prev, sections: newSections });
        }, 1500);
        return { ...prev, sections: newSections };
      });
    }
  };

  // Form change handlers
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCategorySelect = (cat) =>
    setFormData((p) => ({ ...p, category: cat }));

  const handleArrayChange = (e, i, f) => {
    const n = [...formData[f]];
    n[i] = e.target.value;
    setFormData((p) => ({ ...p, [f]: n }));
  };

  const handleAddArrayItem = (f) =>
    setFormData((p) => ({ ...p, [f]: [...p[f], ""] }));

  const handleRemoveArrayItem = (i, f) =>
    setFormData((p) => ({ ...p, [f]: p[f].filter((_, idx) => idx !== i) }));

  const handleSectionChange = (e, sIdx, f) => {
    const n = formData.sections.map((s, i) =>
      i === sIdx ? { ...s, [f]: e.target.value } : s
    );
    setFormData((p) => ({ ...p, sections: n }));
  };
  const handleLessonChange = (e, sIdx, lIdx, f) => {
    const n = [...formData.sections];
    n[sIdx].lessons[lIdx][f] = e.target.value;
    setFormData((p) => ({ ...p, sections: n }));
  };
  const handleAddLesson = async (sIdx) => {
    const n = [...formData.sections];
    n[sIdx].lessons.push({
      title: "",
      videoUrl: "",
      duration: 0,
      description: "",
      uploadProgress: 0,
    });
    setFormData((p) => ({ ...p, sections: n }));
    const { success, course } = await updateDraft(courseId, formData.sections);
    if (success) {
      const newLessonId =
        course.sections[sIdx].lessons[course.sections[sIdx].lessons.length - 1]
          ._id;
      setLessonId(newLessonId);
      // console.log(
      //   "lessonId updated",
      //   course.sections[sIdx].lessons[course.sections[sIdx].lessons.length - 1]
      //     ._id
      // );
      // console.log("lessonId state updated", lessonId);
    }
  };

  useEffect(() => {
    localStorage.setItem("sectionId", sectionId);
    localStorage.setItem("lessonId", lessonId);
  }, [lessonId, sectionId]);

  const handleRemoveLesson = (sIdx, lIdx) => {
    const n = [...formData.sections];
    n[sIdx].lessons.splice(lIdx, 1);
    setFormData((p) => ({ ...p, sections: n }));
  };

  const handleAddSection = async () => {
    const { success, course } = await updateDraft(courseId, formData);
    if (success) {
      setSectionId(course.sections[course.sections.length - 1]._id);
      setLessonId(
        course.sections[course.sections.length - 1].lessons[
          course.sections[course.sections.length - 1].lessons.length - 1
        ]._id
      );
    }
    setFormData((p) => ({
      ...p,
      sections: [
        ...p.sections,
        {
          title: "",
          lessons: [
            {
              title: "",
              videoUrl: "",
              duration: 0,
              description: "",
              uploadProgress: 0,
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveSection = (sIdx) =>
    setFormData((p) => ({
      ...p,
      sections: p.sections.filter((_, i) => i !== sIdx),
    }));

  const steps = [
    { name: "Details", icon: <FileText size={20} /> },
    { name: "Syllabus", icon: <ListOrdered size={20} /> },
    { name: "Media", icon: <Video size={20} /> },
    { name: "Publish", icon: <Rocket size={20} /> },
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Create a New Course
          </h1>
          <p className="text-lg text-slate-400 mt-2">
            Share your knowledge with the world.
          </p>
        </header>
        <div className="my-12">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                      index + 1 <= currentStep ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle size={24} />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      index + 1 <= currentStep ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 transition-colors duration-300 ${
                      index + 1 < currentStep ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <GlassCard>
          <form onSubmit={handlePublish} className="p-8 md:p-12">
            {currentStep === 1 && (
              <StepOne
                {...{
                  formData,
                  handleChange,
                  handleArrayChange,
                  handleAddArrayItem,
                  handleRemoveArrayItem,
                  handleCategorySelect,
                }}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                {...{
                  formData,
                  handleSectionChange,
                  handleLessonChange,
                  handleAddLesson,
                  handleRemoveLesson,
                  handleAddSection,
                  handleRemoveSection,
                  handleLessonVideoUpload,
                  isUploading,
                  lessonBeingUploadedRef,
                }}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                {...{
                  formData,
                  handleChange,
                  handleTrailerUpload,
                  trailerUploadProgress,
                  thumbnailPreview,
                  handleThumbnailSelect,
                  handleThumbnailUpload,
                  isUploading,
                }}
              />
            )}
            {currentStep === 4 && <StepFour {...{ formData }} />}
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setCurrentStep((p) => p - 1)}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-700/80 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-teal-600 text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Rocket size={20} />
                      <span>Publish Course</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default CourseCreation;

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Video,
  ListOrdered,
  Rocket,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Loader2,
  ClipboardMinus,
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

const initialData = {
  title: "",
  description: "",
  detailedDescription: "",
  category: "",
  difficulty: "beginner",
  price: 0,
  originalPrice: 999,
  learningOutcomes: [""],
  requirements: [""],
  totalDuration,
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
};

// ======================================================================
// Main CourseCreation Component (Optimized)
// ======================================================================
const CourseCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId, setCourseId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [lessonId, setLessonId] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [trailerUploadProgress, setTrailerUploadProgress] = useState(0);
  const [isClearing, setIsClearing] = useState(false);

  const lessonBeingUploadedRef = useRef(null);
  //   const autoSaveTimerRef = useRef(null);

  const navigate = useNavigate();

  const {
    isLoading,
    isUploading,
    isPublishing,
    isDeleting,
    createDraft,
    updateDraft,
    deleteCourse,
    uploadVideoLesson,
    addCourseThumbnail,
    togglePublishCourse,
  } = useCourseStore();

  const [formData, setFormData] = useState(initialData);

  // -----------------------------
  // Helpers
  // -----------------------------
  const safeGet = (key) => {
    const v = localStorage.getItem(key);
    return v && v !== "null" && v !== "undefined" ? v : null;
  };

  const persistState = useCallback((data) => {
    try {
      localStorage.setItem("courseCreationFormData", JSON.stringify(data));
    } catch {
      toast.error("Failed to save course data.");
    }
  }, []);

  const validateStep = useCallback(() => {
    // Real-time validation without changing UI layout: only toasts and preventing navigation
    if (currentStep === 1) {
      const { title, description, category, difficulty, price } = formData;
      if (!title?.trim())
        return toast.error("Please enter a course title."), false;
      if (!description?.trim())
        return toast.error("Please add a short description."), false;
      if (!category) return toast.error("Please select a category."), false;
      if (!difficulty) return toast.error("Please choose a difficulty."), false;
      if (Number(price) < 0)
        return toast.error("Price cannot be negative."), false;
    }
    if (currentStep === 2) {
      const hasSection = formData.sections?.length > 0;
      const hasLesson = formData.sections?.some((s) => s.lessons?.length > 0);
      if (!hasSection) return toast.error("Add at least one section."), false;
      if (!hasLesson) return toast.error("Add at least one lesson."), false;
    }
    return true;
  }, [currentStep, formData]);

  // -----------------------------
  // Initial load from localStorage
  // -----------------------------
  useEffect(() => {
    const stored = localStorage.getItem("courseCreationFormData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object")
          setFormData({ ...initialData, ...parsed });
      } catch {
        toast.error("Failed to load course data.");
      }
    }
    const cid = safeGet("courseId");
    const sid = safeGet("sectionId");
    const lid = safeGet("lessonId");
    if (cid) setCourseId(cid);
    if (sid) setSectionId(sid);
    if (lid) setLessonId(lid);
  }, []);

  // -----------------------------
  // Debounced auto-save of formData when course exists
  // -----------------------------
  //   useEffect(() => {
  //     persistState(formData);
  //     if (!courseId) return; // only autosave after draft exists

  //     if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
  //     autoSaveTimerRef.current = setTimeout(async () => {
  //       try {
  //         await updateDraft(courseId, formData);
  //       } catch (e) {
  //         console.error(e);
  //       }
  //     }, 800);

  //     return () => {
  //       if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
  //     };
  //   }, [formData, courseId, persistState, updateDraft]);

  // -----------------------------
  // Navigation handlers
  // -----------------------------
  const handleNext = useCallback(async () => {
    if (!validateStep()) return;

    persistState(formData);

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

      if (!courseId) {
        const { success, course } = await createDraft({
          title,
          description,
          detailedDescription,
          totalDuration,
          category,
          difficulty,
          price,
          originalPrice,
          learningOutcomes,
          requirements,
          sections,
        });
        if (success && course) {
          setCourseId(course._id);
          const firstSection = course.sections?.[0];
          const firstLesson = firstSection?.lessons?.[0];
          setSectionId(firstSection?._id || null);
          setLessonId(firstLesson?._id || null);
          localStorage.setItem("courseId", course._id);
          if (firstSection?._id)
            localStorage.setItem("sectionId", firstSection._id);
          if (firstLesson?._id)
            localStorage.setItem("lessonId", firstLesson._id);
          setCurrentStep(2);
        }
      } else {
        const { success } = await updateDraft(courseId, formData);
        if (success) setCurrentStep(2);
      }
    } else if (currentStep === 2 || currentStep === 3) {
      if (!courseId) return toast.error("Please complete Step 1 first.");
      const totalDuration = formData.sections.reduce((acc, section) => {
        return (
          acc +
          section.lessons.reduce((acc, lesson) => acc + lesson.duration, 0)
        );
      });
      setFormData((p) => ({ ...p, totalDuration }));
      const { success, course } = await updateDraft(courseId, formData);
      if (success && course) {
        // keep local sections in sync (ids etc.)
        setFormData((p) => ({ ...p, sections: course.sections }));
        setCurrentStep((p) => p + 1);
      }
    }
  }, [
    currentStep,
    formData,
    courseId,
    createDraft,
    updateDraft,
    validateStep,
    persistState,
  ]);

  const handleBack = useCallback(() => {
    setCurrentStep((p) => Math.max(1, p - 1));
  }, []);

  const handleClearData = useCallback(async () => {
    try {
      setIsClearing(true);
      setFormData(initialData);
      localStorage.removeItem("courseCreationFormData");
      localStorage.removeItem("courseId");
      localStorage.removeItem("sectionId");
      localStorage.removeItem("lessonId");
    } catch (error) {
      toast.error("Failed to clear course data.");
      console.log("Error clearing dat", error);
    } finally {
      setIsClearing(false);
    }
    if (courseId) {
      const response = await deleteCourse(courseId);
      if (response.success) {
        setCurrentStep(1);
        setCourseId(null);
        setSectionId(null);
        setLessonId(null);
      }

      navigate("/instructor/course-creation");
    }
  }, [navigate, courseId]);

  // -----------------------------
  // Publish
  // -----------------------------
  const handlePublish = useCallback(
    async (e) => {
      e.preventDefault();
      if (!courseId) return toast.error("No course to publish.");
      const response = await togglePublishCourse(courseId);
      if (response?.success) {
        toast.success("Course published successfully.");
        localStorage.removeItem("courseCreationFormData");
        localStorage.removeItem("courseId");
        localStorage.removeItem("sectionId");
        localStorage.removeItem("lessonId");
        setCurrentStep(1);
        navigate("/instructor/my-courses");
      }
    },
    [courseId, navigate, togglePublishCourse]
  );

  // -----------------------------
  // Thumbnail
  // -----------------------------
  const handleThumbnailSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  }, []);

  useEffect(
    () => () => thumbnailPreview && URL.revokeObjectURL(thumbnailPreview),
    [thumbnailPreview]
  );

  const handleThumbnailUpload = useCallback(async () => {
    if (!thumbnailFile || !courseId) {
      toast("Please select a file and complete Step 1 first.");
      return;
    }
    const response = await addCourseThumbnail(courseId, thumbnailFile);
    if (response?.success) {
      setFormData((p) => ({
        ...p,
        thumbnailUrl: response.course.thumbnailUrl,
      }));
      toast.success("Thumbnail uploaded successfully.");
    }
  }, [thumbnailFile, courseId, addCourseThumbnail]);

  // -----------------------------
  // Trailer (simulated upload with progress, backend endpoint not provided)
  // -----------------------------
  const handleTrailerUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file || !courseId) {
        toast("Please complete Step 1 first.");
        return;
      }
      setTrailerUploadProgress(0);
      // Simulate upload progress for UX (no backend action available)
      const objectUrl = URL.createObjectURL(file);
      let p = 0;
      const iv = setInterval(() => {
        p = Math.min(100, p + Math.random() * 20 + 10);
        setTrailerUploadProgress(Math.floor(p));
        if (p >= 100) {
          clearInterval(iv);
          setFormData((prev) => ({ ...prev, trailerUrl: objectUrl }));
          toast.success("Trailer ready.");
        }
      }, 200);
    },
    [courseId]
  );

  // -----------------------------
  // Lesson Video Upload
  // -----------------------------
  const handleLessonVideoUpload = useCallback(
    async (e, sectionIndex, lessonIndex) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Ensure we have persisted ids for the specific section/lesson
      const s = formData.sections?.[sectionIndex];
      const l = s?.lessons?.[lessonIndex];
      const sid = s?._id || sectionId;
      const lid = l?._id || lessonId;

      if (!courseId || !sid || !lid) {
        toast.error(
          "Cannot upload video without a saved course and lesson id."
        );
        return;
      }

      lessonBeingUploadedRef.current = `${sectionIndex}-${lessonIndex}`;

      // progress callback updates local progress bar
      const onProgress = (progress) => {
        setFormData((prev) => {
          const sections = prev.sections.map((sec, si) => {
            if (si !== sectionIndex) return sec;
            const lessons = sec.lessons.map((les, li) =>
              li === lessonIndex ? { ...les, uploadProgress: progress } : les
            );
            return { ...sec, lessons };
          });
          return { ...prev, sections };
        });
      };

      const response = await uploadVideoLesson(
        courseId,
        sid,
        lid,
        file,
        onProgress
      );

      if (response?.success && response.lesson?.videoUrl) {
        setFormData((prev) => {
          const sections = prev.sections.map((sec, si) => {
            if (si !== sectionIndex) return sec;
            const lessons = sec.lessons.map((les, li) =>
              li === lessonIndex
                ? { ...les, videoUrl: response.lesson.videoUrl }
                : les
            );
            return { ...sec, lessons };
          });
          return { ...prev, sections };
        });
        // Clear progress after a short delay
        setTimeout(() => {
          setFormData((prev) => {
            const sections = prev.sections.map((sec, si) => {
              if (si !== sectionIndex) return sec;
              const lessons = sec.lessons.map((les, li) =>
                li === lessonIndex ? { ...les, uploadProgress: 0 } : les
              );
              return { ...sec, lessons };
            });
            return { ...prev, sections };
          });
        }, 1500);
      }
    },
    [courseId, formData.sections, lessonId, sectionId, uploadVideoLesson]
  );

  // -----------------------------
  // Form change helpers (unchanged UI)
  // -----------------------------
  const handleChange = useCallback(
    (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value })),
    []
  );

  const handleCategorySelect = useCallback(
    (cat) => setFormData((p) => ({ ...p, category: cat })),
    []
  );

  const handleArrayChange = useCallback((e, i, f) => {
    setFormData((p) => {
      const n = [...p[f]];
      n[i] = e.target.value;
      return { ...p, [f]: n };
    });
  }, []);

  const handleAddArrayItem = useCallback(
    (f) => setFormData((p) => ({ ...p, [f]: [...p[f], ""] })),
    []
  );

  const handleRemoveArrayItem = useCallback(
    (i, f) =>
      setFormData((p) => ({ ...p, [f]: p[f].filter((_, idx) => idx !== i) })),
    []
  );

  const handleSectionChange = useCallback((e, sIdx, f) => {
    setFormData((p) => {
      const n = p.sections.map((s, i) =>
        i === sIdx ? { ...s, [f]: e.target.value } : s
      );
      return { ...p, sections: n };
    });
  }, []);

  const handleLessonChange = useCallback(
    (e, sectionIndex, lessonIndex, fieldName) => {
      const { value } = e.target;

      setFormData((prevFormData) => {
        // 1. Create a new sections array using .map()
        const updatedSections = prevFormData.sections.map((section, sIdx) => {
          // If it's not the section we're targeting, return it unchanged
          if (sIdx !== sectionIndex) {
            return section;
          }

          // 2. If it IS the correct section, create a new lessons array using .map()
          const updatedLessons = section.lessons.map((lesson, lIdx) => {
            // If it's not the lesson we're targeting, return it unchanged
            if (lIdx !== lessonIndex) {
              return lesson;
            }

            // 3. If it IS the correct lesson, return a new lesson object with the updated field
            return {
              ...lesson,
              [fieldName]: value,
            };
          });

          // 4. Return a new section object with the new lessons array
          return {
            ...section,
            lessons: updatedLessons,
          };
        });

        // 5. Return a new state object with the new sections array
        return {
          ...prevFormData,
          sections: updatedSections,
        };
      });
    },
    []
  );

  const handleAddLesson = async (sIdx) => {
    // 1. Create the new lesson object
    const newLesson = {
      title: "",
      videoUrl: "",
      duration: 0,
      description: "",
      uploadProgress: 0,
    };

    // 2. Create a new copy of the sections array
    const updatedSections = [...formData.sections];
    // Push the new lesson into the correct section
    updatedSections[sIdx].lessons.push(newLesson);

    // 3. Create the new, complete formData object
    const newFormData = { ...formData, sections: updatedSections };

    // 4. Update the local state immediately for a responsive UI
    setFormData(newFormData);

    // 5. Persist the new, updated formData to the backend (FIXED)
    const { success, course } = await updateDraft(courseId, newFormData);

    // 6. Update IDs from the backend response
    if (success && course) {
      const createdLesson =
        course.sections[sIdx].lessons[course.sections[sIdx].lessons.length - 1];
      if (createdLesson?._id) {
        setLessonId(createdLesson._id);
      }
    }
  };

  const handleRemoveLesson = useCallback((sIdx, lIdx) => {
    setFormData((p) => {
      const n = [...p.sections];
      n[sIdx].lessons.splice(lIdx, 1);
      return { ...p, sections: n };
    });
  }, []);

  const handleAddSection = async () => {
    // 1. Create the new section object
    const newSection = {
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
    };

    // 2. Create the new, complete formData object
    const newFormData = {
      ...formData,
      sections: [...formData.sections, newSection],
    };

    // 3. Update the local state immediately for a responsive UI
    setFormData(newFormData);

    // 4. Persist the new, updated formData to the backend
    const { success, course } = await updateDraft(courseId, newFormData);

    // 5. Update IDs from the backend response
    if (success) {
      const createdSection = course.sections[course.sections.length - 1];
      setSectionId(createdSection._id);
      setLessonId(createdSection.lessons[0]._id);
    }
  };

  const handleRemoveSection = useCallback(
    (sIdx) =>
      setFormData((p) => ({
        ...p,
        sections: p.sections.filter((_, i) => i !== sIdx),
      })),
    []
  );

  useEffect(() => {
    if (sectionId) localStorage.setItem("sectionId", sectionId);
    if (lessonId) localStorage.setItem("lessonId", lessonId);
  }, [lessonId, sectionId]);

  const steps = [
    { name: "Details", icon: <FileText size={20} /> },
    { name: "Syllabus", icon: <ListOrdered size={20} /> },
    { name: "Media", icon: <Video size={20} /> },
    { name: "Publish", icon: <Rocket size={20} /> },
  ];

  // -----------------------------
  // UI (UNCHANGED)
  // -----------------------------
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
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-700/80 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
              <div className="flex gap-4 items-center justify-center">
                <button
                  type="button"
                  onClick={handleClearData}
                  disabled={isDeleting || isClearing}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-slate-700/80 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting || isClearing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <ClipboardMinus size={20} /> Clear
                    </>
                  )}
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
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default CourseCreation;

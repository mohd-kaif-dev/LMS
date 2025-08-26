// ======================================================================
// Form Step Components

import {
  DollarSign,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
  X,
  Rocket,
} from "lucide-react";
import { useEffect, useState } from "react";

// ======================================================================
const categories = [
  "Web Development",
  "UI/UX Design",
  "Animation",
  "Graphic Design",
  "Music",
  "Photography",
  "Business",
  "Marketing",
];

// ======================================================================
// Helper UI Components
// ======================================================================
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/20 ${className}`}
  >
    {children}
  </div>
);
const Input = (p) => (
  <input
    {...p}
    className={`w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${p.className}`}
  />
);
const Textarea = (p) => (
  <textarea
    {...p}
    className={`w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${p.className}`}
  />
);
const Select = (p) => (
  <select
    {...p}
    className={`w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${p.className}`}
  />
);

const SearchableDropdown = ({ items, placeholder, onSelect, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (value) {
      setSearchTerm(value);
    } else {
      setSearchTerm("");
    }
  }, [value]);

  return (
    <div className="relative w-full md:w-64">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSelect("");
              setIsOpen(false);
            }}
            className="-ml-8 text-slate-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-lg max-h-60 overflow-y-auto">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item}
                onClick={() => {
                  onSelect(item);
                  setSearchTerm(item);
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-sm hover:bg-slate-700 cursor-pointer"
              >
                {item}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-sm text-slate-500">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const UploadProgress = ({ progress }) => (
  <div className="w-full bg-slate-600 rounded-full h-2.5 my-2">
    <div
      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

export const StepOne = ({
  formData,
  handleChange,
  handleArrayChange,
  handleAddArrayItem,
  handleRemoveArrayItem,
  handleCategorySelect,
}) => (
  <div className="animate-fade-in space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-white mb-2">Course Information</h2>
      <p className="text-slate-400">
        Provide the core details for your course.
      </p>
    </div>
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Course Title
        </label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData?.title}
          onChange={handleChange}
          placeholder="e.g., The Complete Web Development Bootcamp"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Short Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData?.description}
          onChange={handleChange}
          rows="3"
          placeholder="A brief, catchy summary of the course."
        />
      </div>
      <div>
        <label
          htmlFor="detailedDescription"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Detailed Description
        </label>
        <Textarea
          id="detailedDescription"
          name="detailedDescription"
          value={formData?.detailedDescription}
          onChange={handleChange}
          rows="6"
          placeholder="A comprehensive overview of the course content, goals, and target audience."
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category
          </label>
          <SearchableDropdown
            items={categories}
            placeholder="Select a category"
            onSelect={handleCategorySelect}
            value={formData?.category}
          />
        </div>
        <div>
          <label
            htmlFor="dificulty"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Difficulty Level
          </label>
          <Select
            id="difficulty"
            name="difficulty"
            value={formData?.difficulty}
            onChange={handleChange}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Price (₹)
          </label>
          <div className="relative">
            <DollarSign
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="number"
              id="price"
              name="price"
              value={formData?.price}
              onChange={handleChange}
              placeholder="e.g., 499"
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Original Price (₹)
          </label>
          <div className="relative">
            <DollarSign
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={formData?.originalPrice}
              onChange={handleChange}
              placeholder="e.g., 2999"
              className="pl-10"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Learning Outcomes
        </label>
        {formData?.learningOutcomes?.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, "learningOutcomes")}
              placeholder="e.g., Build responsive websites with React"
            />
            {formData?.learningOutcomes?.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveArrayItem(index, "learningOutcomes")}
                className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddArrayItem("learningOutcomes")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-2 text-sm font-semibold"
        >
          <Plus size={16} />
          <span>Add learning outcome</span>
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Requirements
        </label>
        {formData?.requirements?.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(e, index, "requirements")}
              placeholder="e.g., A computer with internet access"
            />
            {formData?.requirements?.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveArrayItem(index, "requirements")}
                className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddArrayItem("requirements")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mt-2 text-sm font-semibold"
        >
          <Plus size={16} />
          <span>Add requirement</span>
        </button>
      </div>
    </div>
  </div>
);

export const StepTwo = ({
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
}) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Course Syllabus</h2>
      <p className="text-slate-400 mb-6">
        Structure your course by adding sections and lessons.
      </p>
      <div className="space-y-6">
        {formData.sections.map((section, sectionIndex) => (
          <GlassCard
            // ✅ FIX: Use a stable ID for the key. Fallback to index for new, unsaved items.
            key={section._id || `section-${sectionIndex}`}
            className="p-6 border-l-4 border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <Input
                value={section.title}
                onChange={(e) => handleSectionChange(e, sectionIndex, "title")}
                placeholder={`Section ${sectionIndex + 1}: e.g., Introduction`}
                className="text-lg font-bold !p-2"
              />
              {formData.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sectionIndex)}
                  className="ml-4 text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-slate-700">
              {section.lessons.map((lesson, lessonIndex) => (
                <div
                  // ✅ FIX: Use a stable ID for the lesson key as well.
                  key={lesson._id || `lesson-${lessonIndex}`}
                  className="p-4 bg-slate-700/30 rounded-lg space-y-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400 font-mono text-sm">
                      {lessonIndex + 1}
                    </span>
                    <Input
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "title"
                        )
                      }
                      placeholder="Lesson Title"
                    />
                    <Input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "duration"
                        )
                      }
                      placeholder="Duration (sec)"
                      className="w-32"
                    />
                    {section.lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveLesson(sectionIndex, lessonIndex)
                        }
                        className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <Input
                      value={lesson.videoUrl}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "videoUrl"
                        )
                      }
                      placeholder="Paste video URL"
                    />
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor={`lesson-video-upload-${sectionIndex}-${lessonIndex}`}
                        className="flex-1 text-center text-sm cursor-pointer py-2 px-3 bg-slate-600/50 hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        {isUploading &&
                        lessonBeingUploadedRef.current ===
                          `${sectionIndex}-${lessonIndex}` ? (
                          <>
                            <Loader2 size={16} className="animate-spin mr-4" />{" "}
                            Uploading...
                          </>
                        ) : (
                          "Upload video"
                        )}
                      </label>
                      <input
                        id={`lesson-video-upload-${sectionIndex}-${lessonIndex}`}
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleLessonVideoUpload(
                            e,
                            sectionIndex,
                            lessonIndex,
                            e.target.closest(".flex")
                          )
                        }
                        className="sr-only"
                      />
                    </div>
                  </div>
                  {lesson.uploadProgress > 0 && lesson.uploadProgress < 100 && (
                    <UploadProgress progress={lesson.uploadProgress} />
                  )}
                  <div>
                    <Textarea
                      value={lesson.description}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "description"
                        )
                      }
                      placeholder="Lesson description..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddLesson(sectionIndex)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
              >
                <Plus size={16} />
                <span>Add lesson</span>
              </button>
            </div>
          </GlassCard>
        ))}
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold py-2 px-4 border-2 border-slate-600 rounded-lg hover:bg-slate-700/50"
        >
          <Plus size={18} />
          <span>Add New Section</span>
        </button>
      </div>
    </div>
  );
};

export const StepThree = ({
  formData,
  handleChange,
  handleTrailerUpload,
  trailerUploadProgress,
  thumbnailPreview,
  handleThumbnailSelect,
  handleThumbnailUpload,
  isUploading,
}) => (
  <div className="animate-fade-in">
    <h2 className="text-3xl font-bold text-white mb-2">Media & Marketing</h2>
    <p className="text-slate-400 mb-6">
      Add a trailer and thumbnail to attract students.
    </p>
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Course Thumbnail
        </label>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex justify-center rounded-lg border border-dashed border-slate-600 px-6 py-10 hover:border-blue-500 transition-colors">
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
              <div className="mt-4 flex text-sm leading-6 text-slate-400">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-blue-400 hover:text-blue-300"
                >
                  <span>Select a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                PNG, JPG up to 10MB
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-2">Thumbnail Preview:</p>
            <div className="aspect-video rounded-lg bg-slate-700/50 border border-slate-600 flex items-center justify-center">
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-slate-500 text-sm">
                  No image selected
                </span>
              )}
            </div>
            <button
              onClick={handleThumbnailUpload}
              disabled={isUploading}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={20} /> Upload Thumbnail
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Course Trailer
        </label>
        <div className="grid grid-cols-2 gap-4 items-center">
          <Input
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            placeholder="Or paste a video URL"
          />
          <div className="flex items-center gap-2">
            <label
              htmlFor="trailer-video-upload"
              className="flex-1 text-center text-sm cursor-pointer py-3 px-3 bg-slate-600/50 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Upload Trailer Video
            </label>
            <input
              id="trailer-video-upload"
              type="file"
              accept="video/*"
              onChange={handleTrailerUpload}
              className="sr-only"
            />
          </div>
        </div>
        {trailerUploadProgress > 0 && trailerUploadProgress < 100 && (
          <UploadProgress progress={trailerUploadProgress} />
        )}
      </div>
    </div>
  </div>
);

export const StepFour = ({ formData }) => (
  <div className="animate-fade-in">
    <div className="text-center">
      <Rocket size={80} className="text-blue-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">
        Final Course Preview
      </h2>
      <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
        Review all your course details below. If everything looks good, you can
        submit it for publishing.
      </p>
    </div>
    <GlassCard className="p-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img
            src={
              formData.thumbnailUrl ||
              "https://placehold.co/400x250/1e293b/94a3b8?text=Thumbnail"
            }
            alt="Course thumbnail"
            className="rounded-lg aspect-video object-cover"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-2xl font-bold text-white">{formData.title}</h3>
          <p className="text-slate-300">{formData.description}</p>
          <div className="flex flex-wrap gap-4 text-sm pt-2">
            <span className="bg-slate-700 px-3 py-1 rounded-full">
              {formData.category}
            </span>
            <span className="bg-slate-700 px-3 py-1 rounded-full capitalize">
              {formData.difficulty}
            </span>
            <span className="text-xl font-bold text-blue-400">
              ₹{formData.price}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-white mb-2">Learning Outcomes</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
            {formData.learningOutcomes.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-2">Requirements</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
            {formData.requirements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h4 className="font-bold text-white mb-4 text-xl">Syllabus</h4>
        <div className="space-y-4">
          {formData.sections.map((section, sIdx) => (
            <div key={sIdx}>
              <h5 className="font-semibold text-blue-300">{section.title}</h5>
              <ul className="mt-2 space-y-2 pl-4 border-l border-slate-600">
                {section.lessons.map((lesson, lIdx) => (
                  <li key={lIdx} className="text-sm text-slate-300">
                    {lesson.title} -{" "}
                    <span className="text-slate-400">{lesson.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  </div>
);

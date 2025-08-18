import { useState } from "react";
import {
  FileText,
  Video,
  ListOrdered,
  Tag,
  Rocket,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import SearchableDropdown from "../common/SearchableDropdown";

const categories = [
  "Featured",
  "Web Design",
  "Music",
  "Drawing & Painting",
  "Animation",
  "Social Media",
  "Art & Illustration",
  "Coding Development",
  "UI/UX Design",
  "Creative Writing",
  "Digital Illustration",
  "Business",
  "Film & Video",
  "Web Development",
  "Freelance & Entrepreneurship",
  "Graphic Design",
  "Photography",
];

// ======================================================================
// CourseCreation Component - The main multi-step form
// ======================================================================
const CourseCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatYoullLearn: [""],
    difficulty: "beginner",
    category: "",
    tags: [""],
    trailerUrl: "",
    sections: [{ title: "", lessons: [{ title: "", videoUrl: "" }] }],
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (selectedCategory) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      category: selectedCategory,
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...formData[field]];
    newArray[index] = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleAddArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (index, field) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }));
  };

  const handleSectionChange = (e, sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].title = e.target.value;
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleLessonChange = (e, sectionIndex, lessonIndex, field) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].lessons[lessonIndex][field] = e.target.value;
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleAddLesson = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].lessons.push({ title: "", videoUrl: "" });
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleRemoveLesson = (sectionIndex, lessonIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleAddSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: "", lessons: [{ title: "", videoUrl: "" }] },
      ],
    }));
  };

  const handleRemoveSection = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections.splice(sectionIndex, 1);
    setFormData((prev) => ({ ...prev, sections: newSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Form Data:", formData);
    alert("Course submitted for review!");
  };

  const steps = [
    { name: "Course Details", icon: <FileText size={20} /> },
    { name: "Syllabus", icon: <ListOrdered size={20} /> },
    { name: "Media", icon: <Video size={20} /> },
    { name: "Publish", icon: <Rocket size={20} /> },
  ];

  // ======================================================================
  // Step 1: Course Details
  // ======================================================================
  const StepOne = () => (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Course Details</h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Course Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Introduction to Web Design"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Course Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Provide a detailed description of your course."
          ></textarea>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Category
            </label>
            <SearchableDropdown
              items={categories}
              placeholder="Select a category"
              onSelect={handleCategorySelect}
              value={formData.category}
            />
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-400 mb-1"
            >
              Difficulty Level
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="whatYoullLearn"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            What you'll learn
          </label>
          {formData.whatYoullLearn.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, index, "whatYoullLearn")}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., Create responsive websites with Tailwind CSS"
              />
              {formData.whatYoullLearn.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(index, "whatYoullLearn")}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("whatYoullLearn")}
            className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors mt-2"
          >
            <Plus size={16} />
            <span>Add another item</span>
          </button>
        </div>
      </div>
    </>
  );

  // ======================================================================
  // Step 2: Syllabus
  // ======================================================================
  const StepTwo = () => (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Course Syllabus</h2>
      <div className="space-y-6">
        {formData.sections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(e, sectionIndex)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Section Title"
              />
              {formData.sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSection(sectionIndex)}
                  className="ml-4 text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {section.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <div className="flex items-center space-x-2 flex-grow w-full">
                    <BookOpen
                      size={18}
                      className="text-gray-400 hidden sm:block"
                    />
                    <input
                      type="text"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "title"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Lesson Title"
                    />
                  </div>
                  <div className="flex items-center space-x-2 flex-grow w-full">
                    <Video
                      size={18}
                      className="text-gray-400 hidden sm:block"
                    />
                    <input
                      type="text"
                      value={lesson.videoUrl}
                      onChange={(e) =>
                        handleLessonChange(
                          e,
                          sectionIndex,
                          lessonIndex,
                          "videoUrl"
                        )
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Video URL"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveLesson(sectionIndex, lessonIndex)
                    }
                    className="text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddLesson(sectionIndex)}
                className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors mt-2"
              >
                <Plus size={16} />
                <span>Add a lesson</span>
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors mt-4 font-semibold"
        >
          <Plus size={18} />
          <span>Add a new section</span>
        </button>
      </div>
    </>
  );

  // ======================================================================
  // Step 3: Media
  // ======================================================================
  const StepThree = () => (
    <>
      <h2 className="text-3xl font-bold text-white mb-6">Course Media</h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="trailerUrl"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Course Trailer URL
          </label>
          <input
            type="text"
            id="trailerUrl"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., https://youtube.com/my-trailer"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Course Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Design, Photography, Marketing"
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Tags (keywords)
          </label>
          {formData.tags.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, index, "tags")}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., #vector, #illustration, #logo"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem(index, "tags")}
                  className="text-red-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={24} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddArrayItem("tags")}
            className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition-colors mt-2"
          >
            <Plus size={16} />
            <span>Add another tag</span>
          </button>
        </div>
      </div>
    </>
  );

  // ======================================================================
  // Step 4: Publish
  // ======================================================================
  const StepFour = () => (
    <div className="text-center">
      <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
      <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch!</h2>
      <p className="text-lg text-gray-400 mb-8">
        You've completed all the steps. Click the button below to submit your
        course for review.
      </p>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
        <h3 className="text-xl font-semibold text-white">
          Review your details:
        </h3>
        <p className="text-gray-400">
          <strong>Title:</strong> {formData.title || "N/A"}
        </p>
        <p className="text-gray-400">
          <strong>Category:</strong> {formData.category || "N/A"}
        </p>
        <p className="text-gray-400">
          <strong>Sections:</strong> {formData.sections.length}
        </p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne />;
      case 2:
        return <StepTwo />;
      case 3:
        return <StepThree />;
      case 4:
        return <StepFour />;
      default:
        return <StepOne />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Create a New Course
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Walk through the steps to get your course ready for the world.
        </p>

        {/* Stepper Navigation */}
        <div className="flex justify-between items-center mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex-1 flex flex-col items-center relative `}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 z-20 ${
                  index + 1 === currentStep
                    ? "bg-green-500 text-black"
                    : index + 1 < currentStep
                    ? "bg-gray-700 text-green-500"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p
                className={`mt-2 text-center text-sm font-medium hidden md:block ${
                  index + 1 <= currentStep ? "text-white" : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
              {index < steps.length - 1 && (
                <div
                  className={`absolute w-full h-1 top-5 -translate-y-1/2 left-1/2 -ml-2 rounded-full transition-colors duration-200 z-10 ${
                    index + 1 < currentStep ? "bg-green-500" : "bg-gray-700"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronLeft size={20} />
                  <span>Back</span>
                </button>
              )}
              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
                    currentStep === 1 ? "ml-auto" : ""
                  } bg-green-500 text-black hover:bg-green-600`}
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="ml-auto px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200"
                >
                  Publish Course
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;

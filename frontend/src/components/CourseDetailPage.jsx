import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { FaBeer, FaPlay } from "react-icons/fa";

const API = import.meta.env.VITE_BACKEND_URL;

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState(null); // For accordion toggle

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API}/api/courses/${courseId}`);
        setCourse(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="p-6 text-center">Loading course details...</div>;
  }

  if (!course) {
    return <div className="p-6 text-center text-red-500">Course not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full md:w-72 h-48 object-cover rounded-lg shadow-md"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-500 mt-1">{course.category}</p>
          <p className="mt-4 text-gray-700">{course.description}</p>
          <p className="mt-4 text-xl font-semibold">
            {course.price ? `₹${course.price.toFixed(2)}` : "N/A"}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Instructor: {course.instructor?.name || "Unknown"}
          </p>
        </div>
      </div>

      {/* Learning outcomes & requirements */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {course.learningOutcomes?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">What you'll learn</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {course.learningOutcomes.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {course.requirements?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Requirements</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {course.requirements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Course structure */}
      {course.sections?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
          <div className="space-y-4">
            {course.sections.map((section, secIdx) => {
              const isOpen = openSection === secIdx;
              return (
                <div
                  key={section._id || secIdx}
                  className="border rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200"
                    onClick={() => setOpenSection(isOpen ? null : secIdx)}
                  >
                    <span className="font-medium">
                      Section {secIdx + 1}: {section.title}
                    </span>
                    <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && (
                    <div className="bg-white px-4 py-3">
                      {section.lessons?.length > 0 ? (
                        <ul className="space-y-2">
                          {section.lessons.map((lesson, lesIdx) => (
                            <li
                              key={lesson._id || lesIdx}
                              className="flex justify-between gap-2 border p-2 rounded hover:bg-gray-50 cursor-pointer"
                            >
                              <div className="flex gap-2">
                                <FaPlay size={18} className="text-blue-500" />
                                <span>
                                  {lesson.title || `Lesson ${lesIdx + 1}`}
                                </span>
                                {lesson.duration && (
                                  <span className="ml-auto text-gray-500">
                                    {lesson.duration} minutes
                                  </span>
                                )}
                              </div>
                              {lesson.videoUrl && (
                                <div className="mt-2 max-w-md">
                                  <video src={lesson.videoUrl} controls></video>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          No lessons in this section yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;

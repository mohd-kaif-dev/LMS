import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        return u?.token || u?.user?.token || null;
      } catch {
        return null;
      }
    })();
  return token
    ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` }
    : {};
};

export default function CourseCreation1() {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: 0,
    requirements: "",
    learningOutcomes: "",
  });

  // thumbnail
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  // curriculum state (sections & lessons)
  const [sections, setSections] = useState([]); // each section: { _id?, title, lessons: [{ _id?, title, description, videoUrl, videoPublicId }] }
  const [newSectionTitle, setNewSectionTitle] = useState("");
  // map sectionId -> current lesson form { title, description, file, uploading, progress }
  const [lessonForms, setLessonForms] = useState({});

  const [loading, setLoading] = useState(false);

  // helper to fetch the course (useful after server updates)
  const fetchCourseById = async (id) => {
    try {
      const res = await axios.get(`${API}/api/courses/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      const course = res.data;
      setSections(course.sections || []);
    } catch (err) {
      console.error(
        "fetchCourseById error",
        err?.response?.data || err.message
      );
    }
  };

  // Step 1: Create draft
  const createDraft = async () => {
    if (!formData.title || !formData.category)
      return alert("Title & category required");
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/courses`,
        { title: formData.title, category: formData.category },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setCourseId(res.data._id);
      // fetch to get current sections (likely empty)
      await fetchCourseById(res.data._id);
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Could not create draft");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Update draft details
  const updateDraft = async () => {
    setLoading(true);
    try {
      const updates = {
        description: formData.description,
        price: formData.price,
        requirements: formData.requirements
          ? formData.requirements
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        learningOutcomes: formData.learningOutcomes
          ? formData.learningOutcomes
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };
      await axios.patch(`${API}/api/courses/${courseId}`, updates, {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        withCredentials: true,
      });
      await fetchCourseById(courseId);
      setStep(3);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error updating draft");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Upload thumbnail
  const uploadThumbnail = async () => {
    if (!thumbnail) return alert("Select thumbnail");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("thumbnail", thumbnail);
      await axios.put(`${API}/api/courses/${courseId}/thumbnail`, fd, {
        headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      // reload course to get thumbnail data
      await fetchCourseById(courseId);
      setStep(4); // move to curriculum
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Thumbnail upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Curriculum functions
  // create a new section on server by sending updated sections array (we fetch current sections, append, then PATCH)
  const addSection = async () => {
    const title = (newSectionTitle || "").trim();
    if (!title) return alert("Section title required");
    setLoading(true);
    try {
      // append new section locally and send full sections array to backend
      const updatedSections = [...sections, { title, lessons: [] }];
      await axios.patch(
        `${API}/api/courses/${courseId}`,
        { sections: updatedSections },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // refresh from server to get section _id
      await fetchCourseById(courseId);
      setNewSectionTitle("");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to add section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseById(courseId);
    }
  }, [courseId]);

  // // init lesson form for a section
  // const initLessonForm = (sectionId) => {
  //   setLessonForms((prev) => ({
  //     ...prev,
  //     [sectionId]: prev[sectionId] || {
  //       title: "",
  //       description: "",
  //       file: null,
  //       uploading: false,
  //       progress: 0,
  //     },
  //   }));
  // };

  const handleLessonFormChange = (sectionId, field, value) => {
    setLessonForms((prev) => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [field]: value },
    }));
  };

  // upload a lesson's video to server (one by one)
  const uploadLesson = async (sectionId) => {
    const form = lessonForms[sectionId];
    if (!form) return alert("Fill lesson details first");
    if (!form.title) return alert("Lesson title required");
    if (!form.file) return alert("Select a video file");

    setLessonForms((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], uploading: true, progress: 0 },
    }));

    try {
      const fd = new FormData();
      fd.append("video", form.file);
      fd.append("title", form.title);
      if (form.description) fd.append("description", form.description);
      if (form.duration) fd.append("duration", form.duration);

      const res = await axios.post(
        `${API}/api/courses/${courseId}/sections/${sectionId}/lessons`,
        fd,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const pct = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLessonForms((prev) => ({
              ...prev,
              [sectionId]: { ...(prev[sectionId] || {}), progress: pct },
            }));
          },
        }
      );

      // backend returns updated course; refresh sections
      const updatedCourse = res.data;
      setSections(updatedCourse.sections || []);
      // reset lesson form for this section
      setLessonForms((prev) => ({
        ...prev,
        [sectionId]: {
          title: "",
          description: "",
          file: null,
          uploading: false,
          progress: 0,
        },
      }));
    } catch (err) {
      console.error("uploadLesson error", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Lesson upload failed");
      setLessonForms((prev) => ({
        ...prev,
        [sectionId]: { ...(prev[sectionId] || {}), uploading: false },
      }));
    }
  };

  // utility: check at least one lesson exists across all sections
  const hasAtLeastOneLesson = () => {
    return sections.some(
      (s) => Array.isArray(s.lessons) && s.lessons.length > 0
    );
  };

  // Step 5: Preview & Publish
  const publishCourse = async () => {
    if (!hasAtLeastOneLesson())
      return alert("Please add at least one lesson before publishing.");
    setLoading(true);
    try {
      await axios.put(
        `${API}/api/courses/${courseId}/publish`,
        {},
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      alert("Course published!");
      // reset form
      setStep(1);
      setCourseId(null);
      setFormData({
        title: "",
        category: "",
        description: "",
        price: 0,
        requirements: "",
        learningOutcomes: "",
      });
      setThumbnail(null);
      setThumbnailPreview(null);
      setSections([]);
      setLessonForms({});
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Publish failed");
    } finally {
      setLoading(false);
    }
  };

  // when entering curriculum step, fetch latest course sections
  useEffect(() => {
    if (step === 4 && courseId) {
      fetchCourseById(courseId);
    }
  }, [step, courseId]);

  // UI navigation helpers
  const nextStep = async () => {
    if (step === 1) return createDraft();
    if (step === 2) return updateDraft();
    if (step === 3) return uploadThumbnail();
    if (step === 4) {
      if (!hasAtLeastOneLesson())
        return alert("Please add at least one lesson before proceeding.");
      setStep(5);
      return;
    }
    setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Create Course — Step {step} / 5
      </h2>

      {/* Step UI */}
      {step === 1 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <label className="block text-sm font-medium">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded h-32"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Requirements (comma separated)
              </label>
              <input
                name="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  setFormData({ ...formData, requirements: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <label className="block text-sm font-medium">
            Learning Outcomes (comma separated)
          </label>
          <input
            name="learningOutcomes"
            value={formData.learningOutcomes}
            onChange={(e) =>
              setFormData({ ...formData, learningOutcomes: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              setThumbnailPreview(
                e.target.files[0]
                  ? URL.createObjectURL(e.target.files[0])
                  : null
              );
            }}
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="thumb"
              className="w-full h-44 object-cover rounded border mt-2"
            />
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="border p-3 rounded">
            <h3 className="font-semibold">Add Sections</h3>
            <div className="flex gap-2 mt-2">
              <input
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                placeholder="Section title"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addSection}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add Section
              </button>
            </div>
          </div>

          <div>
            {sections.length === 0 ? (
              <p className="text-sm text-gray-500">
                No sections yet. Add a section and then add lessons inside it.
              </p>
            ) : (
              sections.map((s) => (
                <div key={s._id || s.title} className="mb-4 border rounded p-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{s.title}</h4>
                    <span className="text-sm text-gray-500">
                      {(s.lessons || []).length} lessons
                    </span>
                  </div>

                  {/* lesson list */}
                  <div className="mt-2 space-y-2">
                    {(s.lessons || []).map((l) => (
                      <div
                        key={l._id || l.title}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded"
                      >
                        <div>
                          <div className="font-medium">{l.title}</div>
                          <div className="text-xs text-gray-500">
                            {l.description || ""}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {l.videoUrl ? "Uploaded" : "No video"}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* add lesson form */}
                  <div className="mt-3 border-t pt-3">
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Lesson title"
                      value={lessonForms[s._id]?.title || ""}
                      onChange={(e) =>
                        handleLessonFormChange(s._id, "title", e.target.value)
                      }
                    />
                    <input
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Lesson description (optional)"
                      value={lessonForms[s._id]?.description || ""}
                      onChange={(e) =>
                        handleLessonFormChange(
                          s._id,
                          "description",
                          e.target.value
                        )
                      }
                    />

                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleLessonFormChange(
                            s._id,
                            "file",
                            e.target.files[0]
                          )
                        }
                      />
                      <button
                        onClick={() => uploadLesson(s._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        disabled={lessonForms[s._id]?.uploading}
                      >
                        {lessonForms[s._id]?.uploading
                          ? `${lessonForms[s._id].progress || 0}%`
                          : "Upload Lesson"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
          <h3 className="font-semibold">Preview</h3>
          <div className="border p-3 rounded">
            <p>
              <strong>Title:</strong> {formData.title}
            </p>
            <p>
              <strong>Category:</strong> {formData.category}
            </p>
            <p>
              <strong>Description:</strong> {formData.description}
            </p>
            <p>
              <strong>Price:</strong> ${formData.price}
            </p>
            <p>
              <strong>Requirements:</strong> {formData.requirements}
            </p>
            <p>
              <strong>Learning Outcomes:</strong> {formData.learningOutcomes}
            </p>
            <p className="mt-2">
              <strong>Sections:</strong>
            </p>
            {sections.map((s) => (
              <div key={s._id || s.title} className="border p-2 rounded my-2">
                <div className="font-medium">{s.title}</div>
                <ul className="list-disc ml-5 mt-1">
                  {(s.lessons || []).map((l) => (
                    <li key={l._id || l.title}>
                      {l.title} {l.videoUrl ? "(video uploaded)" : "(no video)"}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {thumbnailPreview && (
              <div className="mt-3">
                <strong>Thumbnail preview:</strong>
                <img
                  src={thumbnailPreview}
                  alt="thumb"
                  className="w-full h-44 object-cover mt-2 rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* nav buttons */}
      <div className="mt-6 flex justify-between">
        <div>
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Prev
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {step < 5 && (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {step === 4 ? "Proceed to Preview" : "Next"}
            </button>
          )}
          {step === 5 && (
            <button
              onClick={publishCourse}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Publish Course
            </button>
          )}
        </div>
      </div>

      {loading && <div className="mt-4 text-sm text-gray-500">Processing…</div>}
    </div>
  );
}

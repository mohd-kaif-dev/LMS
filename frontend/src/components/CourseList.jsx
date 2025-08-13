import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    (() => {
      try {
        const u = JSON.parse(localStorage.getItem("user"));
        return u?.token || u?.user?.token || u?.accessToken || null;
      } catch {
        return null;
      }
    })();

  if (token) {
    const headerVal = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    return {
      Authorization: headerVal,
    };
  }
  return {};
};

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewThumbnailUrl, setPreviewThumbnailUrl] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    requirements: "",
    learningOutcomes: "",
  });

  // NEW: sections + lesson form state
  const [sections, setSections] = useState([]); // array of { _id, title, lessons: [...] }
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [lessonForms, setLessonForms] = useState({}); // { [sectionId]: { title, description, file, uploading, progress } }

  const navigate = useNavigate();
  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/courses`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed fetching courses");
    } finally {
      setLoading(false);
    }
  };

  // fetch a full course by id (used by modal to get sections & lessons)
  const fetchCourseById = async (courseId) => {
    try {
      const res = await axios.get(`${API_BASE}/api/courses/${courseId}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      console.log("Fetched course data", res.data);
      return res.data;
    } catch (err) {
      console.error("fetchCourseById", err?.response?.data || err.message);
      return null;
    }
  };

  // open modal AND load full course (sections & lessons)
  const openEditModal = async (course) => {
    if (course.published || course.status === "published") {
      alert("Published courses cannot be edited. Please unpublish first.");
      return;
    }

    // Prefill simple fields
    setForm({
      title: course.title || "",
      category: course.category || "",
      description: course.description || "",
      price: course.price || 0,
      requirements: (course.requirements || []).join(", "),
      learningOutcomes: (course.learningOutcomes || []).join(", "),
    });

    setPreviewThumbnailUrl(course.thumbnailUrl || course.thumbnail || "");
    setThumbnailFile(null);
    setEditingCourse(course);
    setModalOpen(true);

    console.log("Editing course:", sections);

    // load full course to get sections + lessons
    const full = await fetchCourseById(course._id);
    console.log("Full", full);
    if (full?.sections?.length > 0) {
      console.log("inside");
      setSections((prev) => [...prev, ...full.sections]);
      console.log("section inside: ", sections);
      // initialize lessonForms for each section
      const initialLessonForms = {};
      (full.sections || []).forEach((s) => {
        initialLessonForms[s._id] = {
          title: "",
          description: "",
          file: null,
          uploading: false,
          progress: 0,
        };
      });
      setLessonForms(initialLessonForms);
    } else {
      console.log("outside");
      setSections([]);
      setLessonForms({});
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCourse(null);
    setForm({
      title: "",
      category: "",
      description: "",
      price: "",
      requirements: "",
      learningOutcomes: "",
    });
    setThumbnailFile(null);
    setPreviewThumbnailUrl(null);
    setSections([]);
    setNewSectionTitle("");
    setLessonForms({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    setThumbnailFile(file);
    if (file) setPreviewThumbnailUrl(URL.createObjectURL(file));
  };

  // Save text fields + sections to backend
  const saveCourseChanges = async () => {
    if (!editingCourse) return;
    setSaving(true);
    try {
      // 1) Update text fields
      const updates = {
        title: form.title,
        category: form.category,
        description: form.description,
        price: Number(form.price || 0),
        requirements: form.requirements
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean),
        learningOutcomes: form.learningOutcomes
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
      };

      await axios.patch(
        `${API_BASE}/api/courses/${editingCourse._id}`,
        updates,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // 2) Upload thumbnail if changed
      if (thumbnailFile) {
        const fd = new FormData();
        fd.append("thumbnail", thumbnailFile);
        await axios.put(
          `${API_BASE}/api/courses/${editingCourse._id}/thumbnail`,
          fd,
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      // 3) Save sections (if any changes were made)
      // We send the whole sections array to PATCH so backend replaces sections field.
      // This keeps backend simpler and works with the PATCH route you already have.
      await axios.patch(
        `${API_BASE}/api/courses/${editingCourse._id}`,
        { sections },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Refresh lists and close
      await fetchCourses();
      closeModal();
      alert("Course updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving course");
    } finally {
      setSaving(false);
    }
  };

  // Publish / Unpublish course (unchanged)
  const handlePublishToggle = async (course) => {
    if (!course) return;
    const confirmMsg = course.published
      ? "Unpublish this course?"
      : "Publish this course?";
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.put(
        `${API_BASE}/api/courses/${course._id}/publish`,
        {},
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      await fetchCourses();
      alert(
        `Course ${course.title} ${
          course.published ? "unpublished" : "published"
        } successfully`
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed toggling publish");
    }
  };

  // Delete course (unchanged)
  const handleDeleteCourse = async (course) => {
    if (!course) return;
    const ok = window.confirm(
      `Are you sure you want to permanently delete "${course.title}"?`
    );
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/api/courses/${course._id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      await fetchCourses();
      alert("Course deleted");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed deleting course");
    }
  };

  //
  // ===== Section & Lesson helpers (new)
  //

  // Add new section (saves immediately via PATCH, then refreshes course sections)
  const addSection = async () => {
    const title = (newSectionTitle || "").trim();
    if (!title) return alert("Enter a section title");
    try {
      const updatedSections = [...sections, { title, lessons: [] }];
      // Save full sections array to the course
      await axios.patch(
        `${API_BASE}/api/courses/${editingCourse._id}`,
        { sections: updatedSections },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // re-fetch course sections
      const updated = await fetchCourseById(editingCourse._id);
      console.log("Course Updated: ", updated);
      setSections(updated?.sections || []);
      setNewSectionTitle("");
      // initialize form slot for new section
      setLessonForms((prev) => ({
        ...(prev || {}),
        ...(updated?.sections?.reduce?.(
          (acc, s) => ({
            ...acc,
            [s._id]: prev?.[s._id] || {
              title: "",
              description: "",
              file: null,
              uploading: false,
              progress: 0,
            },
          }),
          {}
        ) || {}),
      }));
    } catch (err) {
      console.error("addSection", err?.response?.data || err.message);
      alert("Failed to add section");
    }
  };

  // Update section title locally (and optionally save immediately)
  const updateSectionTitle = (sectionId, value) => {
    const updated = sections.map((s) =>
      s._id === sectionId ? { ...s, title: value } : s
    );
    setSections(updated);
  };

  // Persist section title change to server
  const persistSections = async () => {
    try {
      await axios.patch(
        `${API_BASE}/api/courses/${editingCourse._id}`,
        { sections },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const updated = await fetchCourseById(editingCourse._id);
      setSections(updated?.sections || []);
      alert("Sections saved");
    } catch (err) {
      console.error("persistSections", err?.response?.data || err.message);
      alert("Failed to save sections");
    }
  };

  // Remove section
  const removeSection = async (sectionId) => {
    if (
      !window.confirm(
        "Remove this section? This will delete its lessons from the course."
      )
    )
      return;
    try {
      const updated = sections.filter((s) => s._id !== sectionId);
      await axios.patch(
        `${API_BASE}/api/courses/${editingCourse._id}`,
        { sections: updated },
        {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const re = await fetchCourseById(editingCourse._id);
      setSections(re?.sections || []);
      setLessonForms((p) => {
        const copy = { ...(p || {}) };
        delete copy[sectionId];
        return copy;
      });
    } catch (err) {
      console.error("removeSection", err?.response?.data || err.message);
      alert("Failed removing section");
    }
  };

  //   // Lesson form handlers
  //   const initLessonFormFor = (sectionId) => {
  //     setLessonForms((p) => ({
  //       ...(p || {}),
  //       [sectionId]: p?.[sectionId] || {
  //         title: "",
  //         description: "",
  //         file: null,
  //         uploading: false,
  //         progress: 0,
  //       },
  //     }));
  //   };

  const handleLessonField = (sectionId, field, val) => {
    setLessonForms((p) => ({
      ...(p || {}),
      [sectionId]: { ...(p?.[sectionId] || {}), [field]: val },
    }));
  };

  // Upload lesson video + metadata to backend
  const uploadLesson = async (sectionId) => {
    const formObj = lessonForms?.[sectionId];
    if (!formObj) return alert("Complete lesson fields");
    if (!formObj.title || !formObj.file)
      return alert("Lesson title and video file required");

    try {
      setLessonForms((p) => ({
        ...(p || {}),
        [sectionId]: {
          ...(p?.[sectionId] || {}),
          uploading: true,
          progress: 0,
        },
      }));

      const fd = new FormData();
      fd.append("title", formObj.title);
      if (formObj.description) fd.append("description", formObj.description);
      fd.append("video", formObj.file);

      // POST to the add-lesson endpoint (expects server to accept multipart & add lesson to section)
      const res = await axios.put(
        `${API_BASE}/api/courses/${editingCourse._id}/sections/${sectionId}/lessons`,
        fd,
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setLessonForms((p) => ({
              ...(p || {}),
              [sectionId]: { ...(p?.[sectionId] || {}), progress: pct },
            }));
          },
        }
      );

      // Prefer server-returned updated course/sections in response; otherwise re-fetch
      if (res.data?.sections) {
        setSections(res.data.sections);
      } else {
        const re = await fetchCourseById(editingCourse._id);
        setSections(re?.sections || []);
      }

      // reset form for this section
      setLessonForms((p) => ({
        ...(p || {}),
        [sectionId]: {
          title: "",
          description: "",
          file: null,
          uploading: false,
          progress: 0,
        },
      }));
    } catch (err) {
      console.error("uploadLesson", err?.response?.data || err.message);
      alert(err.response?.data?.message || "Lesson upload failed");
      setLessonForms((p) => ({
        ...(p || {}),
        [sectionId]: { ...(p?.[sectionId] || {}), uploading: false },
      }));
    }
  };

  // Delete a lesson (best if backend supports this endpoint)
  const deleteLesson = async (sectionId, lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    try {
      // try delete endpoint first
      await axios.delete(
        `${API_BASE}/api/courses/${editingCourse._id}/sections/${sectionId}/lessons/${lessonId}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      // refresh sections
      const re = await fetchCourseById(editingCourse._id);
      setSections(re?.sections || []);
    } catch (err) {
      // fallback: if delete endpoint doesn't exist, remove locally and PATCH sections
      console.warn(
        "deleteLesson failed; trying patch fallback",
        err?.response?.data || err.message
      );
      try {
        const updatedSections = sections.map((s) => {
          if (s._id !== sectionId) return s;
          return {
            ...s,
            lessons: (s.lessons || []).filter((l) => l._id !== lessonId),
          };
        });
        await axios.patch(
          `${API_BASE}/api/courses/${editingCourse._id}`,
          { sections: updatedSections },
          {
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const re = await fetchCourseById(editingCourse._id);
        setSections(re?.sections || []);
      } catch (err2) {
        console.error(
          "deleteLesson fallback failed",
          err2?.response?.data || err2.message
        );
        alert("Failed to delete lesson");
      }
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Render helpers
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
        <p className="mt-3 text-gray-500">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
        <button
          onClick={fetchCourses}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
        <button
          onClick={fetchCourses}
          className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No courses created yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col relative"
            >
              <div
                onClick={() => navigate(`/course/${course._id}`)}
                className="h-40 w-full bg-gray-100 rounded overflow-hidden mb-3"
              >
                {course.thumbnailUrl || course.thumbnail ? (
                  <img
                    src={course.thumbnailUrl || course.thumbnail}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.category}</p>
                <p>{course.price ? `₹${course.price}` : "N/A"}</p>

                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {course.description || "No description"}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 ">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium absolute top-2 left-2 ${
                        course.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-gray-500">
                      {course.studentsEnrolled?.length || 0} students
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!course.published && (
                      <button
                        onClick={() => openEditModal(course)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handlePublishToggle(course)}
                      className={`px-3 py-1 text-white rounded text-sm ${
                        course.published ? "bg-gray-500" : "bg-green-600"
                      }`}
                    >
                      {course.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && editingCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white rounded-lg max-w-3xl w-full overflow-auto max-h-[90vh] p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Course</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-3">
              {/* Basic fields */}
              <label className="text-sm font-medium">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <label className="text-sm font-medium">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                className="w-full p-2 border rounded h-28"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Students</label>
                  <input
                    value={editingCourse.studentsEnrolled?.length || 0}
                    disabled
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </div>
              </div>

              <label className="text-sm font-medium">
                Requirements (comma separated)
              </label>
              <input
                name="requirements"
                value={form.requirements}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              <label className="text-sm font-medium">
                Learning Outcomes (comma separated)
              </label>
              <input
                name="learningOutcomes"
                value={form.learningOutcomes}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              />

              {/* Thumbnail */}
              <div>
                <label className="text-sm font-medium">Thumbnail</label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                  />
                  {previewThumbnailUrl && (
                    <img
                      src={previewThumbnailUrl}
                      alt="thumb-preview"
                      className="w-24 h-16 object-cover rounded border"
                    />
                  )}
                </div>
              </div>

              {/* Sections & Lessons */}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-semibold">Sections & Lessons</h3>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="New section title"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      className="p-2 border rounded"
                    />
                    <button
                      onClick={addSection}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Add Section
                    </button>
                    <button
                      onClick={persistSections}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      Save Sections
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {sections.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No sections yet. Add one above.
                    </p>
                  )}

                  {sections.map((sec) => (
                    <div
                      key={sec._id || sec.title}
                      className="border rounded p-3 bg-gray-50"
                    >
                      <div className="flex items-start justify-between">
                        <input
                          value={sec.title}
                          onChange={(e) =>
                            updateSectionTitle(sec._id, e.target.value)
                          }
                          className="font-semibold text-lg p-1 border-b bg-transparent"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeSection(sec._id)}
                            className="text-sm text-red-600"
                          >
                            Delete Section
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="space-y-2">
                          {(sec.lessons || []).map((l) => (
                            <div
                              key={l._id || l.title}
                              className="flex items-center justify-between bg-white p-2 rounded"
                            >
                              <div>
                                <div className="font-medium">{l.title}</div>
                                <div className="text-sm text-gray-500">
                                  {l.description || ""}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {l.videoUrl ? "Video" : "No video"}
                                </span>
                                <button
                                  onClick={() => deleteLesson(sec._id, l._id)}
                                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add lesson form */}
                        <div className="mt-3 grid gap-2">
                          <input
                            value={lessonForms[sec._id]?.title || ""}
                            onChange={(e) =>
                              handleLessonField(
                                sec._id,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Lesson title"
                            className="p-2 border rounded"
                          />
                          <input
                            value={lessonForms[sec._id]?.description || ""}
                            onChange={(e) =>
                              handleLessonField(
                                sec._id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Lesson description (optional)"
                            className="p-2 border rounded"
                          />
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) =>
                              handleLessonField(
                                sec._id,
                                "file",
                                e.target.files[0]
                              )
                            }
                          />
                          <div className="flex items-center gap-2">
                            <button
                              disabled={lessonForms[sec._id]?.uploading}
                              onClick={() => uploadLesson(sec._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                              {lessonForms[sec._id]?.uploading
                                ? `${lessonForms[sec._id]?.progress || 0}%`
                                : "Upload Lesson"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* action buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCourseChanges}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

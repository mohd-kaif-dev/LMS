import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Users,
  BookOpen,
  Shield,
  Bell,
  Save,
  CheckCircle,
} from "lucide-react";

// ======================================================================
// SettingsFormGroup Component - A reusable container for settings sections
// ======================================================================
const SettingsFormGroup = ({ title, children }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-3">
        {title}
      </h3>
      <div className="space-y-6">{children}</div>
    </div>
  );
};

// ======================================================================
// InputField Component - Reusable component for form inputs
// ======================================================================
const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div>
    <label className="block text-gray-400 text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
    />
  </div>
);

// ======================================================================
// AdminSettings Component - The main component for admin settings
// ======================================================================
const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Learn Sphere",
    contactEmail: "support@learnsphere.com",
  });

  const [userSettings, setUserSettings] = useState({
    defaultRole: "student",
    enableRegistration: true,
  });

  const [contentSettings, setContentSettings] = useState({
    autoApproveCourses: false,
    defaultCourseStatus: "Draft",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({ ...generalSettings, [name]: value });
  };

  const handleUserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSettings({
      ...userSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleContentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContentSettings({
      ...contentSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNotificationChange = (e) => {
    const { name, type, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: type === "checkbox" ? checked : checked,
    });
  };

  const handleSave = () => {
    console.log("Saving settings...");
    console.log("General:", generalSettings);
    console.log("Users:", userSettings);
    console.log("Content:", contentSettings);
    console.log("Notifications:", notificationSettings);
    // Here you would typically make an API call to save the settings to the backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <SettingsIcon size={40} className="text-green-500" />
          <h1 className="text-4xl md:text-5xl font-bold">Settings</h1>
        </div>
        <p className="text-lg text-gray-400 mb-12">
          Manage and configure core aspects of your platform.
        </p>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <SettingsFormGroup title="General Settings">
            <InputField
              label="Site Name"
              name="siteName"
              value={generalSettings.siteName}
              onChange={handleGeneralChange}
            />
            <InputField
              label="Contact Email"
              name="contactEmail"
              type="email"
              value={generalSettings.contactEmail}
              onChange={handleGeneralChange}
            />
          </SettingsFormGroup>

          {/* User Management */}
          <SettingsFormGroup title="User Management">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Default New User Role
              </label>
              <select
                name="defaultRole"
                value={userSettings.defaultRole}
                onChange={handleUserChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableRegistration"
                name="enableRegistration"
                checked={userSettings.enableRegistration}
                onChange={handleUserChange}
                className="h-5 w-5 text-green-500 rounded border-gray-600 focus:ring-green-500 bg-gray-700"
              />
              <label
                htmlFor="enableRegistration"
                className="ml-2 text-gray-300"
              >
                Allow new user registration
              </label>
            </div>
          </SettingsFormGroup>

          {/* Content Management */}
          <SettingsFormGroup title="Content Management">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoApproveCourses"
                name="autoApproveCourses"
                checked={contentSettings.autoApproveCourses}
                onChange={handleContentChange}
                className="h-5 w-5 text-green-500 rounded border-gray-600 focus:ring-green-500 bg-gray-700"
              />
              <label
                htmlFor="autoApproveCourses"
                className="ml-2 text-gray-300"
              >
                Automatically approve new courses
              </label>
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-1">
                Default New Course Status
              </label>
              <select
                name="defaultCourseStatus"
                value={contentSettings.defaultCourseStatus}
                onChange={handleContentChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending Review</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </SettingsFormGroup>

          {/* Notifications */}
          <SettingsFormGroup title="Notifications">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-green-500 rounded border-gray-600 focus:ring-green-500 bg-gray-700"
              />
              <label
                htmlFor="emailNotifications"
                className="ml-2 text-gray-300"
              >
                Enable email notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weeklyDigest"
                name="weeklyDigest"
                checked={notificationSettings.weeklyDigest}
                onChange={handleNotificationChange}
                className="h-5 w-5 text-green-500 rounded border-gray-600 focus:ring-green-500 bg-gray-700"
              />
              <label htmlFor="weeklyDigest" className="ml-2 text-gray-300">
                Send weekly platform digest
              </label>
            </div>
          </SettingsFormGroup>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-600 transition-colors duration-200 shadow-lg"
          >
            <Save size={20} />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

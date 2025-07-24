import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  Shield,
  Star,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, updateUser } from "../../store/slices/user";
import { useLocation, useNavigate } from "react-router-dom";

interface UserEditFormProps {
  // Optionally accept initial values or handlers as props
}

const UserEditForm: React.FC<UserEditFormProps> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const { userDetails, loading } = useSelector((state: any) => state.users);

  const [form, setForm] = useState({
    username: "",
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "",
    gender: "",
    lifestyle: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    latitude: 0,
    longitude: 0,
    timezone: "",
    karmaType: "",
    grade: "",
    isActive: true,
    isBlocked: false,
    blockedReason: "",
  });

  const [activeTab, setActiveTab] = useState("personal");

  // Fetch user by id on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [userId, dispatch]);

  // Populate form when userDetails is loaded
  useEffect(() => {
    console.log("userDetails:", userDetails);
    if (userDetails) {
      setForm((prev) => ({
        ...prev,
        ...userDetails,
        dateOfBirth: userDetails.date_of_birth || "",
        timeOfBirth: userDetails.time_of_birth || "",
        placeOfBirth: userDetails.place_of_birth || "",
        karmaType: userDetails.karma_type || "",
        phoneNumber: userDetails.phone_number || "",
        countryCode: userDetails.country_code || "",
      }));
    }
  }, [userDetails]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as any;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    // Prepare update payload (remove fields not needed by API)
    const updatePayload = {
      user_id: userId,
      name: form.name,
      email: form.email,
      phone_number: form.phoneNumber,
      country_code: form.countryCode,
      gender: form.gender,
      lifestyle: form.lifestyle,
      date_of_birth: form.dateOfBirth,
      time_of_birth: form.timeOfBirth,
      place_of_birth: form.placeOfBirth,
      latitude: form.latitude,
      longitude: form.longitude,
      timezone: form.timezone,
      karma_type: form.karmaType,
      grade: form.grade,
      is_active: form.active,
      is_blocked: form.isBlocked,
      block_reason: form.blockedReason,
      // Add other fields as needed
    };
    const resultAction = await dispatch(updateUser(updatePayload));
    if (updateUser.fulfilled.match(resultAction)) {
      navigate("/users"); // Redirect to user list after save
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    icon: Icon,
    ...props
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            Icon ? "pl-12" : ""
          }`}
          name={name}
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          required={required}
          {...props}
        />
      </div>
    </div>
  );

  const SelectField = ({
    label,
    name,
    options,
    required = false,
    icon: Icon,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <select
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            Icon ? "pl-12" : ""
          }`}
          name={name}
          value={form[name]}
          onChange={handleChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const TextareaField = ({ label, name, placeholder, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        required={required}
        rows={3}
      />
    </div>
  );

  const CheckboxField = ({ label, name }) => (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        name={name}
        checked={form[name]}
        onChange={handleChange}
        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label className="text-sm font-medium text-gray-700">{label}</label>
    </div>
  );

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors duration-200 ${
        isActive
          ? "border-blue-500 text-blue-600 bg-blue-50"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Edit User Profile
        </h1>
        <p className="text-gray-600">Update user information and settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          <TabButton
            id="personal"
            label="Personal Info"
            isActive={activeTab === "personal"}
            onClick={() => setActiveTab("personal")}
          />
          <TabButton
            id="contact"
            label="Contact & Location"
            isActive={activeTab === "contact"}
            onClick={() => setActiveTab("contact")}
          />
          <TabButton
            id="system"
            label="System Settings"
            isActive={activeTab === "system"}
            onClick={() => setActiveTab("system")}
          />
          <TabButton
            id="permissions"
            label="Permissions"
            isActive={activeTab === "permissions"}
            onClick={() => setActiveTab("permissions")}
          />
        </nav>
      </div>

      <div className="space-y-8">
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* <InputField
                label="Username"
                name="username"
                required
                icon={User}
                placeholder="Enter username"
              /> */}
              <InputField
                label="Display Name"
                name="name"
                icon={User}
                placeholder="Enter display name"
              />
              {/* <InputField
                label="First Name"
                name="firstName"
                icon={User}
                placeholder="Enter first name"
              />
              <InputField
                label="Last Name"
                name="lastName"
                icon={User}
                placeholder="Enter last name"
              /> */}
              <SelectField
                label="Gender"
                name="gender"
                options={["Female", "Male", "Other"]}
                icon={User}
              />
              <InputField
                label="Lifestyle"
                name="lifestyle"
                placeholder="Enter lifestyle"
              />
              <InputField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                icon={Calendar}
              />
              <InputField
                label="Time of Birth"
                name="timeOfBirth"
                type="time"
                icon={Clock}
              />
              <div className="md:col-span-2">
                <TextareaField
                  label="Place of Birth"
                  name="placeOfBirth"
                  placeholder="Enter place of birth"
                />
              </div>
              <InputField
                label="Karma Type"
                name="karmaType"
                placeholder="Enter karma type"
              />
              <InputField
                label="Grade"
                name="grade"
                placeholder="Enter grade"
              />
            </div>

            {/* Profile Photo */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact & Location Tab */}
        {activeTab === "contact" && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Contact & Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="Enter email address"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter new password"
              />
              <InputField
                label="Country Code"
                name="countryCode"
                icon={Globe}
                placeholder="Enter country code"
              />
              <InputField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                icon={Phone}
                placeholder="Enter phone number"
              />
              <InputField
                label="Latitude"
                name="latitude"
                type="number"
                step="any"
                icon={MapPin}
                placeholder="Enter latitude"
              />
              <InputField
                label="Longitude"
                name="longitude"
                type="number"
                step="any"
                icon={MapPin}
                placeholder="Enter longitude"
              />
              <div className="md:col-span-2">
                <InputField
                  label="Timezone"
                  name="timezone"
                  icon={Globe}
                  placeholder="Enter timezone"
                />
              </div>
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "system" && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              System Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="User Type"
                name="userType"
                options={["User", "Admin", "Expert"]}
                icon={User}
              />
              <InputField
                label="Coins"
                name="coins"
                type="number"
                icon={Star}
                placeholder="Enter coins amount"
              />
              <div className="md:col-span-2">
                <TextareaField
                  label="Blocked Reason"
                  name="blockedReason"
                  placeholder="Enter reason for blocking (if applicable)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === "permissions" && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Permissions & Status
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  User Permissions
                </h3>
                <CheckboxField label="Superuser" name="superuser" />
                <CheckboxField label="Staff Member" name="staff" />
                <CheckboxField label="Primary Member" name="primaryMember" />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Account Status
                </h3>
                <CheckboxField label="Active Account" name="active" />
                <CheckboxField
                  label="Currently Logged Out"
                  name="isLoggedOut"
                />
                <CheckboxField label="Test User" name="isTestUser" />
                <CheckboxField label="Blocked Account" name="isBlocked" />
                <CheckboxField
                  label="Entered Referral Code"
                  name="didEnteredReferralCode"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditForm;

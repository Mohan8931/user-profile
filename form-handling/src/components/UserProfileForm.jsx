import { useState, useEffect, useCallback } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars } from "react-icons/fa";

// Mock user context for demo
const useUser = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: ''
  });

  const updateUser = useCallback((userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  }, []);

  return { user, updateUser };
};

// Toast component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center justify-between ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-medium animate-fade-in`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        &times;
      </button>
    </div>
  );
};

// Input validation functions
const validateName = (name) => {
  return /^[A-Za-z]+$/.test(name);
};

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

// InputField component
const InputField = ({ name, label, type = "text", placeholder, required = false, icon: Icon, rows, value, onChange, onFocus, onBlur, error, focused }) => (
  <div className="group mb-2 sm:mb-3">
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className={`absolute ${rows ? 'top-2.5' : 'top-2'} left-0 pl-2 sm:pl-3 flex items-start pointer-events-none`}>
        <Icon className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${focused ? "text-[#3350E8]" : "text-gray-400"}`} />
      </div>
      {rows ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 border-2 rounded-lg shadow-sm resize-none focus:outline-none transition-all duration-300 text-xs sm:text-sm ${
            error
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : focused
              ? "border-[#3350E8] bg-indigo-50 focus:border-[#3350E8] focus:ring-2 focus:ring-indigo-100"
              : "border-gray-300 bg-white hover:border-gray-400 focus:border-[#3350E8] focus:ring-2 focus:ring-indigo-50"
          }`}
          placeholder={placeholder}
          rows={rows}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 border-2 rounded-lg shadow-sm focus:outline-none transition-all duration-300 text-xs sm:text-sm ${
            error
              ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : focused
              ? "border-[#3350E8] bg-indigo-50 focus:border-[#3350E8] focus:ring-2 focus:ring-indigo-100"
              : "border-gray-300 bg-white hover:border-gray-400 focus:border-[#3350E8] focus:ring-2 focus:ring-indigo-50"
          }`}
          placeholder={placeholder}
        />
      )}
    </div>
    {error && (
      <p className="mt-1 text-red-600 text-xs font-medium">
        <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-500 rounded-full mr-1"></span>
        {error}
      </p>
    )}
  </div>
);

export default function UserProfileForm() {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [toast, setToast] = useState(null);

  // Disable scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Initialize form data when user context changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || ''
      });
    }
  }, [user]);

  // Function to clear form data
  const clearFormData = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      gender: ''
    });
    setErrors({});
    setFocusedField("");
  }, []);

  // Handle name input to allow only alphabets
  const handleNameChange = useCallback((e) => {
    const { name, value } = e.target;
    if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      setErrors(prev => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });
    }
  }, []);

  // Handle phone input to allow only numbers and limit to 10 digits
  const handlePhoneChange = useCallback((e) => {
    const { name, value } = e.target;
    if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      setErrors(prev => {
        if (prev[name]) {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        }
        return prev;
      });
    }
  }, []);

  // Regular change handler for other fields
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleFocus = useCallback((e) => {
    setFocusedField(e.target.name);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    
    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = "Only alphabets are allowed";
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = "Only alphabets are allowed";
    }
    
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      showToast("Please fix the errors in the form", "error");
      return;
    }

    updateUser(formData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear form data after successful save
    clearFormData();
    
    showToast("Profile saved successfully!", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-[#A1BBDA] to-transparent overflow-hidden">
      <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 lg:p-6">
        <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/90 backdrop-blur-lg shadow-xl rounded-xl border border-white/30 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5">
          {/* Toast notification */}
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}

          <div className="text-center mb-3 sm:mb-4">
            <div className="inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-[#3350E8] rounded-xl shadow-md mb-2">
              <FaUser className="text-white text-xs sm:text-sm" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#3350E8] mb-1">
              User Profile
            </h2>
            <p className="text-gray-600 font-medium text-xs">Complete your profile information</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="col-span-1 sm:col-span-1">
              <InputField 
                name="firstName" 
                label="First Name" 
                placeholder="First Name" 
                required 
                icon={FaUser}
                value={formData.firstName}
                onChange={handleNameChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.firstName}
                focused={focusedField === "firstName"}
              />
            </div>
            <div className="col-span-1 sm:col-span-1">
              <InputField 
                name="lastName" 
                label="Last Name" 
                placeholder="Last Name" 
                required 
                icon={FaUser}
                value={formData.lastName}
                onChange={handleNameChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.lastName}
                focused={focusedField === "lastName"}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <InputField 
                name="email" 
                label="Email Address" 
                type="email" 
                placeholder="Email Address" 
                icon={FaEnvelope}
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.email}
                focused={focusedField === "email"}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <InputField 
                name="phone" 
                label="Phone Number" 
                placeholder="Phone Number" 
                required 
                icon={FaPhone}
                value={formData.phone}
                onChange={handlePhoneChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.phone}
                focused={focusedField === "phone"}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <InputField 
                name="address" 
                label="Address" 
                placeholder="Address" 
                icon={FaMapMarkerAlt} 
                rows={3}
                value={formData.address}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                error={errors.address}
                focused={focusedField === "address"}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <div className="mb-2 sm:mb-3">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <FaVenusMars className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${focusedField === "gender" ? "text-[#3350E8]" : "text-gray-400"}`} />
                  </div>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 border-2 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none transition-all duration-300 text-xs sm:text-sm ${
                      focusedField === "gender"
                        ? "border-[#3350E8] focus:ring-2 focus:ring-indigo-100"
                        : "border-gray-300 hover:border-gray-400 focus:border-[#3350E8] focus:ring-2 focus:ring-indigo-100"
                    }`}
                  >
                    <option value="" disabled>Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
            <div className="flex justify-center gap-1">
              {["firstName", "lastName", "email", "phone", "address", "gender"].map((key) => (
                <div
                  key={key}
                  className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors duration-300 ${
                    formData[key] ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 mt-1">Profile completion</p>
          </div>

          <div className="pt-2 sm:pt-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 font-bold text-white rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#3350E8] ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#3350E8] hover:bg-[#2a43c2] active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-xs sm:text-sm">Processing...</span>
                </div>
              ) : (
                <span className="text-xs sm:text-sm">Save Profile</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
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
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center justify-between ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white font-medium animate-fade-in max-w-[90vw]`}>
      <span className="text-xs sm:text-sm">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 focus:outline-none text-lg"
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
    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className={`absolute ${rows ? 'top-3' : 'top-1/2 -translate-y-1/2'} left-0 pl-2 sm:pl-3 flex items-center pointer-events-none`}>
        <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${focused ? "text-[#3350E8]" : "text-gray-400"}`} />
      </div>
      {rows ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 border rounded-lg shadow-sm resize-none focus:outline-none transition-all duration-200 text-xs sm:text-sm ${
            error
              ? "border-red-400 bg-red-50"
              : focused
              ? "border-[#3350E8] bg-indigo-50"
              : "border-gray-300 bg-white"
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
          className={`w-full pl-7 sm:pl-9 pr-2 sm:pr-3 py-1.5 border rounded-lg shadow-sm focus:outline-none transition-all duration-200 text-xs sm:text-sm ${
            error
              ? "border-red-400 bg-red-50"
              : focused
              ? "border-[#3350E8] bg-indigo-50"
              : "border-gray-300 bg-white"
          }`}
          placeholder={placeholder}
        />
      )}
    </div>
    {error && (
      <p className="mt-1 text-red-600 text-xs font-medium">
        <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></span>
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

  // Disable scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Initialize form data
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

  const handleNameChange = useCallback((e) => {
    const { name, value } = e.target;
    if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [errors]);

  const handlePhoneChange = useCallback((e) => {
    const { name, value } = e.target;
    if (value === '' || (/^\d+$/.test(value) && value.length <= 10)) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  }, [errors]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleFocus = useCallback((e) => {
    setFocusedField(e.target.name);
  }, []);

  const handleBlur = useCallback(() => {
    setFocusedField("");
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Valid 10-digit number required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      showToast("Please fix form errors", "error");
      return;
    }

    updateUser(formData);
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearFormData();
    showToast("Profile saved successfully!", "success");
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-t from-[#A1BBDA] to-transparent flex items-center justify-center p-4">
      <div className="w-full max-w-xs sm:max-w-sm bg-white/90 backdrop-blur-lg shadow-xl rounded-xl border border-white/30 px-4 py-4" style={{ maxHeight: '90vh' }}>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}

        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-7 h-7 bg-[#3350E8] rounded-lg shadow-md mb-1">
            <FaUser className="text-white text-sm" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#3350E8]">
            User Profile
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm">Complete your profile information</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div>
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
          <div>
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
          <div className="sm:col-span-2">
            <InputField 
              name="email" 
              label="Email" 
              type="email" 
              placeholder="Email" 
              icon={FaEnvelope}
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              error={errors.email}
              focused={focusedField === "email"}
            />
          </div>
          <div className="sm:col-span-2">
            <InputField 
              name="phone" 
              label="Phone" 
              placeholder="Phone" 
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
          <div className="sm:col-span-2">
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
          <div className="sm:col-span-2">
            <div className="mb-2 sm:mb-3">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Gender</label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className={`h-3 w-3 sm:h-4 sm:w-4 ${focusedField === "gender" ? "text-[#3350E8]" : "text-gray-400"}`} />
                </div>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:outline-none text-xs sm:text-sm"
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

        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="flex justify-center gap-1.5">
            {["firstName", "lastName", "email", "phone", "address", "gender"].map((key) => (
              <div
                key={key}
                className={`w-1.5 h-1.5 rounded-full ${
                  formData[key] ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">Profile completion</p>
        </div>

        <div className="pt-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-2 px-3 font-bold text-white rounded-lg shadow-md transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3350E8] hover:bg-[#2a43c2]"
            } text-xs sm:text-sm`}
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
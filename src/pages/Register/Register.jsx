import axios from "axios";
import React, { useEffect, useState } from "react";
import requests from "../../config";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [designation, setDesignation] = useState("");
  const [showDoctorFields, setShowDoctorFields] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    is_reception: false,
    is_doctor: false,
    is_pharmacy: false,
    department: null,
    first_name: "",
    last_name: "",
    mobile_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirecting, setRedirecting] = useState(false);

  const handleDesignationChange = (value) => {
    setDesignation(value);
    setShowDoctorFields(value === "Doctor");

    setFormData((prevFormData) => {
      let updatedFormData = { ...prevFormData };

      if (value === "Reception") {
        updatedFormData.is_reception = true;
        updatedFormData.is_doctor = false;
        updatedFormData.is_pharmacy = false;
      } else if (value === "Doctor") {
        updatedFormData.is_reception = false;
        updatedFormData.is_doctor = true;
        updatedFormData.is_pharmacy = false;
      } else if (value === "Pharmacy") {
        updatedFormData.is_reception = false;
        updatedFormData.is_doctor = false;
        updatedFormData.is_pharmacy = true;
      } else {
        updatedFormData.is_reception = false;
        updatedFormData.is_doctor = false;
        updatedFormData.is_pharmacy = false;
      }

      return updatedFormData;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDepartmentChange = (e) => {
    const selectedDeptId = e.target.value;
    setSelectedDepartment(selectedDeptId);
    setFormData({
      ...formData,
      department: parseInt(selectedDeptId),
    });
  };

  useEffect(() => {
    const BaseUrl = requests.BaseUrlReception;

    axios
      .get(`${BaseUrl}/department/`)
      .then((response) => {
        console.log(response.data);
        setDepartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const BaseUrl = requests.BaseUrlAuth;
    axios.post(`${BaseUrl}/register/`, formData)
      .then((response) => {
        console.log(response.data);
        setLoading(false);
        setRedirecting(true);

        // Simulating delay, adjust as needed
        const redirectTimer = setTimeout(() => {
          navigate('/');
        }, 2000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(redirectTimer);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        
        if (error.response && error.response.status === 400) {
          const errorData = error.response.data;
          console.error("Error data:", errorData);
        
          if (errorData.mobile_number && errorData.mobile_number[0] === 'user with this mobile number already exists.') {
            setError('Mobile number is already taken. Please use a different one.');
          }else if (errorData.mobile_number && errorData.mobile_number[0] === 'Ensure this field has no more than 10 characters.') {
            setError('Ensure Mobile number has no more than 10 characters.');
          }else if (errorData.mobile_number && errorData.mobile_number[0] === 'Ensure this field has at least 10 characters.') {
            setError('Ensure Mobile number has at least 10 characters.');
          } else if (errorData.email && errorData.email[0] === 'user with this email already exists.') {
            setError('Email is already taken. Please use a different one.');
          } else if (errorData.username && errorData.username[0] === 'A user with that username already exists.') {
            setError('Username is already taken. Please choose a different one.');
          }else if (errorData.email && errorData.email[0] === 'Enter a valid email address.') {
            setError('Enter a valid email address.');
          } else {
            setError('An error occurred while processing your request.');
          }
        } else {
          setError('An error occurred while processing your request.');
        }
      });
  }

  // Redirect to login page when redirecting state is true
  useEffect(() => {
    if (redirecting) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 2000);

      // Cleanup the timer on component unmount
      return () => clearTimeout(redirectTimer);
    }
  }, [redirecting, navigate]);

  return (
    <div className="flex items-center  justify-center sm:h-screen bg-gray-800 p-8 ">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 mt-5 rounded-xl overflow-hidden mb-5">
        <div className="bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-lg p-6">
          <div className="p-7">
            <h1 className="mb-6 text-3xl text-center text-white">Sign up</h1>
          </div>
          <form className="px-6" onSubmit={handleSubmit}>
          <p>
              {error && (
                <div className="bg-red-500 bg-opacity-10 backdrop-filter backdrop-blur-lg  border border-red-500 text-white p-2 rounded-md ">
                  {error}
                </div>
              )}
            </p>
            <div className="flex flex-col gap-3">
              <div className="mb-3 flex flex-col">
                <label className="inline-block mb-2 text-gray-400">
                  Username
                </label>
                <input
                  className="rounded-md w-full p-2 placeholder-gray-500 text-black"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3 flex flex-col">
                <label className="inline-block mb-2 text-gray-400">Email</label>
                <input
                  className="rounded-md w-full p-2 placeholder-gray-500 text-black"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-3 flex flex-col">
                <label className="inline-block mb-2 text-gray-400">
                  Designation
                </label>
                <div className="flex gap-2 sm:gap-5 text-white">
                  <label>
                    <input
                      type="checkbox"
                      value="Reception"
                      checked={designation === "Reception"}
                      onChange={() => handleDesignationChange("Reception")}
                    />
                    Reception
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Doctor"
                      checked={designation === "Doctor"}
                      onChange={() => handleDesignationChange("Doctor")}
                    />
                    Doctor
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      value="Pharmacy"
                      checked={designation === "Pharmacy"}
                      onChange={() => handleDesignationChange("Pharmacy")}
                    />
                    Pharmacy
                  </label>
                </div>
              </div>

              {showDoctorFields && (
                <div className="mb-3 flex flex-col sm:flex-row gap-3">
                  <div className="flex flex-col w-full sm:w-1/2">
                    <label className="inline-block mb-2 text-gray-400">
                      First Name
                    </label>
                    <input
                      className="rounded-md w-full p-2 placeholder-gray-500 text-black"
                      type="text"
                      name="first_name"
                      placeholder="Enter your first name"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <label className="inline-block mb-2 text-gray-400">
                      Last Name
                    </label>
                    <input
                      className="rounded-md w-full p-2 placeholder-gray-500 text-black"
                      type="text"
                      name="last_name"
                      placeholder="Enter your last name"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <label className="inline-block mb-2 text-gray-400">
                      Mobile No.
                    </label>
                    <input
                      className="rounded-md w-full p-2 placeholder-gray-500 text-black"
                      type="text"
                      name="mobile_number"
                      placeholder="Enter your Mobile number"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="flex flex-col w-full sm:w-1/2">
                    <label className="inline-block mb-2 text-gray-400">
                      Department
                    </label>
                    <select
                      className="rounded-md w-2/3 p-2 placeholder-gray-500 text-black"
                      name="department"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between ">
              <Button label={loading ? "Signing up..." : "Sign up"} type="submit" disabled={loading} />
              {redirecting && (
                <div className="text-white text-center ml-4">
                  Redirecting to login page...
                </div>
              )}
            </div>
            
          </form>
         
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import requests from "../../config";
import axios from "axios";
import Button from "../../components/Button/Button";

const Addpatient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);


  const menus = [
    { name: "Dashboard", path: "/reception/home", icon: MdSpaceDashboard },
    {
      name: "Department",
      path: "/reception/department",
      icon: FaClinicMedical,
    },
    {
      name: "Add Patient",
      path: "/reception/addpatient",
      icon: FaHandHoldingMedical,
    },
    { name: "Appointment", path: "/reception/appointment", icon: FaNotesMedical },
    { name: "Patient History", path: '/reception/patienthistory', icon: FaBookMedical },
  ];

  const [open, setOpen] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    mobile_number: "",
    email: "",
    age: "",
    gender: "M",
  });

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const BaseUrl = requests.BaseUrlReception;

    axios
      .post(`${BaseUrl}/patient/`, formData)
      .then((response) => {
        console.log(response.data);
        setRedirecting(true);

        // Simulating delay, adjust as needed
        const redirectTimer = setTimeout(() => {
          navigate("/reception/appointment");
        }, 2000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(redirectTimer);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          const errorData = error.response.data;
          if (errorData.mobile_number && errorData.mobile_number[0] === 'patient with this mobile number already exists.') {
            setError('Mobile number is already taken. Please use a different one.');
          }else if (errorData.mobile_number && errorData.mobile_number[0] === 'Ensure this field has at least 10 characters.') {
            setError('Ensure Mobile number has at least 10 characters.');
          }else if (errorData.mobile_number && errorData.mobile_number[0] === 'Ensure this field has no more than 10 characters.') {
            setError('Ensure Mobile number has no more than 10 characters.');
          } else if (errorData.email && errorData.email[0] === 'patient with this email already exists.') {
            setError('Email is already taken. Please use a different one.');
          }else if (errorData.email && errorData.email[0] === 'Enter a valid email address.') {
            setError('Enter a valid email address.');
          } else {
            setError('An error occurred while processing your request.');
          }
        } else {
          setError('An error occurred while processing your request.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-row  md:flex-row min-h-screen bg-gray-800">
      <div
        className={`bg-slate-950 text-white  min-h-screen ${
          open ? "w-72" : "w-16"
        } duration-500 px-4`}
      >
        <div className="py-3 flex justify-end">
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="list-none mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <div
              to={""}
              key={i}
              className={`${
                menu?.margin && "mt-5"
              }flex items-center text-xl gap-3.5 font-medium p-2 cursor-pointer hover:bg-gray-800 rounded-md`}
              onClick={() => navigate(menu.path)}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-4 md:p-10">
        <div className="w-full md:w-1/2 mx-auto bg-slate-950 p-8 rounded-md text-white">
          <form onSubmit={handleSubmit}>
            <h2 className="text-4xl font-semibold mb-4">Add Patient</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Address:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Mobile Number:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Age:</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Gender:</label>
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-slate-700"
                    name="gender"
                    value="M"
                    checked={formData.gender === "M"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Male</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    className="form-radio text-slate-700"
                    name="gender"
                    value="F"
                    checked={formData.gender === "F"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Female</span>
                </label>
                <label className="inline-flex items-center ml-4">
                  <input
                    type="radio"
                    className="form-radio text-slate-700"
                    name="gender"
                    value="O"
                    checked={formData.gender === "O"}
                    onChange={handleChange}
                  />
                  <span className="ml-2">Other</span>
                </label>
              </div>
            </div>

            <Button type="submit" label={loading ? "Submitting..." : "Submit"} disabled={loading} />
            {redirecting && (
              <div className="text-white text-center mt-2">
                Redirecting to appointment page...
              </div>
            )}
             {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 text-white p-2 rounded-md mt-2">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addpatient;


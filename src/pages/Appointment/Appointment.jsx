import React, { useEffect, useState } from 'react'
import { HiMenuAlt3 } from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import requests from '../../config';
import axios from 'axios';
import Button from '../../components/Button/Button';

const Appointment = () => {

    const navigate = useNavigate();

    const menus = [
        { name: "Dashboard", path:'/reception/home', icon: MdSpaceDashboard},
        { name: "Department", path:'/reception/department', icon: FaClinicMedical },
        { name: "Add Patient", path:'/reception/addpatient', icon: FaHandHoldingMedical },
        { name: "Appointment",path:'/reception/appointment', icon: FaNotesMedical },
        { name: "Patient History",path:'/reception/patienthistory', icon: FaBookMedical },
      ];

      const [open, setOpen] = useState(true);

      const [departments, setDepartments] = useState([]);
      const[doctors, setDoctors] = useState([]);
      const [successMessage, setSuccessMessage] = useState('');
      const [appointmentData, setAppointmentData] = useState({
        patient_id: '',
        scheduled_time: '',
        department: '',
        doctor: '',
      });

      useEffect(() =>{
        const BaseUrl = requests.BaseUrlReception

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

      const handleDepartmentChange = async (departmentId) => {
        const BaseUrl = requests.BaseUrlAuth;
      
        try {
          const response = await axios.get(`${BaseUrl}/department_doctors/${departmentId}/`);
          setDoctors(response.data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData((prevData) => ({
          ...prevData,
          [name]: value,
        }));

        if (name === 'department') {
            handleDepartmentChange(value);
          }
        }

        const handleSubmit = (e) =>{
          e.preventDefault();
          if (!appointmentData.patient_id || !appointmentData.scheduled_time || !appointmentData.department || !appointmentData.doctor) {
            console.error('Please fill out all required fields.');
            return;
          }
            
            const BaseUrl = requests.BaseUrlReception
            axios.post(`${BaseUrl}/appointment/`,appointmentData)
            .then((response) =>{
                console.log(response.data); 
                setSuccessMessage('Patient appointed successfully!');
            }).catch((error) =>{
                console.log(error);
            })
        }



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
        <h2 className="text-4xl font-semibold mb-4">Make Appointment</h2>

        <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Patient ID:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="patient_id"
                value={appointmentData.patient_id}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Scheduled Time:</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="scheduled_time"
                value={appointmentData.scheduled_time}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Department:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="department"
                value={appointmentData.department}
                onChange={(e) => {
                  handleChange(e);
                  handleDepartmentChange(e.target.value);
                }}
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Doctor:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="doctor"
                value={appointmentData.doctor}
                onChange={handleChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                  {`${doctor.first_name} ${doctor.last_name}`}
                </option>
                ))}
              </select>
            </div>
            {successMessage && (
              <div className="mt-4 mb-4 text-white bg-green-500 p-1 rounded-lg">
                <p>{successMessage}</p>
              </div>
            )}
            <Button type="submit" label="Submit" />
        </form>
        </div>
      </div>
        </div>
  )
}

export default Appointment
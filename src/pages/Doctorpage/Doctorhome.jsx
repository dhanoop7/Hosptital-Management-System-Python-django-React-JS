import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from "react-icons/hi";
import { FaNotesMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import requests from '../../config';
import axios from 'axios';
import Cookies from 'js-cookie';


const Doctorhome = () => {

    const navigate = useNavigate();

    const menus = [
      { name: "Recent Appointment", path:'/doctor/home', icon: FaNotesMedical},
      { name: "Search Patient", path: '/doctor/search-patient', icon: IoPersonSharp },
      // { name: "Add Patient", path:'/doctor/addpatient', icon: FaHandHoldingMedical },
      // { name: "Appointment",path:'/doctor/appointment', icon: FaNotesMedical },
      // { name: "Patient History",path:'/doctor/patienthistory', icon: FaBookMedical },
    ];


    const [open, setOpen] = useState(true);
    const [data, setData] = useState([])


    useEffect(() =>{
        const BaseUrl = requests.BaseUrlDoctor

        const token = Cookies.get('token')

        axios.get(`${BaseUrl}/doctorappointments/`,{
            headers: {
                'Authorization' :`Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        .then((response) =>{
            console.log(response.data); 
            setData(response.data)
        }).catch((error) =>{
            console.log(error);
        })
    }, [])
    const handleMarkAsViewed = (appointmentId) => {
      const BaseUrl = requests.BaseUrlDoctor;
      const token = Cookies.get('token');
    
      axios
        .patch(
          `${BaseUrl}/markappointments/${appointmentId}/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then(() => {
          // Update the local state to remove the viewed appointment
          setData((prevAppointments) =>
            prevAppointments.filter((appointment) => appointment.id !== appointmentId)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const handleClickAppointment = (appointmentId) => {
      navigate(`/doctor/appointment_detail/${appointmentId}`);
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

      {/* MAIN CONTENT */}

      <div className="flex-1 p-4 md:p-10">
        <div className="w-full bg-gray-950 p-8 rounded-md text-white text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">Recent Appointments</h2>
          <div className="flex flex-col gap-4 items-center">
            {data.map((appointment) => (
              <div
                key={appointment.id}
                className={`flex items-center justify-center bg-${
                  appointment.token_number % 2 === 0 ? 'blue' : 'green'
                }-500 text-white px-6 py-3 rounded-md text-xl md:text-2xl lg:text-3xl cursor-pointer mb-2`}
                onClick={() => handleClickAppointment(appointment.id)}
              >
                {`Token : ${appointment.token_number}`}
                {!appointment.viewed && (
  <button
    onClick={() => handleMarkAsViewed(appointment.id)}
    className="text-sm text-black bg-yellow-500 px-3 py-1 rounded-md ml-3"
  >
    Consult
  </button>
)}
              </div>


              
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctorhome;
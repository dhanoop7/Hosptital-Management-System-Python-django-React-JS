import React, { useState } from "react";
import departmenticon from "./assests/department.png";
import Addpatienticon from "./assests/Addpatient.png";
import Appointmenticon from "./assests/Appointment.png";
import Historyicon from "./assests/History.png";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const Receptionhome = () => {

  const navigate = useNavigate();

  const menus = [
    { name: "Dashboard", path:'/reception/home', icon: MdSpaceDashboard},
    { name: "Department", path:'/reception/department', icon: FaClinicMedical },
    { name: "Add Patient", path:'/reception/addpatient', icon: FaHandHoldingMedical },
    { name: "Appointment",path:'/reception/appointment', icon: FaNotesMedical },
    { name: "Patient History",path:'/reception/patienthistory', icon: FaBookMedical },
  ];

  const handleClickDept = () =>{
    navigate('/reception/department')
  }
  const handleClickAddPatient = () =>{
    navigate('/reception/addpatient')
  }
  const handleClickAppointment = () =>{
    navigate('/reception/appointment')
  } 
  const handleClickPatientHistory = () =>{
    navigate('/reception/patienthistory')
  }



  const [open, setOpen] = useState(true);
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Add Department Box */}
          <div className="bg-blue-500 hover:bg-blue-400 p-6 rounded-md shadow-md flex flex-col justify-between items-center text-center cursor-pointer"
          onClick={handleClickDept}
          >
            <h3 className="text-3xl font-semibold text-white mb-3">
              Add Department
            </h3>
            <img src={departmenticon} className="w-28 mb-4" />
            {/* Add content specific to Add Department here */}
          </div>

          {/* Add Patient Box */}
          <div className="bg-green-500 hover:bg-green-400 p-6 cursor-pointer rounded-md shadow-md flex flex-col justify-between items-center mt-4 md:mt-0"
          onClick={handleClickAddPatient}
          >
            <h3 className="text-3xl font-semibold text-white mb-3">
              Add Patient
            </h3>
            <img src={Addpatienticon} className="w-28 mb-4" />
            {/* Add content specific to Add Patient here */}
          </div>
        </div>

        {/* Make Appointment and Patient History Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-4">
          {/* Make Appointment Box */}
          <div className="bg-orange-500 hover:bg-orange-400 cursor-pointer p-6 rounded-md shadow-md flex flex-col justify-between items-center"
          onClick={handleClickAppointment}>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Appointment
            </h3>
            <img src={Appointmenticon} className="w-28 mb-4" />
            {/* Add content specific to Make Appointment here */}
          </div>

          {/* Patient History Box */}
          <div className="bg-purple-500 hover:bg-purple-400 cursor-pointer p-6 rounded-md shadow-md flex flex-col justify-between items-center mt-4 md:mt-0"
          onClick={handleClickPatientHistory}>
            <h3 className="text-3xl font-semibold text-white mb-3">
              Patient History
            </h3>
            <img src={Historyicon} className="w-28 mb-4" />
            {/* Add content specific to Patient History here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receptionhome;

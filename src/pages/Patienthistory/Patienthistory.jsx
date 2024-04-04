import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaClinicMedical } from 'react-icons/fa';
import { FaNotesMedical } from 'react-icons/fa';
import { FaHandHoldingMedical } from 'react-icons/fa6';
import { FaBookMedical } from 'react-icons/fa6';
import { MdSpaceDashboard } from 'react-icons/md';
import requests from '../../config';

const Patienthistory = () => {

  const [open, setOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  const handleSearch = () => {
    const BaseUrl = requests.BaseUrlReception;
    axios
      .get(`${BaseUrl}/patientsearch/${searchQuery}/`)
      .then((response) => {
        console.log(response.data);
        setPatientData(response.data);
        setError(null);
      })
      .catch((error) => {
        console.log(error);
        setPatientData(null); // Reset patient data on error
        setError("Patient not found"); // Set error message
      });
  };

 

  const menus = [
    { name: 'Dashboard', path: '/reception/home', icon: MdSpaceDashboard },
    { name: 'Department', path: '/reception/department', icon: FaClinicMedical},
    { name: 'Add Patient', path: '/reception/addpatient', icon: FaHandHoldingMedical },
    { name: 'Appointment', path: '/reception/appointment', icon: FaNotesMedical },
    { name: 'Patient History', path: '/reception/patienthistory', icon: FaBookMedical },
  ];

  return (
    <div className="flex  md:flex-row min-h-screen bg-gray-800">
      <div
        className={`bg-slate-950 text-white  min-h-screen ${
          open ? 'w-72' : 'w-16'
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
              key={i}
              className={`${
                menu?.margin && 'mt-5'
              }flex items-center text-xl gap-3.5 font-medium p-2 cursor-pointer hover:bg-gray-800 rounded-md`}
              onClick={() => navigate(menu.path)}
            >
              <div>{React.createElement(menu?.icon, { size: '20' })}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre duration-500 ${
                  !open && 'opacity-0 translate-x-28 overflow-hidden'
                }`}
              >
                {menu?.name}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* main content */}

      <div className="flex-1 p-4 md:p-10 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="bg-gray-800 p-6 rounded mb-6">
          <label className="block text-white text-lg mb-2">Enter Patient ID:</label>
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Enter Patient ID"
              className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="bg-black text-white px-4 py-2 ml-2 rounded-md hover:bg-slate-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
        </div>

        {patientData ? (
          <div className="bg-gray-800 p-6 rounded mt-6">
            <div className="mb-8 text-white">
                  <h3 className="text-6xl text-cyan-500 mb-3 font-thin">Patient Info</h3>
                  <p className="text-4xl text-white">{patientData.patient.name}</p>
                  <p className="text-lg text-gray-400 mb-2">Patient ID: {patientData.patient.patient_id}</p>
                  <p className="text-lg text-gray-400 mb-2">Address: {patientData.patient.address}</p>
                  <p className="text-lg text-gray-400 mb-2">Phone: {patientData.patient.mobile_number}</p>
                  <p className="text-3xl text-white mb-2">Age: {patientData.patient.age}</p>
                  <p className="text-3xl text-white mb-2">Gender: {patientData.patient.gender}</p>
                  <p className="text-lg text-gray-400">Email: {patientData.patient.email}</p>
                </div>

                <div className="md:w-full mt-6 md:mt-0">
                  <h3 className="text-5xl font-thin mb-2 text-cyan-500">Consultation History</h3>
                  {patientData.appointments.map((appointment) => (
                    <div key={appointment.id} className="mb-4 border-b border-gray-600 pb-4">
                      <div className="mt-6">
                        <p className="text-4xl text-white mb-2">
                          DR. {`${appointment.doctor.first_name} ${appointment.doctor.last_name}`}
                        </p>
                        <p className="text-3xl text-white mb-2">Dept: {appointment.department.department}</p>
                      </div>
                      <div>
                        <p className="text-lg text-gray-400 mb-2">Appointment ID: {appointment.id}</p>
                        <p className="text-lg text-gray-400 mb-2">Scheduled Time: {new Date(appointment.scheduled_time).toLocaleString()}</p>
                        <p className="text-lg text-gray-400 mb-2">Token Number: {appointment.token_number}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

        ) : null}
      </div>
    </div>
  );
};

export default Patienthistory;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaNotesMedical } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import axios from 'axios';
import Cookies from 'js-cookie';

const DoctorSearchPatient = () => {
  const navigate = useNavigate();

  const menus = [
    { name: 'Recent Appointment', path: '/doctor/home', icon: FaNotesMedical },
    { name: 'Search Patient', path: '/doctor/search-patient', icon: IoPersonSharp },
  ];

  const [open, setOpen] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      // Fetch patient details and appointment details
      
      const receptionResponse = await axios.get(`http://127.0.0.1:8000/reception/patientsearch/${patientId}/` );

      // Fetch prescription details
      const token = Cookies.get('token')
      const doctorResponse = await axios.get(`http://127.0.0.1:8000/doctor/patienthistory/${patientId}/`,{
        headers: {
            'Authorization' :`Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });

    const pharmacyResponse = await axios.get(`http://127.0.0.1:8000/pharmacy/single_patient_prescriptions/${patientId}/`);

      // Combine both responses into a single object
      const combinedData = {
        patient: receptionResponse.data.patient,
        appointments: receptionResponse.data.appointments,
        prescriptions: pharmacyResponse.data,
      };

      setPatientData(combinedData);
      setError(null);
    } catch (error) {
      console.error(error);
      setPatientData(null);
      setError('Patient not found');
    }
  };

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gray-800">
      <div className={`bg-slate-950 text-white min-h-screen ${open ? 'w-72' : 'w-16'} duration-500 px-4`}>
        <div className="py-3 flex justify-end">
          <HiMenuAlt3 size={26} className="cursor-pointer" onClick={() => setOpen(!open)} />
        </div>
        <div className="list-none mt-4 flex flex-col gap-4 relative">
          {menus?.map((menu, i) => (
            <div
              to={''}
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
          <div className="flex items-center">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white"
            />
            <button
              onClick={handleSearch}
              className="ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            >
              Search
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

{patientData && (
  <div className="bg-gray-800 p-6 rounded mt-6">
    {/* Patient Details */}
    <div className="mb-8 text-white">
      <h2 className="text-3xl font-semibold mb-2 text-cyan-500">Patient Details</h2>
      <p className="mb-2"><span className="font-semibold text-gray-400">Name:</span> {patientData.patient.name}</p>
      <p className="mb-2"><span className="font-semibold text-gray-400">Age:</span> {patientData.patient.age}</p>
      <p className="mb-2"><span className="font-semibold text-gray-400">Gender:</span> {patientData.patient.gender}</p>
      <p className="mb-2"><span className="font-semibold text-gray-400">Address:</span> {patientData.patient.address}</p>
      <p className="mb-2"><span className="font-semibold text-gray-400">Mobile Number:</span> {patientData.patient.mobile_number}</p>
      {/* Add other patient details as needed */}
    </div>

    {/* Appointment and Prescription Details */}
    <div className="flex flex-col md:flex-row gap-8">
      {/* Appointment Details */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-semibold mb-4 text-cyan-500">Appointment Details</h2>
        {patientData.appointments.map((appointment) => (
          <div key={appointment.id} className="mb-4 text-white border-b border-gray-600 pb-4">
            <p className="mb-2"><span className="text-gray-400 font-semibold">Scheduled Time:</span> {appointment.scheduled_time}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Token Number:</span> {appointment.token_number}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Doctor:</span> {appointment.doctor.first_name} {appointment.doctor.last_name}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Department:</span> {appointment.department.department}</p>
          </div>
        ))}
      </div>

      {/* Prescription Details */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-semibold mb-4 text-cyan-500">Prescription Details</h2>
        {patientData.prescriptions.map((prescription) => (
          <div key={prescription.id} className="mb-6 text-white border-b border-gray-600 pb-4">
            <p className="mb-2"><span className="text-gray-400 font-semibold">Medicine Name:</span> {prescription.medicine_name}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Consumption Time:</span> {prescription.consumption_time}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Added by Doctor:</span> {prescription.added_by_doctor}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Department:</span> {prescription.department_name}</p>
            <p className="mb-2"><span className="text-gray-400 font-semibold">Dosage Amount:</span> {prescription.dosage_amount} {prescription.dosage_unit}</p>
            {/* Add other prescription details as needed */}
          </div>
        ))}
      </div>
    </div>
  </div>
)}
</div>
</div>
);
};

export default DoctorSearchPatient;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaNotesMedical } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import axios from 'axios';

const SearchPatientPrescription = () => {
  const navigate = useNavigate();

  const menus = [
    { name: 'Recent Prescription', path: '/pharmacy/home', icon: FaNotesMedical },
    { name: 'Search Patient', path: '/pharmacy/search-patient-perscription', icon: IoPersonSharp },
  ];

  const [open, setOpen] = useState(true);
  const [patientId, setPatientId] = useState('');
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/pharmacy/single_patient_prescriptions/${patientId}/`);
      console.log(response.data);
      setPrescriptionDetails(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching prescription details:', error);
      setPrescriptionDetails([]);
      setError('Patient not found');
    }
  };

  return (
    <div className="flex  md:flex-row min-h-screen bg-gray-800">
      <div
        className={`bg-slate-950 text-white  min-h-screen ${
          open ? 'w-72' : 'w-16'
        } duration-500 px-4`}
      >
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

      {/* MAIN CONTENT */}

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

        {error && <p className="text-red-500">{error}</p>}
        {prescriptionDetails && prescriptionDetails.length === 0 && (
          <p className="text-white">No data available for the given patient ID.</p>
        )}
        
        {prescriptionDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
            {prescriptionDetails.map((prescription, index) => (
              <div key={index} className="p-4 bg-gray-700 rounded">
                <p className="text-xl lg:text-2xl text-cyan-500">
                  <strong>Doctor:</strong> {prescription.added_by_doctor}
                </p>
                <p className="text-xl lg:text-2xl text-cyan-500">
                  <strong>Department:</strong> {prescription.department_name}
                </p>
                <p className="text-xl lg:text-2xl text-white">
                  <strong>Patient ID:</strong> {prescription.patient_id}
                </p>
                <p className="text-xl lg:text-2xl text-yellow-500">
                  <strong>Medicine Name:</strong> {prescription.medicine_name}
                </p>
                <p className="text-xl lg:text-2xl text-white">
                  <strong>Consumption Time:</strong> {prescription.consumption_time}
                </p>
                <p className="text-xl lg:text-2xl text-white">
                  <strong>Dosage Amount:</strong> {prescription.dosage_amount}{' '}
                  {prescription.dosage_unit}
                </p>
                <p className="text-xl lg:text-2xl text-white">
                  <strong>Submission Time:</strong> {prescription.submission_time}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPatientPrescription;


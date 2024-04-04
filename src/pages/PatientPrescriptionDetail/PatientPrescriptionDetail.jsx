import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaNotesMedical } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import axios from 'axios';

const PatientPrescriptionDetail = () => {
  const navigate = useNavigate();
  const { prescriptionId } = useParams();
  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const menus = [
    { name: 'Recent Prescription', path: '/pharmacy/home', icon: FaNotesMedical },
    { name: 'Search Patient', path: '/pharmacy/search-patient-perscription', icon: IoPersonSharp },
  ];

  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/pharmacy/prescriptions/${prescriptionId}/`);
        console.log(response.data);
        setPrescriptionDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescription details:', error);
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [prescriptionId]);

  return (
    <div className="flex flex-row md:flex-row min-h-screen bg-gray-800">
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

      <div className="flex-1 p-4 md:p-10">
        <div className="w-full bg-gray-950 p-8 rounded-md text-white text-center md:text-left">
          {loading ? (
            <p>Loading prescription details...</p>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-cyan-500 font-semibold mb-4">
                Prescription for Patient {prescriptionDetails?.patient_id}
              </h2>

              {/* Details for Added by and Department */}
              <div className="md:flex items-center gap-4 mt-5">
                <div className="md:w-full lg:w-1/3 mb-4 md:mb-0">
                  <h1 className="text-5xl mb-3 text-white">Added by</h1>
                  <p className="text-2xl md:text-3xl lg:text-4xl mb-4 text-white">
                    Dr. {prescriptionDetails?.added_by?.first_name}{' '}
                    {prescriptionDetails?.added_by?.last_name}
                  </p>
                  <p className="text-2xl md:text-3xl lg:text-5xl text-white">
                    Department: {prescriptionDetails?.department?.department}
                  </p>
                </div>

                {/* Details for Medicine */}
                <div className="md:w-full lg:w-2/3">
                  <div className="mb-4 text-3xl">
                    <p className="text-yellow-500">
                      <strong>Medicine Name:</strong> {prescriptionDetails?.medicine_name}
                    </p>
                    <p className="text-gray-400">
                      <strong>Consumption Time:</strong>{' '}
                      {new Date(prescriptionDetails?.consumption_time).toLocaleString()}
                    </p>
                    <p className="text-gray-400">
                      <strong>Dosage Amount:</strong>{' '}
                      {prescriptionDetails?.dosage_amount} {prescriptionDetails?.dosage_unit}
                    </p>
                    <p className="text-gray-400">
                      <strong>Submission Time:</strong>{' '}
                      {new Date(prescriptionDetails?.added_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionDetail;


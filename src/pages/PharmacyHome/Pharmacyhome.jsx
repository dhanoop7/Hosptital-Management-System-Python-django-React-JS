import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaNotesMedical } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import axios from 'axios';


const DoctorHome = () => {
  const navigate = useNavigate();

  const menus = [
    { name: 'Recent Prescription', path: '/pharmacy/home', icon: FaNotesMedical },
    { name: 'Search Patient', path: '/pharmacy/search-patient-perscription', icon: IoPersonSharp },
  ];

  const [open, setOpen] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);

  const handleMarkAsViewed = async (prescriptionId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/pharmacy/markprescription/${prescriptionId}/`);
      // Fetch updated prescriptions after marking as viewed
      fetchPrescriptions();
    } catch (error) {
      console.error('Error marking prescription as viewed:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/pharmacy/recent_prescriptions/');
      console.log(response.data);
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching recent prescriptions:', error);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  

  const handleClickPatient = (prescriptionId) => {
   navigate(`/pharmacy/prescription-detail/${prescriptionId}`)
  };

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

      {/* MAIN CONTENT */}

      <div className="flex-1 p-4 md:p-10">
        <div className="w-full bg-gray-950 p-8 rounded-md text-white text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">Recent Prescriptions</h2>
          <div className="flex flex-col items-center gap-4">
            {prescriptions.map((prescription, index) => (
              <div key={index} className="flex items-center gap-9 mt-3">
                <button
                  className={`flex items-center justify-center bg-${
                    index % 2 === 0 ? 'blue' : 'green'
                  }-500 text-white px-6 py-3 rounded-md text-xl md:text-2xl lg:text-3xl cursor-pointer mb-2`}
                  onClick={() => handleClickPatient(prescription.prescription_id)}
                >
                  {`Patient : ${prescription.patient}`}
                </button>
                <p className="text-sm md:text-md lg:text-lg">
                  : {new Date(prescription.submission_time).toLocaleString()}
                </p>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md cursor-pointer"
                  onClick={() => handleMarkAsViewed(prescription.prescription_id)}
                >
                  Mark as Viewed
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;

import React, { useEffect, useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { FaNotesMedical } from 'react-icons/fa';
import { IoPersonSharp } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import requests from '../../config';
import Cookies from 'js-cookie';
import axios from 'axios';

const Detailappointment = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const menus = [
    { name: 'Recent Appointment', path: '/doctor/home', icon: FaNotesMedical },
    { name: 'Serach Patient', path: '/doctor/search-patient', icon: IoPersonSharp },
    // { name: 'Add Patient', path: '/doctor/addpatient', icon: FaHandHoldingMedical },
    // { name: 'Appointment', path: '/doctor/appointment', icon: FaNotesMedical },
    // { name: 'Patient History', path: '/doctor/patienthistory', icon: FaBookMedical },
  ];

  const [prescriptionData, setPrescriptionData] = useState({ 
    medicine_name: '',
    frequency: 'daily',
    dosage_amount: '',
    dosage_unit: 'mg',
    patient_id: '',
  });

  const [reassignData, setReassignData] = useState({
    new_department_id: '',
    new_doctor_id: '',
    scheduled_time: '',
    // ... (other fields for reassignment)
  });

  const [appointment, setAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [reassignSuccessMessage, setReassignSuccessMessage] = useState('');

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch appointments and prescription data
    const BaseUrlDoctor = requests.BaseUrlDoctor;

    const token = Cookies.get('token');

    axios
      .get(`${BaseUrlDoctor}/single_appointment/${appointmentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        const appointmentData = response.data;
        setAppointment(appointmentData);

        setPrescriptionData((prevData) => ({
          ...prevData,
          patient_id: appointmentData.patient_id.toString(),
        }));
      })
      .catch((error) => {
        console.log(error);
      });

    // Fetch departments
    const BaseUrlReception = requests.BaseUrlReception;

    axios
      .get(`${BaseUrlReception}/department/`)
      .then((response) => {
        console.log(response.data);
        setDepartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [appointmentId]);

  const handleDepartmentChange = async (departmentId) => {
    // Fetch doctors based on selected department
    const BaseUrlAuth = requests.BaseUrlAuth;

    try {
      const response = await axios.get(`${BaseUrlAuth}/department_doctors/${departmentId}/`);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(prescriptionData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const appointmentId = appointment.id;

    const prescriptionFormData = {
      appointment: appointmentId,
      ...prescriptionData,
    };

    try {
      const response = await axios.post(
        `${requests.BaseUrlDoctor}/prescriptionsadd/`,
        prescriptionFormData,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
      setSuccessMessage('Prescription added successfully');
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
  };

  const handleReassignChange = (e) => {
    const { name, value } = e.target;
    setReassignData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    if (name === 'new_department_id') {
      handleDepartmentChange(value);
    }
    console.log(reassignData);
  };
  
  useEffect(() => {
    // Fetch doctors based on selected department
    if (reassignData.new_department_id) {
      handleDepartmentChange(reassignData.new_department_id);
    }
  }, [reassignData.new_department_id]);
  
  const handleReassignSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if both department and doctor are selected
    if (!reassignData.new_department_id || !reassignData.new_doctor_id) {
      console.error('Please select both department and doctor');
      return;
    }
  
    try {
      // Fetch the patient ID from the original appointment
      const originalPatientId = appointment?.patient_id;
  
      // Prepare data for the new appointment
      const newAppointmentData = {
        patient_id: originalPatientId,
        scheduled_time: reassignData.scheduled_time,
        scheduled_time: reassignData.scheduled_time,
        doctor: reassignData.new_doctor_id,
        department: reassignData.new_department_id,
      };
  
      // Make a POST request to create a new appointment
      const response = await axios.post(
        'http://127.0.0.1:8000/reception/appointment/',
        newAppointmentData
      );
  
      console.log('Reassignment successful:', response.data);
      setReassignSuccessMessage('Appointment reassigned successfully');
   
    } catch (error) {
      console.error('Error during reassignment:', error);
    }
  };

  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-row  md:flex-row min-h-screen bg-gray-800">
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
        <div className="w-full bg-gray-950 p-8 rounded-md text-white">
        <h2 className="text-4xl text-white font-semibold mb-4">
        Prescription for {appointment?.patient_id}
</h2>
          {successMessage && (
            <div className="bg-green-500 text-white p-3 mb-4 rounded-md">{successMessage}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Medicine Name:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="medicine_name"
                value={prescriptionData.medicine_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Frequency:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="frequency"
                value={prescriptionData.frequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Dosage Amount:</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="dosage_amount"
                value={prescriptionData.dosage_amount}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Dosage Unit:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="dosage_unit"
                value={prescriptionData.dosage_unit}
                onChange={handleChange}
              >
                <option value="mg">Milligrams</option>
                <option value="ml">Milliliters</option>
                <option value="units">Units</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Prescription
            </button>
          </form>

          {/* Reassignment Form */}
          <h2 className="text-4xl font-semibold mt-8 mb-4">Reassign Appointment</h2>
          {reassignSuccessMessage && (
            <div className="bg-green-500 text-white p-3 mb-4 rounded-md">{reassignSuccessMessage}</div>
          )}
          <form onSubmit={handleReassignSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Department:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="new_department_id"
                value={reassignData.new_department_id}
                onChange={handleReassignChange}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Doctor:</label>
              <select
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="new_doctor_id"
                value={reassignData.new_doctor_id}
                onChange={handleReassignChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                   {`${doc.first_name} ${doc.last_name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
  <label className="block text-sm font-medium mb-2">Scheduled Time:</label>
  <input
    type="datetime-local"
    className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
    name="scheduled_time"
    value={reassignData.scheduled_time}
    onChange={handleReassignChange}
  />
</div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Reassign Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Detailappointment;


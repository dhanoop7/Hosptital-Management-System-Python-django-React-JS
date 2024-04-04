import React, { useEffect, useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { FaClinicMedical } from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { FaBookMedical } from "react-icons/fa6";
import { MdSpaceDashboard } from "react-icons/md";
import requests from "../../config";
import Button from "../../components/Button/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


export const Adddepartment = () => {

   const navigate = useNavigate()
  const menus = [
    { name: "Dashboard", path:'/reception/home',  icon: MdSpaceDashboard},
    { name: "Department", path:'/reception/department', icon: FaClinicMedical },
    { name: "Add Patient",path:'/reception/addpatient', icon: FaHandHoldingMedical },
    { name: "Appointment", path:'/reception/appointment', icon: FaNotesMedical },
    { name: "Patient History",path:'/reception/patienthistory', icon: FaBookMedical },
  ];

  const [open, setOpen] = useState(true);
  const [department, setDepartment] = useState("");
  const [alldepartment, setAllDepartment] = useState();

  useEffect(() => {
    const BaseUrl = requests.BaseUrlReception;
    axios
      .get(`${BaseUrl}/department/`)
      .then((response) => {
        console.log(response.data);
        setAllDepartment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChangeDepartment = (e) => {
    setDepartment(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const BaseUrl = requests.BaseUrlReception;
    axios
      .post(`${BaseUrl}/department/`,{ department: department })
      .then((response) => {
        console.log(response.data);
        window.location.href ='/reception/department'
      })
      .catch((error) => {
        console.log(error);
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
            
              to={menu.path}
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
            <h2 className="text-4xl font-semibold mb-4">Add Department</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                New Department:
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md bg-slate-700 text-white"
                name="department"
                value={department}
                onChange={handleChangeDepartment}
              />
            </div>
            <Button type="submit" label="Add Department" />
          </form>
          <div className="list-none">
          <h2 className="text-4xl font-semibold my-4">Current Departments</h2>
          <ul className=" list-inside text-white text-center">
            {alldepartment &&
              alldepartment.map((dept) => <li className="p-5 text-2xl bg-slate-900 rounded-md  mt-4" key={dept.id}>{dept.department}</li>)}
          </ul>
        </div>
        </div>        
      </div>
    </div>
  );
};

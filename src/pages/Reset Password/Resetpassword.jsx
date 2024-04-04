import React, { useState } from 'react'
import Button from '../../components/Button/Button'
import axios from 'axios';
import requests from '../../config';
import { useNavigate } from 'react-router-dom';

const Resetpassword = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  })

  const [error, setError] = useState(null);

  const handleChange = (e) =>{
    const{name, value} = e.target;
    setData({ ...data, [name]: value });
    console.log(`${name}: ${value}`);
  }

  const handleSubmit = (e) =>{
    e.preventDefault();

    if(data.new_password !== data.confirm_new_password){
      setError("New password and confirm password do not match");
      return;
    }
    setError(null);

    const BaseUrl = requests.BaseUrlAuth
    axios.post(`${BaseUrl}/resetpassword/`,data)
    .then((response) =>{
      console.log(response.data);
      navigate(`/`)
    }).catch((error) =>{
      console.log(error.response);
      if(error.response && error.response.data && error.response.data.error){
        setError(error.response.data.error);
      }else if (error.response && error.response.data && error.response.data.new_password){
        setError(error.response.data.new_password.join(", "));
      }
      else{
        setError("An error occurred. Please try again.")
      }
    })
  }



  return (
    <div className="flex items-center justify-center h-screen bg-gray-800">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-xl overflow-hidden">
        <div className="bg-gray-700 bg-opacity-60 backdrop-filter backdrop-blur-lg p-4">
          <div className="p-7">
            <h1 className="mb-6 text-3xl text-center text-white">Reset Password</h1>
          </div>
          <form className="px-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <div className="mb-3 flex flex-col">
                <label className="inline-block mb-2 text-gray-400">Username</label>
                <input
                  className="rounded-md w-full sm:w-72 p-2 bg-gray-300 backdrop-blur-md placeholder-gray-500 text-black"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="mb-3 flex flex-col">
                <label className="inline-block mb-2 text-gray-400">Current Password</label>
                <input
                  className="rounded-md w-full sm:w-72 p-2 bg-gray-300 backdrop-blur-md placeholder-gray-500 text-black"
                  type="password"
                  name="current_password"
                  placeholder="Enter your current password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-3">
              
              <div className="flex flex-col flex-grow">
                <label className="inline-block mb-2 text-gray-400">New Password</label>
                <input
                  className="rounded-md w-full p-2 bg-gray-300 backdrop-blur-md placeholder-gray-500 text-black"
                  type="password"
                  name="new_password"
                  placeholder="Enter New password"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col flex-grow">
                <label className="inline-block mb-2 text-gray-400">Confirm Password</label>
                <input
                  className="rounded-md w-full p-2 bg-gray-300 backdrop-blur-md placeholder-gray-500 text-black"
                  type="password"
                  name="confirm_new_password"
                  placeholder="Confirm new password"
                  onChange={handleChange}
                />
              </div>
            </div>

        
              {error && (
                <div className="bg-red-500 bg-opacity-10 backdrop-filter backdrop-blur-lg  border border-red-500 text-white p-2 rounded-md mb-2 mt-5">
                  {error}
                </div>
              )}
     
            <div className="mt-5">
            <Button type="submit" label="Reset password" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Resetpassword
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkLoggedInUser = () => {
      const usertoken = Cookies.get("token");
      if (usertoken) {
        try {
          const decodedToken = jwtDecode(usertoken);

          setUser(decodedToken);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error decoding token:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const handleLogOut = () => {
    Cookies.remove("token");
    window.location.href = "/";
  };

  const handleClickLogin = () => {
    navigate(`/`);
  };

  const handleClickSignup = () => {
    navigate("/register");
  };

  return (
    <nav className="bg-slate-950 p-5">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold">Med</span>
          <span className="text-cyan-500 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mx-1">X</span>
        </div>
        {isLoggedIn ? (
          <>
            {user.is_reception && (
              <span className="text-white text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl mx-2">Reception</span>
            )}
            {user.is_pharmacy && (
              <span className="text-white text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl mx-2">Pharmacy</span>
            )}
            {user.is_doctor && (
              <span className="text-white text-sm sm:text-md md:text-lg lg:text-xl xl:text-2xl mx-2">
                Dr. {`${user.first_name} ${user.last_name}`}
              </span>
            )}
            <button
              className="text-white bg-slate-700 hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl px-3 py-2 text-center me-2 mb-2"
              onClick={handleLogOut}
            >
              Log out
            </button>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              className="text-white bg-slate-700 hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl px-3 py-2 text-center me-2 mb-2"
              onClick={handleClickLogin}
            >
              Login
            </button>
            <button
              className="text-white bg-slate-700 hover:bg-gray-800 focus:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl px-3 py-2 text-center me-2 mb-2"
              onClick={handleClickSignup}
            >
              Sign up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

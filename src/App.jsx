import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Resetpassword from "./pages/Reset Password/Resetpassword";
import Register from "./pages/Register/Register";
import Receptionhome from "./pages/Receptionpage/Receptionhome";
import { Adddepartment } from "./pages/AddDepartment/Adddepartment";
import Addpatient from "./pages/Addpatient/Addpatient";
import Appointment from "./pages/Appointment/Appointment";
import Patienthistory from "./pages/Patienthistory/Patienthistory";
import Doctorhome from "./pages/Doctorpage/Doctorhome";
import Detailappointment from "./pages/DetailAppointment/Detailappointment";
import Doctorsearchpatient from "./pages/Doctorsearchpatient/Doctorsearchpatient";
import Pharmacyhome from "./pages/PharmacyHome/Pharmacyhome";
import PatientPrescriptionDetail from "./pages/PatientPrescriptionDetail/PatientPrescriptionDetail";
import SerachPatienPrescription from "./pages/SearchPatientPrescription/SerachPatienPrescription";


// import PrivateRoute from "./components/Privateroute/Privateroute";


function App() {
  return (
    <Router>
     <Navbar />
     <Routes>
     <Route path="/" element={<Login/>}/>
     <Route path="/resetpassword" element={<Resetpassword/>}/>
     <Route path="/register" element={<Register/>}/>
     <Route path="/reception/home" element={<Receptionhome/>} />
     <Route path="/reception/department" element={<Adddepartment/>} />
     <Route path="/reception/addpatient" element={<Addpatient/>} />
     <Route path="/reception/appointment" element={<Appointment/>} />
     <Route path="/reception/patienthistory" element={<Patienthistory/>} />
     <Route path="/doctor/home" element={<Doctorhome/>} />
     <Route path="/doctor/appointment_detail/:appointmentId" element={<Detailappointment />} />
     <Route path="/doctor/search-patient" element={<Doctorsearchpatient />} />
     <Route path="/pharmacy/home" element={<Pharmacyhome/>} />
     <Route path="/pharmacy/prescription-detail/:prescriptionId" element={<PatientPrescriptionDetail/>}/>
     <Route path="/pharmacy/search-patient-perscription" element={<SerachPatienPrescription />} />
     </Routes>
    </Router>
  );
}

export default App;

import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/components/Header";
import Customer from "./pages/customer/CustomerMain";
import "./index.css"
import { UserContext } from "./utils/globalContext";

function App() {
  const [user, setUser] = useState('')
  return (
    <>
      <BrowserRouter>
      <UserContext.Provider value={{user, setUser}}>
        <div className="container">
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/customer' element={<Customer />} />
          </Routes>
        </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

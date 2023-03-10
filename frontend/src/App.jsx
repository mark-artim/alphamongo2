import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/components/Header";
import Product from "./pages/product/ProductMain";
import Customer from "./pages/customer/CustomerMain";
import Salesorder from "./pages/order/Salesorder.jsx";
import SalesOrder2 from "./pages/order/salesOrder2";
import SalesOrder3 from "./pages/order/SalesOrder3";
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
            <Route path='/product' element={<Product />} />
            <Route path='/customer' element={<Customer />} />
            <Route path='/soe' element={<Salesorder />} />
            <Route path='/soe2' element={<SalesOrder2 />} />
            <Route path='/soe3' element={<SalesOrder3 />} />
          </Routes>
        </div>
        </UserContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;

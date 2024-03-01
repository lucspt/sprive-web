import { useContext, useEffect } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { getCookie, isObjectEmpty } from "../../utils"
import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoutes() {
  const { isLoggedIn } = useContext(SaviorContext);
  
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace/>
}
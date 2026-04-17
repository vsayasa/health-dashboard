import { Outlet } from "react-router";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect (() => { 
    const checkAuth = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      setIsLoggedin(false);
      navigate('/login');
    }
    else {
      console.log("User authenticated");  
      setIsLoggedin(true);
    }
    setLoading(false);
  }
  checkAuth();
}, []);
  


        return (
    <div className="protected-layout">
      <Outlet />
    </div>
  );
    
  }


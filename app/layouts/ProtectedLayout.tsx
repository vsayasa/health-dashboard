import { Outlet } from "react-router";
import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/ui/navbar";

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
      
      // Check if they exist in db:
      const doTheyExist = await fetch(`/api/users/${data.user.id}`);
      const response = await doTheyExist.json();
      if (!response) {

      console.log("they aint here chief");

      // Here put code to create user
     await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            created_at: new Date().toISOString(),
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0]
        })
    });
      }
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


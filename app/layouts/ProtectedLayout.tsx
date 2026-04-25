import { Outlet } from "react-router";
import supabase from "../supabaseClient";
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
      console.log(data.user);
      const doTheyExist = await fetch(`/api/users/${data.user.email}`);
      const response = await doTheyExist.json();
      if (response) {
      console.log(response);
      }
      else {
      console.log("they aint here chief");

      // Here put code to create user
     await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: data.user.email
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
      <Navbar />
      <Outlet />
    </div>
  );
    
  }


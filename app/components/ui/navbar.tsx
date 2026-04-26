import { supabase } from "../../supabaseClient";
import { NavLink } from "react-router";
export default function Navbar() {

//     const logout = async ()=> {
//         const { error }= await supabase.auth.signOut();
//     };

// return (<div className="navbar h-20 p-4 grid grid-cols-12 gap-8">
//       <div className="flex items-center col-span-5 justify-end h-12">

//         {/* temporary logout button for peace of mind, move elsewhere */}
//         <button
//           onClick={logout}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
    
  // );
  return(
      <div className="w-64 bg-gray-900/70 backdrop-blur-lg border-r border-gray-800 p-6 flex flex-col gap-6 relative z-10">
        <h1 className="text-2xl font-bold">
          <span className="text-green-400">Vita</span>
          <span className="text-blue-400">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-3 mt-6">

<NavLink
  to="/dashboard"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Dashboard
</NavLink>

<NavLink
  to="/logmetrics"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Log Metrics
</NavLink>

<NavLink
  to="/files"
  className={({ isActive }) =>
    `px-4 py-2 rounded-full text-left transition ${
      isActive
        ? "bg-gradient-to-r from-green-400 to-blue-500 text-black font-medium"
        : "text-gray-400 hover:text-white"
    }`
  }
>
  Files
</NavLink>

        </nav>
      </div>);
      
}
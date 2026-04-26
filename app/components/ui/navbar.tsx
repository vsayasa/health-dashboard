import { supabase } from "../../supabaseClient";

export default function Navbar() {

    const logout = async ()=> {
        const { error }= await supabase.auth.signOut();
    };

return (<div className="navbar h-20 p-4 grid grid-cols-12 gap-8">
      <div className="flex items-center col-span-5 justify-end h-12">

        {/* temporary logout button for peace of mind, move elsewhere */}
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>);
}
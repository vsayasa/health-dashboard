import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, NavLink } from "react-router";
import Logo from "../components/ui/Logo";
import { Link } from "react-router";

export default function Files() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const [mealFiles, setMealFiles] = useState<any[]>([]);
  const [reportFiles, setReportFiles] = useState<any[]>([]);

  const [imageUploading, setImageUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user?.email) {
        const name = data.user.email.split("@")[0];
        setFirstName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchFiles();
  }, [user]);

  const fetchFiles = async () => {
    const res = await fetch(`https://func-vitametrics.azurewebsites.net/api/files?user_id=${user.id}`);
    const data = await res.json();

    setMealFiles(data.filter((file: any) => file.file_type === "meal"));
    setReportFiles(data.filter((file: any) => file.file_type === "report"));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const uploadFile = async (
    selectedFile: File | undefined,
    fileType: "meal" | "report"
  ) => {
    if (!selectedFile || !user) return;

    if (fileType === "meal") setImageUploading(true);
    if (fileType === "report") setFileUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("user_id", user.id);
    formData.append("date", date);
    formData.append("file_type", fileType);

    const res = await fetch("https://func-vitametrics.azurewebsites.net/api/files", {
      method: "POST",
      body: formData,
    });

    if (fileType === "meal") setImageUploading(false);
    if (fileType === "report") setFileUploading(false);

    if (res.ok) {
      await fetchFiles();
    } else {
      const errorText = await res.text();
      console.error("Upload failed:", errorText);
      alert(`Upload failed: ${errorText}`);
    }
  };

  const deleteFile = async (file: any) => {
    const confirmDelete = window.confirm(`Delete ${file.file_name}?`);
    if (!confirmDelete) return;

    setDeletingId(file.id);

    const res = await fetch(`https://func-vitametrics.azurewebsites.net/api/files?id=${file.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: file.user_id,
        container_name: file.container_name,
        blob_name: file.blob_name,
      }),
    });

    setDeletingId("");

    if (res.ok) {
      await fetchFiles();
    } else {
      const errorText = await res.text();
      console.error("Delete failed:", errorText);
      alert(`Delete failed: ${errorText}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white text-sm">
      <div className="w-60 bg-gray-900/70 border-r border-gray-800 p-5 flex flex-col gap-5">
        <div className="flex flex-col items-center -mt-10 -mb-10">
          <Link to="/" className="hover:opacity-80 transition cursor-pointer">
            <Logo size="xl" />
          </Link>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {[
            { path: "dashboard", label: "Dashboard" },
            { path: "logmetrics", label: "Log Metrics" },
            { path: "goals", label: "Goals" }, 
            { path: "files", label: "Files" },
          ].map(({ path, label }) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${
                  isActive
                    ? "bg-gray-300 text-black font-semibold"
                    : "text-gray-400 hover:text-white font-semibold"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 p-9">
        <div className="flex justify-between items-center mb-2 pb-2">
          <div>
            <h1 className="text-3xl font-semibold">Health Library</h1>
            <p className="text-gray-400 text-s mt-1">{currentDate}</p>
            <p className="text-gray-500 text-xs mt-4">
              Upload and manage your meals and health reports
            </p>
          </div>

          <div
            className="relative z-50"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2 -mt-10 cursor-pointer">
              <span>{firstName}</span>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {firstName[0]}
              </div>
            </div>

            {menuOpen && (
                <div className="absolute right-0 pt-1 w-40 z-50">
                  <div className="bg-gray-900 border rounded">
                    <button
                      onClick={handleLogout}
                      className="w-full p-2 text-left text-red-400 hover:bg-gray-800 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-s">
          <label className="text-gray-400">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 px-2 py-1 rounded-2xl text-s w-36"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Meal Gallery</h2>
              <label className="bg-[#6aaed0] hover:bg-[#5a9cc0] text-black px-4 py-2 rounded-full font-semibold cursor-pointer">
                {imageUploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={imageUploading}
                  onChange={(e) => uploadFile(e.target.files?.[0], "meal")}
                />
              </label>
            </div>
            <p className="text-gray-500 text-xs -mt-4 mb-4">
              Images are organized by upload date
            </p> 
            <div className="bg-black/30 border border-gray-800 rounded-2xl p-3 min-h-[300px]">
              {mealFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No meal images uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mealFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-800 rounded-2xl overflow-hidden"
                    >
                      <img
                        src={file.file_url}
                        alt={file.file_name}
                        className="w-full h-28 object-cover"
                      />

                      <div className="p-2">
                        <p className="text-xs truncate">{file.file_name}</p>
                        <p className="text-[10px] text-gray-500">
                          {file.date}
                        </p>

                        <button
                          onClick={() => deleteFile(file)}
                          disabled={deletingId === file.id}
                          className="mt-2 text-[10px] text-red-400 hover:text-red-300 disabled:opacity-50"
                        >
                          {deletingId === file.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Health Reports</h2>

              <label className="bg-[#6aaed0] hover:bg-[#5a9cc0] text-black px-4 py-2 rounded-full font-semibold cursor-pointer">
                {fileUploading ? "Uploading..." : "Upload File"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  className="hidden"
                  disabled={fileUploading}
                  onChange={(e) => uploadFile(e.target.files?.[0], "report")}
                />
              </label>
            </div>
            <p className="text-gray-500 text-xs -mt-4 mb-4">
              Click to open or download reports
            </p> 
            <div className="bg-black/30 border border-gray-800 rounded-2xl p-3 min-h-[300px]">
              {reportFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No health reports uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-800 rounded-2xl p-3 hover:bg-gray-700 transition"
                    >
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <p className="text-sm truncate">{file.file_name}</p>
                        <p className="text-xs text-gray-500">{file.date}</p>
                        <p className="text-[10px] text-sky-300 mt-2">
                          Open file →
                        </p>
                      </a>

                      <button
                        onClick={() => deleteFile(file)}
                        disabled={deletingId === file.id}
                        className="mt-2 text-[10px] text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        {deletingId === file.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
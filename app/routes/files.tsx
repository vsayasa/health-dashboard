import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, NavLink } from "react-router";

export default function Files() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const [mealFiles, setMealFiles] = useState<any[]>([]);
  const [reportFiles, setReportFiles] = useState<any[]>([]);

  const [imageUploading, setImageUploading] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

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
    const res = await fetch(`/api/files?user_id=${user.id}`);
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

    const res = await fetch("/api/files/upload", {
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

  return (
    <div className="flex min-h-screen bg-black text-white text-sm">
      {/* SIDEBAR */}
      <div className="w-60 bg-gray-900/70 border-r border-gray-800 p-5 flex flex-col gap-5">
        <h1 className="text-xl font-bold">
          <span className="text-lime-200">Vita</span>
          <span className="text-sky-300">Metrics</span>
        </h1>

        <nav className="flex flex-col gap-2 mt-4">
          {["dashboard", "logmetrics", "files"].map((path) => (
            <NavLink
              key={path}
              to={`/${path}`}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full ${
                  isActive
                    ? "bg-gradient-to-r from-lime-300 to-sky-400 text-black"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              {path === "dashboard"
                ? "Dashboard"
                : path === "logmetrics"
                ? "Log Metrics"
                : "Files"}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-9">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2 pb-2">
          <div>
            <h1 className="text-2xl font-semibold">Files</h1>
            <p className="text-gray-400 text-xs">{currentDate}</p>
          </div>

          {/* PROFILE */}
          <div
            className="relative z-50"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <span>{firstName}</span>
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                {firstName[0]}
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 top-full pt-1 w-40 z-50">
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

        {/* DATE PICKER */}
        <div className="mb-4 flex items-center gap-2 text-xs">
          <label className="text-gray-400">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-gray-800 px-2 py-1 rounded text-xs w-36"
          />
        </div>

        {/* TWO COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* IMAGE UPLOAD */}
          <div className="bg-gray-900 p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Meal Gallery</h2>

              <label className="bg-gradient-to-r from-lime-300 to-sky-400 text-black px-4 py-2 rounded font-semibold cursor-pointer">
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

            <div className="bg-black/30 border border-gray-800 rounded p-3 min-h-[300px]">
              {mealFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No meal images uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mealFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-800 rounded overflow-hidden"
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FILE UPLOAD */}
          <div className="bg-gray-900 p-4 rounded">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Health Reports</h2>

              <label className="bg-gradient-to-r from-lime-300 to-sky-400 text-black px-4 py-2 rounded font-semibold cursor-pointer">
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

            <div className="bg-black/30 border border-gray-800 rounded p-3 min-h-[300px]">
              {reportFiles.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No health reports uploaded yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {reportFiles.map((file) => (
                    <a
                      key={file.id}
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-800 rounded p-3 hover:bg-gray-700 transition"
                    >
                      <p className="text-sm truncate">{file.file_name}</p>
                      <p className="text-xs text-gray-500">{file.date}</p>
                      <p className="text-[10px] text-sky-300 mt-2">
                        Open file →
                      </p>
                    </a>
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
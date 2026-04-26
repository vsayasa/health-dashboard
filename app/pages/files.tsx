
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Navbar from "../components/ui/navbar";

export default function Files() {
  const [user, setUser] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<string[]>([]);

  // get user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  // fetch files from storage
  const fetchFiles = async () => {
    if (!user) return;

    const { data: imgData } = await supabase.storage
      .from("meal-images")
      .list(user.id);

    const { data: fileData } = await supabase.storage
      .from("health-reports")
      .list(user.id);

    setImages(
      imgData?.map(
        (file) =>
          supabase.storage
            .from("meal-images")
            .getPublicUrl(`${user.id}/${file.name}`).data.publicUrl
      ) || []
    );

    setFiles(
      fileData?.map(
        (file) =>
          supabase.storage
            .from("health-reports")
            .getPublicUrl(`${user.id}/${file.name}`).data.publicUrl
      ) || []
    );
  };

  useEffect(() => {
    fetchFiles();
  }, [user]);

  // upload handler
  const handleUpload = async (e: any, type: "image" | "file") => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const bucket = type === "image" ? "meal-images" : "health-reports";

    const { error } = await supabase.storage
      .from(bucket)
      .upload(`${user.id}/${Date.now()}-${file.name}`, file);

    if (error) {
      console.error(error);
      alert("Upload failed");
    } else {
      fetchFiles(); // refresh gallery
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden">
      <Navbar />

      {/* glow background */}
      <div className="absolute w-[400px] h-[400px] bg-green-500/20 blur-3xl rounded-full top-20 left-10"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-3xl rounded-full bottom-10 right-10"></div>

      <div className="flex-1 p-6 relative z-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-semibold">Files</h1>
            <p className="text-gray-400">
              {new Date().toDateString()}
            </p>
          </div>

          <div className="flex gap-6">
            {/* Upload Image */}
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-full transition">
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, "image")}
              />
            </label>

            {/* Upload File */}
            <label className="cursor-pointer bg-blue-500 hover:bg-blue-400 px-6 py-3 rounded-full transition">
              Upload File
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleUpload(e, "file")}
              />
            </label>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-6">

          {/* MEAL GALLERY */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">Meal Gallery</h2>

            <div className="grid grid-cols-2 gap-4">
              {images.length ? (
                images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="rounded-xl object-cover w-full h-40"
                  />
                ))
              ) : (
                <p className="text-gray-500">No images yet</p>
              )}
            </div>
          </div>

          {/* REPORT GALLERY */}
          <div className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl">
            <h2 className="mb-4 text-lg font-medium">
              Health Report Gallery
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {files.length ? (
                files.map((src, i) => (
                  <iframe
                    key={i}
                    src={src}
                    className="rounded-xl w-full h-40 bg-white"
                  />
                ))
              ) : (
                <p className="text-gray-500">No reports yet</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
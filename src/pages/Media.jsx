import { useEffect, useState } from "react";
import api from "../services/api";

function Media() {
    const [media, setMedia] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadMedia();
    }, []);

    const loadMedia = async () => {
        try {
            const response = await api.get("/media");
            setMedia(response.data);
        } catch (error) {
            console.error("Error loading media:", error);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setUploading(true);

        try {
            await api.post("/media/upload", formData);

            setSelectedFile(null);

            document.getElementById("media-file-input").value = "";

            await loadMedia();

            alert("File uploaded successfully.");
        } catch (error) {
            console.error("Upload error:", error);
            alert("File upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const deleteMedia = async (id) => {
        if (!window.confirm("Delete this media record?")) return;

        try {
            await api.delete(`/media/${id}`);
            loadMedia();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    return (
        <div className="cms-page">

            <div className="page-heading">
                <div>
                    <span className="card-label">FILES</span>
                    <h2>Media Library</h2>
                    <p>Upload and manage images and other portfolio media.</p>
                </div>

                <div className="page-count">
                    {media.length} Files
                </div>
            </div>

            <div className="media-upload-card">

                <form onSubmit={handleUpload}>

                    <div className="upload-area">

                        <div className="upload-icon">
                            ↑
                        </div>

                        <h3>Upload Media</h3>

                        <p>
                            Select an image or file to upload to your media library.
                        </p>

                        <input
                            id="media-file-input"
                            type="file"
                            onChange={(e) =>
                                setSelectedFile(e.target.files[0])
                            }
                        />

                        {selectedFile && (
                            <span className="selected-file">
                                {selectedFile.name}
                            </span>
                        )}

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload File"}
                        </button>

                    </div>

                </form>

            </div>

            {media.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">▣</div>
                    <h3>No media files</h3>
                    <p>Uploaded files will appear here.</p>
                </div>
            ) : (
                <div className="media-grid">

                    {media.map((item) => (
                        <div className="media-card" key={item.id}>

                            <div className="media-preview">

                                {item.fileType?.startsWith("image/") ? (
                                    <img
                                        src={item.fileUrl}
                                        alt={item.fileName}
                                    />
                                ) : (
                                    <div className="file-icon">
                                        📄
                                    </div>
                                )}

                            </div>

                            <div className="media-info">

                                <strong title={item.fileName}>
                                    {item.fileName}
                                </strong>

                                <span>
                                    {item.fileType || "Unknown type"}
                                </span>

                                <span>
                                    {item.fileSize
                                        ? `${Math.round(item.fileSize / 1024)} KB`
                                        : ""}
                                </span>

                            </div>

                            <div className="media-actions">

                                <a
                                    href={item.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="secondary-button"
                                >
                                    View
                                </a>

                                <button
                                    className="danger-button"
                                    onClick={() => deleteMedia(item.id)}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Media;
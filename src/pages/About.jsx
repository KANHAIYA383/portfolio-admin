import { useEffect, useState } from "react";
import api from "../services/api";

function About() {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        bio: "",
        profileImage: "",
        email: "",
        phone: "",
        location: "",
        githubUrl: "",
        linkedinUrl: ""
    });

    useEffect(() => {
        loadAbout();
    }, []);

    const loadAbout = async () => {
        try {
            const response = await api.get("/about");

            if (response.data) {
                const data = Array.isArray(response.data)
                    ? response.data[0]
                    : response.data;

                if (data) {
                    setAbout(data);

                    setFormData({
                        name: data.name || "",
                        title: data.title || "",
                        bio: data.bio || "",
                        profileImage: data.profileImage || "",
                        email: data.email || "",
                        phone: data.phone || "",
                        location: data.location || "",
                        githubUrl: data.githubUrl || "",
                        linkedinUrl: data.linkedinUrl || ""
                    });
                }
            }
        } catch (error) {
            console.error("Error loading about:", error);
            setMessage("Unable to load About information.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            if (about && about.id) {
                await api.put(`/about/${about.id}`, formData);
                setMessage("About information updated successfully.");
            } else {
                const response = await api.post("/about", formData);

                setAbout(response.data);

                setMessage("About information created successfully.");
            }

            await loadAbout();
        } catch (error) {
            console.error("Error saving about:", error);
            setMessage("Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading About information...
            </div>
        );
    }

    return (
        <div className="cms-page">

            <div className="cms-page-header">
                <div>
                    <span className="card-label">
                        PORTFOLIO
                    </span>

                    <h2>About Me</h2>

                    <p>
                        Manage your personal information and profile details.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <form
                className="cms-form-card"
                onSubmit={handleSubmit}
            >

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>Personal Information</h3>
                        <p>
                            Basic information displayed on your portfolio.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Professional Title</label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Full Stack Developer"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Bio</label>

                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Write something about yourself..."
                                rows="6"
                            />
                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>Contact Information</h3>
                        <p>
                            Information visitors can use to contact you.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>

                        <div className="form-group">
                            <label>Location</label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="India"
                            />
                        </div>

                    </div>

                </div>

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>Social Profiles</h3>
                        <p>
                            Add links to your professional profiles.
                        </p>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>GitHub URL</label>

                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="form-group">
                            <label>LinkedIn URL</label>

                            <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                        <div className="form-group full-width">
    <label>Profile Image</label>

    <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
            const file = e.target.files[0];

            if (!file) return;

            try {
                setMessage("Uploading image...");

                const uploadData = new FormData();
                uploadData.append("file", file);

                const response = await api.post(
                    "/media/upload",
                    uploadData
                );

                setFormData((previous) => ({
                    ...previous,
                    profileImage: response.data.fileUrl
                }));

                setMessage("Image uploaded successfully.");
            } catch (error) {
                console.error("Image upload failed:", error);
                setMessage("Image upload failed.");
            }
        }}
    />

    {formData.profileImage && (
        <div style={{ marginTop: "15px" }}>
            <img
                src={formData.profileImage}
                alt="Profile preview"
                style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    border: "1px solid #e1e3ea"
                }}
            />
        </div>
    )}
</div>

                       

                    </div>

                </div>

                <div className="form-actions">

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default About;
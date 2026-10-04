import { useEffect, useState } from "react";
import api from "../services/api";

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        company: "",
        message: "",
        profileImage: "",
        rating: 5,
        displayOrder: 0
    });

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        try {
            const response = await api.get("/testimonials");
            setTestimonials(response.data);
        } catch (error) {
            console.error("Error loading testimonials:", error);
            setMessage("Unable to load testimonials.");
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

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            company: "",
            message: "",
            profileImage: "",
            rating: 5,
            displayOrder: 0
        });

        setEditingId(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploading(true);
            setMessage("Uploading profile image...");

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

            setMessage("Profile image uploaded successfully.");
        } catch (error) {
            console.error("Image upload failed:", error);
            setMessage("Profile image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const data = {
                name: formData.name,
                role: formData.role,
                company: formData.company,
                message: formData.message,
                profileImage: formData.profileImage,
                rating: Number(formData.rating) || 5,
                displayOrder: Number(formData.displayOrder) || 0
            };

            if (editingId) {
                await api.put(`/testimonials/${editingId}`, data);
                setMessage("Testimonial updated successfully.");
            } else {
                await api.post("/testimonials", data);
                setMessage("Testimonial added successfully.");
            }

            resetForm();
            await loadTestimonials();
        } catch (error) {
            console.error("Error saving testimonial:", error);
            setMessage("Unable to save testimonial.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (testimonial) => {
        setEditingId(testimonial.id);

        setFormData({
            name: testimonial.name || "",
            role: testimonial.role || "",
            company: testimonial.company || "",
            message: testimonial.message || "",
            profileImage: testimonial.profileImage || "",
            rating: testimonial.rating ?? 5,
            displayOrder: testimonial.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this testimonial?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/testimonials/${id}`);

            setMessage("Testimonial deleted successfully.");

            await loadTestimonials();
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            setMessage("Unable to delete testimonial.");
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading testimonials...
            </div>
        );
    }

    return (
        <div className="cms-page">

            <div className="cms-page-header">
                <div>
                    <span className="card-label">
                        CONTENT
                    </span>

                    <h2>Testimonials</h2>

                    <p>
                        Manage client and user testimonials displayed on your portfolio.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            <div className="cms-form-card">

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>
                            {editingId
                                ? "Edit Testimonial"
                                : "Add New Testimonial"}
                        </h3>

                        <p>
                            Add feedback from a client, colleague or user.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>

                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="Project Manager"
                                />
                            </div>

                            <div className="form-group">
                                <label>Company</label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="ABC Technologies"
                                />
                            </div>

                            <div className="form-group">
                                <label>Rating</label>

                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                >
                                    <option value="1">1 Star</option>
                                    <option value="2">2 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="5">5 Stars</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Display Order</label>

                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={formData.displayOrder}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="form-group full-width">

                                <label>Profile Image</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />

                                {uploading && (
                                    <span className="upload-status">
                                        Uploading image...
                                    </span>
                                )}

                                {formData.profileImage && (
                                    <div className="testimonial-image-preview">
                                        <img
                                            src={formData.profileImage}
                                            alt="Profile preview"
                                        />
                                    </div>
                                )}

                            </div>

                            <div className="form-group full-width">

                                <label>Testimonial</label>

                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write the testimonial..."
                                    rows="6"
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-actions">

                            {editingId && (
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving || uploading}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Testimonial"
                                        : "Add Testimonial"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <div className="cms-list-card">

                <div className="cms-list-header">

                    <div>
                        <span className="card-label">
                            CONTENT
                        </span>

                        <h3>Your Testimonials</h3>
                    </div>

                    <span className="item-count">
                        {testimonials.length} testimonial
                        {testimonials.length !== 1 ? "s" : ""}
                    </span>

                </div>

                {testimonials.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ★
                        </div>

                        <h3>No testimonials yet</h3>

                        <p>
                            Add your first testimonial using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="testimonials-list">

                        {testimonials.map((testimonial) => (

                            <div
                                className="testimonial-row"
                                key={testimonial.id}
                            >

                                <div className="testimonial-avatar">

                                    {testimonial.profileImage ? (
                                        <img
                                            src={testimonial.profileImage}
                                            alt={testimonial.name}
                                        />
                                    ) : (
                                        <span>
                                            {testimonial.name
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    )}

                                </div>

                                <div className="testimonial-info">

                                    <div className="testimonial-title-row">

                                        <strong>
                                            {testimonial.name}
                                        </strong>

                                        <span className="rating-badge">
                                            {"★".repeat(
                                                Math.max(
                                                    0,
                                                    Math.min(
                                                        5,
                                                        testimonial.rating || 0
                                                    )
                                                )
                                            )}
                                        </span>

                                    </div>

                                    <span className="testimonial-role">

                                        {testimonial.role || "Client"}

                                        {testimonial.company
                                            ? ` • ${testimonial.company}`
                                            : ""}

                                    </span>

                                    <p>
                                        "{testimonial.message}"
                                    </p>

                                </div>

                                <div className="testimonial-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(testimonial)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(testimonial.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Testimonials;
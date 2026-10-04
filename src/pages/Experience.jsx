import { useEffect, useState } from "react";
import api from "../services/api";

function Experience() {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        location: "",
        displayOrder: 0
    });

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        try {
            const response = await api.get("/experience");
            setExperiences(response.data);
        } catch (error) {
            console.error("Error loading experience:", error);
            setMessage("Unable to load experience.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            company: "",
            position: "",
            description: "",
            startDate: "",
            endDate: "",
            isCurrent: false,
            location: "",
            displayOrder: 0
        });

        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setMessage("");

        try {
            const data = {
                company: formData.company,
                position: formData.position,
                description: formData.description,
                startDate: formData.startDate || null,
                endDate: formData.isCurrent
                    ? null
                    : formData.endDate || null,
                isCurrent: formData.isCurrent,
                location: formData.location,
                displayOrder: Number(formData.displayOrder) || 0
            };

            if (editingId) {
                await api.put(`/experience/${editingId}`, data);
                setMessage("Experience updated successfully.");
            } else {
                await api.post("/experience", data);
                setMessage("Experience added successfully.");
            }

            resetForm();
            await loadExperiences();

        } catch (error) {
            console.error("Error saving experience:", error);
            setMessage("Unable to save experience.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (experience) => {
        setEditingId(experience.id);

        setFormData({
            company: experience.company || "",
            position: experience.position || "",
            description: experience.description || "",
            startDate: experience.startDate || "",
            endDate: experience.endDate || "",
            isCurrent: experience.isCurrent || false,
            location: experience.location || "",
            displayOrder: experience.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this experience?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/experience/${id}`);

            setMessage("Experience deleted successfully.");

            await loadExperiences();

        } catch (error) {
            console.error("Error deleting experience:", error);
            setMessage("Unable to delete experience.");
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading experience...
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

                    <h2>Experience</h2>

                    <p>
                        Manage your professional experience and work history.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* FORM */}

            <div className="cms-form-card">

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>
                            {editingId
                                ? "Edit Experience"
                                : "Add New Experience"}
                        </h3>

                        <p>
                            Add your professional experience.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Company</label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Position</label>

                                <input
                                    type="text"
                                    name="position"
                                    value={formData.position}
                                    onChange={handleChange}
                                    placeholder="Software Developer"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Start Date</label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    disabled={formData.isCurrent}
                                />
                            </div>

                            <div className="form-group">
                                <label>Location</label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Jamshedpur, India"
                                />
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

                                <label>Description</label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your responsibilities and achievements..."
                                    rows="6"
                                />

                            </div>

                            <div className="form-group full-width">

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="isCurrent"
                                        checked={formData.isCurrent}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        I currently work here
                                    </span>

                                </label>

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
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Experience"
                                        : "Add Experience"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            {/* LIST */}

            <div className="cms-list-card">

                <div className="cms-list-header">

                    <div>
                        <span className="card-label">
                            CONTENT
                        </span>

                        <h3>Your Experience</h3>
                    </div>

                    <span className="item-count">
                        {experiences.length} position
                        {experiences.length !== 1 ? "s" : ""}
                    </span>

                </div>

                {experiences.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            💼
                        </div>

                        <h3>No experience yet</h3>

                        <p>
                            Add your first experience using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="experience-list">

                        {experiences.map((experience) => (

                            <div
                                className="experience-row"
                                key={experience.id}
                            >

                                <div className="experience-icon">
                                    💼
                                </div>

                                <div className="experience-info">

                                    <div className="experience-title-row">

                                        <strong>
                                            {experience.position}
                                        </strong>

                                        {experience.isCurrent && (
                                            <span className="current-badge">
                                                Current
                                            </span>
                                        )}

                                    </div>

                                    <span className="experience-company">
                                        {experience.company}
                                        {experience.location
                                            ? ` • ${experience.location}`
                                            : ""}
                                    </span>

                                    <span className="experience-date">

                                        {experience.startDate || "—"}

                                        {" → "}

                                        {experience.isCurrent
                                            ? "Present"
                                            : experience.endDate || "—"}

                                    </span>

                                    {experience.description && (
                                        <p>
                                            {experience.description}
                                        </p>
                                    )}

                                </div>

                                <div className="experience-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(experience)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(experience.id)
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

export default Experience;
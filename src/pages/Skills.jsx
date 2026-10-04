import { useEffect, useState } from "react";
import api from "../services/api";

function Skills() {

    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        proficiency: "",
        icon: "",
        displayOrder: 0
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const response = await api.get("/skills");
            setSkills(response.data);
        } catch (error) {
            console.error("Error loading skills:", error);
            setMessage("Unable to load skills.");
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
            category: "",
            proficiency: "",
            icon: "",
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
                name: formData.name,
                category: formData.category,
                proficiency: formData.proficiency
                    ? Number(formData.proficiency)
                    : null,
                icon: formData.icon,
                displayOrder: Number(formData.displayOrder) || 0
            };

            if (editingId) {

                await api.put(
                    `/skills/${editingId}`,
                    data
                );

                setMessage("Skill updated successfully.");

            } else {

                await api.post("/skills", data);

                setMessage("Skill added successfully.");
            }

            resetForm();
            await loadSkills();

        } catch (error) {

            console.error("Error saving skill:", error);
            setMessage("Unable to save skill.");

        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill) => {

        setEditingId(skill.id);

        setFormData({
            name: skill.name || "",
            category: skill.category || "",
            proficiency: skill.proficiency ?? "",
            icon: skill.icon || "",
            displayOrder: skill.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this skill?"
        );

        if (!confirmed) return;

        try {

            await api.delete(`/skills/${id}`);

            setMessage("Skill deleted successfully.");

            await loadSkills();

        } catch (error) {

            console.error("Error deleting skill:", error);
            setMessage("Unable to delete skill.");
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading skills...
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

                    <h2>Skills</h2>

                    <p>
                        Add and manage the skills displayed on your portfolio.
                    </p>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* ADD / EDIT FORM */}

            <div className="cms-form-card">

                <div className="form-section">

                    <div className="form-section-title">
                        <h3>
                            {editingId ? "Edit Skill" : "Add New Skill"}
                        </h3>

                        <p>
                            Enter the skill information below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>Skill Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Java"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Category</label>

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="Programming"
                                />

                            </div>

                            <div className="form-group">

                                <label>Proficiency (%)</label>

                                <input
                                    type="number"
                                    name="proficiency"
                                    value={formData.proficiency}
                                    onChange={handleChange}
                                    placeholder="90"
                                    min="0"
                                    max="100"
                                />

                            </div>

                            <div className="form-group">

                                <label>Icon</label>

                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="java"
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
                                        ? "Update Skill"
                                        : "Add Skill"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* SKILLS LIST */}

            <div className="cms-list-card">

                <div className="cms-list-header">

                    <div>
                        <span className="card-label">
                            CONTENT
                        </span>

                        <h3>Your Skills</h3>
                    </div>

                    <span className="item-count">
                        {skills.length} skill
                        {skills.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {skills.length === 0 ? (

                    <div className="empty-state">
                        <div className="empty-icon">
                            ⚡
                        </div>

                        <h3>No skills yet</h3>

                        <p>
                            Add your first skill using the form above.
                        </p>
                    </div>

                ) : (

                    <div className="skills-list">

                        {skills.map((skill) => (

                            <div
                                className="skill-row"
                                key={skill.id}
                            >

                                <div className="skill-icon">
                                    {skill.icon || "⚡"}
                                </div>

                                <div className="skill-info">

                                    <strong>
                                        {skill.name}
                                    </strong>

                                    <span>
                                        {skill.category || "General"}
                                    </span>

                                </div>

                                <div className="skill-proficiency">

                                    <div className="skill-progress">

                                        <div
                                            className="skill-progress-fill"
                                            style={{
                                                width: `${skill.proficiency || 0}%`
                                            }}
                                        />

                                    </div>

                                    <span>
                                        {skill.proficiency || 0}%
                                    </span>

                                </div>

                                <div className="skill-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() => handleEdit(skill)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(skill.id)}
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

export default Skills;
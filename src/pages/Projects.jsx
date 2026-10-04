import { useEffect, useState } from "react";
import api from "../services/api";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        githubUrl: "",
        liveUrl: "",
        technologies: "",
        featured: false,
        displayOrder: 0
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error loading projects:", error);
            setMessage("Unable to load projects.");
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
            title: "",
            description: "",
            image: "",
            githubUrl: "",
            liveUrl: "",
            technologies: "",
            featured: false,
            displayOrder: 0
        });

        setEditingId(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        try {
            setUploading(true);
            setMessage("Uploading project image...");

            const uploadData = new FormData();
            uploadData.append("file", file);

            const response = await api.post(
                "/media/upload",
                uploadData
            );

            setFormData((previous) => ({
                ...previous,
                image: response.data.fileUrl
            }));

            setMessage("Project image uploaded successfully.");

        } catch (error) {
            console.error("Image upload failed:", error);
            setMessage("Project image upload failed.");
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
                title: formData.title,
                description: formData.description,
                image: formData.image,
                githubUrl: formData.githubUrl,
                liveUrl: formData.liveUrl,

                technologies: formData.technologies
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),

                featured: formData.featured,
                displayOrder:
                    Number(formData.displayOrder) || 0
            };

            if (editingId) {

                await api.put(
                    `/projects/${editingId}`,
                    data
                );

                setMessage(
                    "Project updated successfully."
                );

            } else {

                await api.post("/projects", data);

                setMessage(
                    "Project added successfully."
                );
            }

            resetForm();
            await loadProjects();

        } catch (error) {

            console.error("Error saving project:", error);
            setMessage("Unable to save project.");

        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project.id);

        setFormData({
            title: project.title || "",
            description: project.description || "",
            image: project.image || "",
            githubUrl: project.githubUrl || "",
            liveUrl: project.liveUrl || "",
            technologies: Array.isArray(project.technologies)
                ? project.technologies.join(", ")
                : "",
            featured: project.featured || false,
            displayOrder: project.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/projects/${id}`);

            setMessage(
                "Project deleted successfully."
            );

            await loadProjects();

        } catch (error) {

            console.error(
                "Error deleting project:",
                error
            );

            setMessage(
                "Unable to delete project."
            );
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading projects...
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

                    <h2>Projects</h2>

                    <p>
                        Manage the projects displayed on your portfolio.
                    </p>
                </div>

            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* PROJECT FORM */}

            <div className="cms-form-card">

                <div className="form-section">

                    <div className="form-section-title">

                        <h3>
                            {editingId
                                ? "Edit Project"
                                : "Add New Project"}
                        </h3>

                        <p>
                            Add the details of your project.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            {/* TITLE */}

                            <div className="form-group">

                                <label>
                                    Project Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Portfolio CMS"
                                    required
                                />

                            </div>

                            {/* DISPLAY ORDER */}

                            <div className="form-group">

                                <label>
                                    Display Order
                                </label>

                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={formData.displayOrder}
                                    onChange={handleChange}
                                    min="0"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your project..."
                                    rows="6"
                                    required
                                />

                            </div>

                            {/* IMAGE */}

                            <div className="form-group full-width">

                                <label>
                                    Project Image
                                </label>

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

                                {formData.image && (
                                    <div className="project-image-preview">

                                        <img
                                            src={formData.image}
                                            alt="Project preview"
                                        />

                                    </div>
                                )}

                            </div>

                            {/* GITHUB */}

                            <div className="form-group">

                                <label>
                                    GitHub URL
                                </label>

                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                />

                            </div>

                            {/* LIVE URL */}

                            <div className="form-group">

                                <label>
                                    Live Project URL
                                </label>

                                <input
                                    type="url"
                                    name="liveUrl"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />

                            </div>

                            {/* TECHNOLOGIES */}

                            <div className="form-group full-width">

                                <label>
                                    Technologies
                                </label>

                                <input
                                    type="text"
                                    name="technologies"
                                    value={formData.technologies}
                                    onChange={handleChange}
                                    placeholder="Java, Spring Boot, React, PostgreSQL"
                                />

                                <small className="field-help">
                                    Separate technologies with commas.
                                </small>

                            </div>

                            {/* FEATURED */}

                            <div className="form-group full-width">

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        Featured Project
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
                                disabled={saving || uploading}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Project"
                                        : "Add Project"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>


            {/* PROJECT LIST */}

            <div className="cms-list-card">

                <div className="cms-list-header">

                    <div>

                        <span className="card-label">
                            CONTENT
                        </span>

                        <h3>
                            Your Projects
                        </h3>

                    </div>

                    <span className="item-count">
                        {projects.length} project
                        {projects.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>


                {projects.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ◈
                        </div>

                        <h3>
                            No projects yet
                        </h3>

                        <p>
                            Add your first project using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="projects-list">

                        {projects.map((project) => (

                            <div
                                className="project-row"
                                key={project.id}
                            >

                                <div className="project-thumbnail">

                                    {project.image ? (

                                        <img
                                            src={project.image}
                                            alt={project.title}
                                        />

                                    ) : (

                                        <span>
                                            ◈
                                        </span>

                                    )}

                                </div>


                                <div className="project-info">

                                    <div className="project-title-row">

                                        <strong>
                                            {project.title}
                                        </strong>

                                        {project.featured && (
                                            <span className="featured-badge">
                                                Featured
                                            </span>
                                        )}

                                    </div>

                                    <p>
                                        {project.description ||
                                            "No description"}
                                    </p>

                                    <div className="technology-list">

                                        {Array.isArray(
                                            project.technologies
                                        ) &&
                                            project.technologies.map(
                                                (technology, index) => (
                                                    <span
                                                        key={index}
                                                    >
                                                        {technology}
                                                    </span>
                                                )
                                            )}

                                    </div>

                                </div>


                                <div className="project-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(project)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(project.id)
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

export default Projects;
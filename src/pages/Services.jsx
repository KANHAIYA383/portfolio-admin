import { useEffect, useState } from "react";
import api from "../services/api";

function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "",
        features: "",
        displayOrder: 0
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const response = await api.get("/services");
            setServices(response.data);
        } catch (error) {
            console.error("Error loading services:", error);
            setMessage("Unable to load services.");
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
            title: "",
            description: "",
            icon: "",
            features: "",
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
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
                features: formData.features
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item !== ""),
                displayOrder: Number(formData.displayOrder) || 0
            };

            if (editingId) {
                await api.put(`/services/${editingId}`, data);
                setMessage("Service updated successfully.");
            } else {
                await api.post("/services", data);
                setMessage("Service added successfully.");
            }

            resetForm();
            await loadServices();

        } catch (error) {
            console.error("Error saving service:", error);
            setMessage("Unable to save service.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (service) => {
        setEditingId(service.id);

        setFormData({
            title: service.title || "",
            description: service.description || "",
            icon: service.icon || "",
            features: Array.isArray(service.features)
                ? service.features.join(", ")
                : "",
            displayOrder: service.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/services/${id}`);

            setMessage("Service deleted successfully.");

            await loadServices();

        } catch (error) {
            console.error("Error deleting service:", error);
            setMessage("Unable to delete service.");
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading services...
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

                    <h2>Services</h2>

                    <p>
                        Manage the services displayed on your portfolio.
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
                                ? "Edit Service"
                                : "Add New Service"}
                        </h3>

                        <p>
                            Add a service and describe what you offer.
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Service Title</label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Web Development"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Icon</label>

                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="💻 or code icon"
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
                                    placeholder="Describe the service you provide..."
                                    rows="5"
                                    required
                                />

                            </div>

                            <div className="form-group full-width">

                                <label>Features</label>

                                <input
                                    type="text"
                                    name="features"
                                    value={formData.features}
                                    onChange={handleChange}
                                    placeholder="Responsive Design, REST APIs, Database Integration"
                                />

                                <small className="field-help">
                                    Separate features with commas.
                                </small>

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
                                        ? "Update Service"
                                        : "Add Service"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            {/* SERVICES LIST */}

            <div className="cms-list-card">

                <div className="cms-list-header">

                    <div>
                        <span className="card-label">
                            CONTENT
                        </span>

                        <h3>Your Services</h3>
                    </div>

                    <span className="item-count">
                        {services.length} service
                        {services.length !== 1 ? "s" : ""}
                    </span>

                </div>

                {services.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ✦
                        </div>

                        <h3>No services yet</h3>

                        <p>
                            Add your first service using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="services-list">

                        {services.map((service) => (

                            <div
                                className="service-row"
                                key={service.id}
                            >

                                <div className="service-icon">
                                    {service.icon || "✦"}
                                </div>

                                <div className="service-info">

                                    <div className="service-title-row">

                                        <strong>
                                            {service.title}
                                        </strong>

                                    </div>

                                    <p>
                                        {service.description ||
                                            "No description"}
                                    </p>

                                    {Array.isArray(service.features) &&
                                        service.features.length > 0 && (

                                            <div className="service-features">

                                                {service.features.map(
                                                    (feature, index) => (
                                                        <span key={index}>
                                                            {feature}
                                                        </span>
                                                    )
                                                )}

                                            </div>

                                        )}

                                </div>

                                <div className="service-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(service)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(service.id)
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

export default Services;
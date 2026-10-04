import { useEffect, useState } from "react";
import api from "../services/api";

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        published: false,
        publishedAt: "",
        displayOrder: 0
    });

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const response = await api.get("/blogs");
            setBlogs(response.data);
        } catch (error) {
            console.error("Error loading blogs:", error);
            setMessage("Unable to load blogs.");
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
            slug: "",
            excerpt: "",
            content: "",
            featuredImage: "",
            published: false,
            publishedAt: "",
            displayOrder: 0
        });

        setEditingId(null);
    };

    const createSlug = () => {
        const slug = formData.title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        setFormData((previous) => ({
            ...previous,
            slug
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        try {
            setUploading(true);
            setMessage("Uploading featured image...");

            const uploadData = new FormData();
            uploadData.append("file", file);

            const response = await api.post(
                "/media/upload",
                uploadData
            );

            setFormData((previous) => ({
                ...previous,
                featuredImage: response.data.fileUrl
            }));

            setMessage("Featured image uploaded successfully.");

        } catch (error) {
            console.error("Image upload failed:", error);
            setMessage("Featured image upload failed.");
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
                slug: formData.slug,
                excerpt: formData.excerpt,
                content: formData.content,
                featuredImage: formData.featuredImage,
                published: formData.published,
                publishedAt: formData.published
                    ? formData.publishedAt || null
                    : null,
                displayOrder: Number(formData.displayOrder) || 0
            };

            if (editingId) {
                await api.put(`/blogs/${editingId}`, data);
                setMessage("Blog updated successfully.");
            } else {
                await api.post("/blogs", data);
                setMessage("Blog added successfully.");
            }

            resetForm();
            await loadBlogs();

        } catch (error) {
            console.error("Error saving blog:", error);

            if (error.response?.status === 409) {
                setMessage("This slug already exists. Please use a different slug.");
            } else {
                setMessage("Unable to save blog.");
            }
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (blog) => {
        setEditingId(blog.id);

        setFormData({
            title: blog.title || "",
            slug: blog.slug || "",
            excerpt: blog.excerpt || "",
            content: blog.content || "",
            featuredImage: blog.featuredImage || "",
            published: blog.published || false,
            publishedAt: blog.publishedAt
                ? blog.publishedAt.slice(0, 16)
                : "",
            displayOrder: blog.displayOrder ?? 0
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this blog?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/blogs/${id}`);

            setMessage("Blog deleted successfully.");

            await loadBlogs();

        } catch (error) {
            console.error("Error deleting blog:", error);
            setMessage("Unable to delete blog.");
        }
    };

    if (loading) {
        return (
            <div className="page-loading">
                Loading blogs...
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

                    <h2>Blogs</h2>

                    <p>
                        Create and manage articles for your portfolio.
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
                                ? "Edit Blog"
                                : "Write New Blog"}
                        </h3>

                        <p>
                            Create an article and control its publishing status.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Blog Title</label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Getting Started with Spring Boot"
                                    required
                                />
                            </div>

                            <div className="form-group">

                                <label>Slug</label>

                                <div className="slug-input-row">

                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="getting-started-with-spring-boot"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="generate-slug-button"
                                        onClick={createSlug}
                                    >
                                        Generate
                                    </button>

                                </div>

                                <small className="field-help">
                                    Used in the blog URL.
                                </small>

                            </div>

                            <div className="form-group full-width">

                                <label>Excerpt</label>

                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="A short summary of the article..."
                                    rows="3"
                                />

                            </div>

                            <div className="form-group full-width">

                                <label>Featured Image</label>

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

                                {formData.featuredImage && (
                                    <div className="blog-image-preview">
                                        <img
                                            src={formData.featuredImage}
                                            alt="Blog preview"
                                        />
                                    </div>
                                )}

                            </div>

                            <div className="form-group full-width">

                                <label>Content</label>

                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your complete article here..."
                                    rows="12"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Published Date</label>

                                <input
                                    type="datetime-local"
                                    name="publishedAt"
                                    value={formData.publishedAt}
                                    onChange={handleChange}
                                    disabled={!formData.published}
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

                                <label className="checkbox-label">

                                    <input
                                        type="checkbox"
                                        name="published"
                                        checked={formData.published}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        Publish this blog
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
                                        ? "Update Blog"
                                        : "Publish Blog"}
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

                        <h3>Your Blogs</h3>
                    </div>

                    <span className="item-count">
                        {blogs.length} blog
                        {blogs.length !== 1 ? "s" : ""}
                    </span>

                </div>

                {blogs.length === 0 ? (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ✎
                        </div>

                        <h3>No blogs yet</h3>

                        <p>
                            Write your first blog using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="blogs-list">

                        {blogs.map((blog) => (

                            <div
                                className="blog-row"
                                key={blog.id}
                            >

                                <div className="blog-thumbnail">

                                    {blog.featuredImage ? (
                                        <img
                                            src={blog.featuredImage}
                                            alt={blog.title}
                                        />
                                    ) : (
                                        <span>✎</span>
                                    )}

                                </div>

                                <div className="blog-info">

                                    <div className="blog-title-row">

                                        <strong>
                                            {blog.title}
                                        </strong>

                                        <span
                                            className={
                                                blog.published
                                                    ? "published-badge"
                                                    : "draft-badge"
                                            }
                                        >
                                            {blog.published
                                                ? "Published"
                                                : "Draft"}
                                        </span>

                                    </div>

                                    <span className="blog-slug">
                                        /{blog.slug}
                                    </span>

                                    <p>
                                        {blog.excerpt ||
                                            "No excerpt available."}
                                    </p>

                                </div>

                                <div className="blog-actions">

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(blog)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(blog.id)
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

export default Blogs;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        services: 0,
        messages: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [
                projectsResponse,
                skillsResponse,
                servicesResponse,
                messagesResponse
            ] = await Promise.all([
                api.get("/projects"),
                api.get("/skills"),
                api.get("/services"),
                api.get("/messages")
            ]);

            setStats({
                projects: projectsResponse.data.length,
                skills: skillsResponse.data.length,
                services: servicesResponse.data.length,
                messages: messagesResponse.data.length
            });

        } catch (error) {
            console.error("Error loading dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">

            {/* WELCOME */}

            <section className="welcome-card">

                <div>
                    <span className="welcome-label">
                        WELCOME BACK 👋
                    </span>

                    <h2>
                        Manage your portfolio
                    </h2>

                    <p>
                        Keep your portfolio content updated,
                        organized and ready to showcase.
                    </p>
                </div>

                <div className="welcome-shape">
                    ✦
                </div>

            </section>

            {/* STATS */}

            <section className="stats-grid">

                <div className="stat-card">

                    <div className="stat-icon purple">
                        ◈
                    </div>

                    <div>
                        <span>Projects</span>

                        <strong>
                            {loading ? "..." : stats.projects}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon blue">
                        ⚡
                    </div>

                    <div>
                        <span>Skills</span>

                        <strong>
                            {loading ? "..." : stats.skills}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green">
                        ✦
                    </div>

                    <div>
                        <span>Services</span>

                        <strong>
                            {loading ? "..." : stats.services}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon orange">
                        ✉
                    </div>

                    <div>
                        <span>Messages</span>

                        <strong>
                            {loading ? "..." : stats.messages}
                        </strong>
                    </div>

                </div>

            </section>

            {/* CONTENT OVERVIEW */}

            <section className="dashboard-grid">

                <div className="dashboard-card">

                    <div className="card-header">

                        <div>
                            <span className="card-label">
                                PORTFOLIO
                            </span>

                            <h3>
                                Content Overview
                            </h3>
                        </div>

                        <span className="card-dots">
                            •••
                        </span>

                    </div>

                    <div className="overview-list">

                        <Link
                            to="/about"
                            className="overview-item"
                        >
                            <div className="overview-icon">
                                👤
                            </div>

                            <div>
                                <strong>About</strong>
                                <span>
                                    Personal information
                                </span>
                            </div>

                            <span className="status">
                                Manage
                            </span>
                        </Link>

                        <Link
                            to="/projects"
                            className="overview-item"
                        >
                            <div className="overview-icon">
                                ◈
                            </div>

                            <div>
                                <strong>Projects</strong>
                                <span>
                                    Your portfolio projects
                                </span>
                            </div>

                            <span className="status">
                                {stats.projects}
                            </span>
                        </Link>

                        <Link
                            to="/experience"
                            className="overview-item"
                        >
                            <div className="overview-icon">
                                💼
                            </div>

                            <div>
                                <strong>Experience</strong>
                                <span>
                                    Professional experience
                                </span>
                            </div>

                            <span className="status">
                                Manage
                            </span>
                        </Link>

                        <Link
                            to="/blogs"
                            className="overview-item"
                        >
                            <div className="overview-icon">
                                ✎
                            </div>

                            <div>
                                <strong>Blogs</strong>
                                <span>
                                    Articles and posts
                                </span>
                            </div>

                            <span className="status">
                                Manage
                            </span>
                        </Link>

                    </div>

                </div>

                {/* QUICK ACTIONS */}

                <div className="dashboard-card quick-card">

                    <div className="card-header">

                        <div>
                            <span className="card-label">
                                QUICK ACTIONS
                            </span>

                            <h3>
                                Manage Content
                            </h3>
                        </div>

                    </div>

                    <div className="quick-actions">

                        <Link
                            to="/projects"
                            className="quick-action-button"
                        >
                            <span>＋</span>
                            Add Project
                        </Link>

                        <Link
                            to="/skills"
                            className="quick-action-button"
                        >
                            <span>＋</span>
                            Add Skill
                        </Link>

                        <Link
                            to="/blogs"
                            className="quick-action-button"
                        >
                            <span>＋</span>
                            Write Blog
                        </Link>

                        <Link
                            to="/media"
                            className="quick-action-button"
                        >
                            <span>↑</span>
                            Upload Media
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Dashboard;
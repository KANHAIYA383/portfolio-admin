import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        window.location.href = "/";
    };
    return (
        <div className="admin-layout">

            {/* Sidebar */}
            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-logo">P</div>

                    <div>
                        <h2>Portfolio</h2>
                        <span>CMS Admin</span>
                    </div>
                </div>

                <div className="menu-title">
                    MAIN MENU
                </div>

                <nav className="sidebar-nav">

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">⌂</span>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">👤</span>
                        About
                    </NavLink>

                    <NavLink
                        to="/skills"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">⚡</span>
                        Skills
                    </NavLink>

                    <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">◈</span>
                        Projects
                    </NavLink>

                    <NavLink
                        to="/experience"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">💼</span>
                        Experience
                    </NavLink>

                    <NavLink
                        to="/blogs"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">✎</span>
                        Blogs
                    </NavLink>

                    <div className="menu-title second">
                        CONTENT
                    </div>

                    <NavLink
                        to="/testimonials"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">★</span>
                        Testimonials
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">✦</span>
                        Services
                    </NavLink>

                    <NavLink
                        to="/messages"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">✉</span>
                        Messages
                    </NavLink>

                    <NavLink
                        to="/media"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span className="nav-icon">▣</span>
                        Media
                    </NavLink>

                </nav>

                <div className="sidebar-bottom">

                    <div className="admin-profile">
                        <div className="avatar">
                            A
                        </div>

                        <div>
                            <strong>{admin.name || "Administrator"}</strong>
                            <span>{admin.role || "Admin"} Account</span>
                        </div>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        ⇥ Logout
                    </button>

                </div>

            </aside>

            {/* Main Area */}
            <section className="main-area">

                <header className="topbar">

                    <div>
                        <span className="topbar-label">
                            ADMIN PANEL
                        </span>

                        <h1>Portfolio Management</h1>
                    </div>

                    <div className="topbar-right">

                        <button className="notification-btn">
                            🔔
                            <span></span>
                        </button>

                        <div className="top-avatar">
                            {(admin.name || "A").charAt(0).toUpperCase()}
                        </div>

                    </div>

                </header>

                <main className="page-content">
                    <Outlet />
                </main>

            </section>

        </div>
    );
}

export default AdminLayout;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Blogs from "./pages/Blogs";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";

import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Messages from "./pages/Messages";
import Media from "./pages/Media";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Login */}
                <Route path="/" element={<Login />} />

                {/* Protected Admin Area */}
                <Route element={<ProtectedRoute />}>

                    <Route element={<AdminLayout />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/skills"
                            element={<Skills />}
                        />

                        <Route
                            path="/projects"
                            element={<Projects />}
                        />

                        <Route
                            path="/experience"
                            element={<Experience />}
                        />

                        <Route
                            path="/blogs"
                            element={<Blogs />}
                        />

                        <Route
                            path="/testimonials"
                            element={<Testimonials />}
                        />

                        <Route
                            path="/services"
                            element={<Services />}
                        />
                        <Route
                            path="/messages"
                            element={<Messages />}
                        />

                        <Route
                            path="/media"
                            element={<Media />}
                        />

                    </Route>

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;
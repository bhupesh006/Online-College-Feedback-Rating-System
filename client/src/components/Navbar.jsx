import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    return (
        <Navbar expand="lg" className="bg-dark-custom mb-4 shadow-sm py-3" variant="dark" style={{ backgroundColor: '#111F35' }}>
            <Container fluid className="px-4">
                <Navbar.Brand as={Link} to="/dashboard" className="fw-bold d-flex align-items-center text-white">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                        <span className="text-primary-custom fw-bold">S</span>
                    </div>
                    <span>Student Feedback Portal</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="student-navbar-nav" className="border-0" />
                <Navbar.Collapse id="student-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link
                            as={Link}
                            to="/dashboard"
                            className={`px-3 nav-link-custom ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={18} className="me-2" />
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/my-feedback"
                            className={`px-3 nav-link-custom ${location.pathname === '/my-feedback' ? 'active' : ''}`}
                        >
                            <MessageSquare size={18} className="me-2" />
                            My Feedback
                        </Nav.Link>

                        <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0 ps-lg-4 border-start-lg border-secondary">
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" id="dropdown-profile" className="text-light text-decoration-none d-flex align-items-center p-0 border-0">
                                    <div className="d-flex align-items-center text-white">
                                        <div className="bg-white-10 rounded-circle p-1 me-2" style={{ background: 'rgba(255,255,255,0.1)', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="fw-bold small">{user.name.charAt(0)}</span>
                                        </div>
                                        <span className="small fw-semibold">{user.name}</span>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="shadow border-0 mt-2">
                                    <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center py-2">
                                        <LogOut size={16} className="me-2" /> Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;

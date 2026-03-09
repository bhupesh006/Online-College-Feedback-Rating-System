import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, User, LogOut, TrendingUp } from 'lucide-react';

const AdminNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="bg-dark-custom mb-4 shadow-sm py-3" variant="dark">
            <Container fluid className="px-4">
                <Navbar.Brand className="fw-bold d-flex align-items-center text-white">
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                        <span className="text-primary-custom fw-bold">A</span>
                    </div>
                    <span>Admin Portal</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="admin-navbar-nav" className="border-0" />
                <Navbar.Collapse id="admin-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link
                            as={NavLink}
                            to="/dashboard"
                            className={`px-3 nav-link-custom ${location.pathname === '/dashboard' ? 'active' : ''}`}
                        >
                            <LayoutDashboard size={18} className="me-2" />
                            Dashboard
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/analytics"
                            className={`px-3 nav-link-custom ${location.pathname === '/analytics' ? 'active' : ''}`}
                        >
                            <TrendingUp size={18} className="me-2" />
                            Analytics
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            to="/reports"
                            className={`px-3 nav-link-custom ${location.pathname === '/reports' ? 'active' : ''}`}
                        >
                            <FileText size={18} className="me-2" />
                            Reports
                        </Nav.Link>

                        <div className="d-flex align-items-center ms-lg-4 mt-3 mt-lg-0 ps-lg-4 border-start-lg border-secondary">
                            <div className="d-flex align-items-center me-3 text-white">
                                <div className="bg-white-10 rounded-circle p-1 me-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <User size={18} />
                                </div>
                                <span className="small fw-semibold">Admin User</span>
                            </div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center border-0 text-white"
                                style={{ background: 'rgba(255,255,255,0.1)' }}
                                onClick={() => navigate('/login')}
                            >
                                <LogOut size={16} className="me-2" />
                                Logout
                            </Button>
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;

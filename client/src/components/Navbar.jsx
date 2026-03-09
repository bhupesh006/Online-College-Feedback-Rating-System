import React from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaCommentDots } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) return null;

    return (
        <Navbar expand="lg" variant="dark" style={{ backgroundColor: '#111F35' }}>
            <Container>
                <Navbar.Brand as={Link} to="/dashboard" className="fw-bold">
                    Student Feedback Portal
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link
                            as={Link}
                            to="/dashboard"
                            active={location.pathname === '/dashboard'}
                            className={`d-flex align-items-center me-3 px-3 py-2 rounded ${location.pathname === '/dashboard' ? 'bg-white bg-opacity-10' : ''}`}
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            <FaHome className="me-2 text-info" size={18} /> Dashboard
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/my-feedback"
                            active={location.pathname === '/my-feedback'}
                            className={`d-flex align-items-center me-3 px-3 py-2 rounded ${location.pathname === '/my-feedback' ? 'bg-white bg-opacity-10' : ''}`}
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            <FaCommentDots className="me-2 text-warning" size={18} /> My Feedback
                        </Nav.Link>

                        <Dropdown align="end" className="ms-3">
                            <Dropdown.Toggle variant="link" id="dropdown-profile" className="text-light text-decoration-none d-flex align-items-center p-0">
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8A244B',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '10px',
                                    color: 'white', fontWeight: 'bold'
                                }}>
                                    {user.name.charAt(0)}
                                </div>
                                {user.name}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={logout} className="text-danger">Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;

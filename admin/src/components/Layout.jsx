import React from 'react';
import AdminNavbar from './Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
    return (
        <div className="admin-layout" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            <AdminNavbar />
            <Container fluid className="px-4 pb-5">
                {children}
            </Container>
        </div>
    );
};

export default Layout;

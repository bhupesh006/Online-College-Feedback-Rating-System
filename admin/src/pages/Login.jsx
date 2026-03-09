import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth(); // Assume useAuth is exported from context
    // Wait, useAuth is not imported in original file. I need to adding import.
    // But I can't add import with this tool easily if I don't target top.
    // I'll replace the top part too.

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                // Check role if needed
                if (response.data.user.role !== 'admin') {
                    setError('Access Denied: Not an Admin');
                    return;
                }
                login(response.data);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={4}>
                    <Card className="card-custom">
                        <Card.Header className="bg-dark-custom text-white text-center py-4 border-0 rounded-top">
                            <div className="mb-3">
                                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                    <Lock size={30} className="text-primary-custom" />
                                </div>
                            </div>
                            <h3 className="h4 mb-0 fw-bold">Admin Feedback Portal</h3>
                            <div className="text-white-50 small mt-1">Authorized Personnel Only</div>
                        </Card.Header>
                        <Card.Body className="p-4 p-md-5">
                            <Form onSubmit={handleSubmit}>
                                {error && <Alert variant="danger" className="border-0 shadow-sm mb-4">{error}</Alert>}
                                <Form.Group className="mb-4" controlId="adminEmail">
                                    <Form.Label className="fw-semibold small text-uppercase text-muted">Admin Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="admin@college.edu"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="py-2 bg-light border-0"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-5" controlId="adminPassword">
                                    <Form.Label className="fw-semibold small text-uppercase text-muted">Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="py-2 bg-light border-0"
                                    />
                                </Form.Group>

                                <Button variant="primary-custom" type="submit" className="w-100 py-3 fw-bold text-uppercase rounded-3 shadow-sm">
                                    Access Portal
                                </Button>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center py-3 bg-white border-0">
                            <small className="text-muted">Online College Feedback & Rating System &copy; 2026</small>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;

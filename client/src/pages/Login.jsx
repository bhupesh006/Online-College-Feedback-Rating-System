import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token) {
                if (response.data.user.role !== 'student') {
                    setError('Access Denied: Only students can access this portal.');
                    setLoading(false);
                    return;
                }
                login(response.data);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid style={{ height: '100vh', backgroundColor: '#F0F2F5' }} className="d-flex align-items-center justify-content-center">
            <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '12px', border: 'none' }} className="shadow-lg p-4">
                <Card.Body>
                    <h2 className="text-center mb-4" style={{ color: '#111F35' }}>Student Feedback Portal</h2>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="student@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Form.Text className="text-muted">
                                Only college email IDs are allowed
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading} style={{ backgroundColor: '#F63049', borderColor: '#F63049' }}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" />
                            <span className="mx-2 text-muted small">OR</span>
                            <hr className="flex-grow-1" />
                        </div>

                        <Button variant="outline-dark" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => alert('Google Sign-In is currently a placeholder. Please use the demo credentials provided.')}>
                            <FaGoogle /> Sign in with Google
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { Container, Card, Badge, Button, Row, Col, Alert } from 'react-bootstrap';

const MyFeedback = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedback();
    }, [user]);

    const fetchFeedback = async () => {
        try {
            const response = await api.get('/feedback/my-feedback');
            setFeedbacks(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        try {
            await api.delete(`/feedback/${id}`);
            setFeedbacks(feedbacks.filter(f => f._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const isEditable = (dateStr) => {
        const submitted = new Date(dateStr);
        const now = new Date();
        const diffMins = (now - submitted) / 1000 / 60;
        return diffMins < 15;
    };

    const getProgressStatus = (status) => {
        if (status === 'Reviewed') return { text: 'Reviewed', color: 'success' };
        if (status === 'Under Progress') return { text: 'Under Progress', color: 'warning' };
        return { text: 'Submitted', color: 'info' };
    };

    if (loading) return <Container className="py-5 text-center"><div>Loading...</div></Container>;

    return (
        <Container className="py-5">
            <h2 className="mb-4" style={{ color: '#111F35' }}>My Feedback History</h2>

            {feedbacks.length === 0 ? (
                <Alert variant="info" className="text-center">No feedback submitted yet.</Alert>
            ) : (
                <Row xs={1} className="g-4">
                    {feedbacks.map((item) => (
                        <Col key={item._id}>
                            <Card className="shadow-sm border-0 border-start border-4" style={{ borderLeftColor: '#F63049 !important' }}>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                <Badge bg="light" text="dark" className="border">{item.category}</Badge>
                                                {(() => {
                                                    const status = getProgressStatus(item.status);
                                                    return <Badge bg={status.color}>{status.text}</Badge>;
                                                })()}
                                            </div>
                                            <h4 style={{ color: '#111F35' }}>{item.subCategory}</h4>
                                        </div>
                                        <small className="text-muted">
                                            {new Date(item.submittedAt).toLocaleDateString()} {new Date(item.submittedAt).toLocaleTimeString()}
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2 fw-medium">Overall:</span>
                                            <StarRating rating={item.overallRating} disabled={true} />
                                        </div>

                                        {item.questions && (
                                            <div className="bg-light p-3 rounded text-muted">
                                                {Object.entries(item.questions).map(([q, ans]) => (
                                                    <div key={q} className="mb-1">
                                                        <strong>{q}</strong>
                                                        <p className="mb-0 ms-2">{ans}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-end border-top pt-3">
                                        {isEditable(item.submittedAt) ? (
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" size="sm" onClick={() => navigate(`/feedback/edit/${item._id}`)}>Edit</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item._id)}>Delete</Button>
                                            </div>
                                        ) : (
                                            <small className="text-muted fst-italic">Edit window expired</small>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyFeedback;

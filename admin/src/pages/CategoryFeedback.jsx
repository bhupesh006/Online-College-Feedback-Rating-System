import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Row, Col, Card, Table, Badge, Button, Tab, Nav, ProgressBar, Modal, Form } from 'react-bootstrap';
import { ArrowLeft, User, Calendar, Star, Filter } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const CategoryFeedback = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setShowModal(true);
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedFeedback) return;
        try {
            await api.put(`/admin/feedback/${selectedFeedback._id}/status`, { status });
            setFeedbacks(feedbacks.map(f => f._id === selectedFeedback._id ? { ...f, status } : f));
            setSelectedFeedback({ ...selectedFeedback, status });
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        }
    };

    const categoryNames = {
        'academic': 'Academic',
        'hostel': 'Hostel',
        'food': 'Food',
        'transport': 'Transport',
        'sports': 'Sports',
        'library': 'Library',
        'laboratories': 'Laboratories',
        'placements': 'Placements',
        'infrastructure': 'Infrastructure',
        'culturals': 'Culturals',
        'administration': 'Administration',
        'cleanliness': 'Cleanliness',
        'clubs': 'Clubs'
    };

    // Map URL id to DB Category Name
    const dbCategoryName = categoryNames[id] || id.charAt(0).toUpperCase() + id.slice(1);
    const displayCategoryName = id === 'food' ? 'Food Quality' :
        id === 'transport' ? 'Transport Services' :
            id === 'academic' ? 'Academic Feedback' :
                dbCategoryName; // Add more custom display names if needed

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                // Fetching all for now and filtering client side. 
                // Creating a specific endpoint /admin/feedback?category=... would be better for scale.
                const response = await api.get('/admin/all-feedback');
                const all = response.data;
                const filtered = all.filter(f => f.category === dbCategoryName);
                setFeedbacks(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, [dbCategoryName]);

    const subCategoryRatings = [];
    if (feedbacks.length > 0) {
        const subCats = {};
        feedbacks.forEach(f => {
            if (!subCats[f.subCategory]) {
                subCats[f.subCategory] = { sum: 0, count: 0 };
            }
            subCats[f.subCategory].sum += f.overallRating;
            subCats[f.subCategory].count++;
        });

        Object.keys(subCats).forEach(sub => {
            subCategoryRatings.push({
                name: sub,
                rating: (subCats[sub].sum / subCats[sub].count).toFixed(1),
                count: subCats[sub].count
            });
        });
    }

    const getFilteredFeedback = () => {
        switch (activeTab) {
            case 'positive': return feedbacks.filter(f => f.overallRating >= 4);
            case 'neutral': return feedbacks.filter(f => f.overallRating === 3);
            case 'negative': return feedbacks.filter(f => f.overallRating < 3);
            default: return feedbacks;
        }
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'success';
        if (rating === 3) return 'warning';
        return 'danger';
    };

    return (
        <div className="fade-in">
            <div className="d-flex align-items-center mb-4">
                <Button variant="link" onClick={() => navigate('/dashboard')} className="text-dark p-0 me-3">
                    <ArrowLeft size={24} />
                </Button>
                <div>
                    <h2 className="h4 fw-bold mb-0 text-dark">{displayCategoryName}</h2>
                    <div className="small text-muted">Detailed analysis and student feedback</div>
                </div>
            </div>

            <Row className="mb-4">
                <Col lg={12}>
                    <Card className="card-custom border-0">
                        <Card.Header className="bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Sub-Category Performance</h6>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {subCategoryRatings.map((sub, idx) => (
                                    <Col md={4} key={idx} className="mb-3 mb-md-0">
                                        <div className="p-3 border rounded bg-light h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold text-dark">{sub.name}</span>
                                                <Badge bg="dark" className="rounded-pill">{sub.rating} ★</Badge>
                                            </div>
                                            <ProgressBar
                                                now={(sub.rating / 5) * 100}
                                                variant={getRatingColor(sub.rating)}
                                                style={{ height: '6px' }}
                                                className="mb-2"
                                            />
                                            <div className="small text-muted">{sub.count} feedbacks</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="card-custom border-0">
                <Card.Header className="bg-white border-0 pt-4 pb-0">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                        <h6 className="fw-bold mb-3 mb-md-0">Student Feedback</h6>
                        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                            <Nav variant="pills" className="bg-light p-1 rounded">
                                <Nav.Item>
                                    <Nav.Link eventKey="all" className="small fw-semibold px-3 py-1 rounded">All</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="positive" className="small fw-semibold px-3 py-1 rounded text-success">Positive</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="neutral" className="small fw-semibold px-3 py-1 rounded text-warning">Neutral</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="negative" className="small fw-semibold px-3 py-1 rounded text-danger">Negative</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Tab.Container>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="bg-light text-muted small">
                                <tr>
                                    <th className="border-0 ps-3">Student</th>
                                    <th className="border-0">Sub-Category</th>
                                    <th className="border-0">Status</th>
                                    <th className="border-0 text-center">Rating</th>
                                    <th className="border-0 text-end">Date</th>
                                    <th className="border-0 text-end pe-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredFeedback().map((item) => (
                                    <tr key={item._id}>
                                        <td className="ps-3">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle p-2 me-2 d-none d-md-block">
                                                    <User size={14} className="text-secondary" />
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark small">{item.studentName}</div>
                                                    <div className="text-muted smallest">{item.studentName ? item.studentName.substring(0, 3) : 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg="light" text="dark" className="border fw-normal">
                                                {item.subCategory}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={
                                                item.status === 'Reviewed' ? 'success' :
                                                item.status === 'Under Progress' ? 'warning' : 'info'
                                            } text={item.status === 'Under Progress' ? 'dark' : 'light'} className="fw-normal">
                                                {item.status || 'Submitted'}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <div className={`d-inline-flex align-items-center px-2 py-1 rounded-pill bg-${getRatingColor(item.overallRating).replace('text-', '')}-subtle text-${getRatingColor(item.overallRating)}`}>
                                                <span className={`fw-bold small text-${getRatingColor(item.overallRating)}`}>{item.overallRating}</span>
                                                <Star size={12} className={`ms-1 fill-current text-${getRatingColor(item.overallRating)}`} style={{ fill: 'currentColor' }} />
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex align-items-center justify-content-end text-muted small">
                                                <Calendar size={14} className="me-1" />
                                                {new Date(item.submittedAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-end pe-3">
                                            <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(item)}>
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {getFilteredFeedback().length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No feedback found for this category.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Feedback Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFeedback && (
                        <div>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Student:</strong> {selectedFeedback.studentName} ({selectedFeedback.studentEmail})<br/>
                                    <strong>Category:</strong> {selectedFeedback.category} - {selectedFeedback.subCategory}<br/>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <strong>Date:</strong> {new Date(selectedFeedback.submittedAt).toLocaleString()}<br/>
                                    <strong>Overall Rating:</strong> <Badge bg="primary">{selectedFeedback.overallRating} ★</Badge>
                                </Col>
                            </Row>
                            
                            <h6 className="fw-bold mt-4 border-bottom pb-2">Questions & Comments</h6>
                            {selectedFeedback.questions && Object.keys(selectedFeedback.questions).length > 0 ? (
                                <div className="bg-light p-3 rounded">
                                    {Object.entries(selectedFeedback.questions).map(([q, a], idx) => (
                                        <div key={idx} className="mb-3">
                                            <p className="fw-semibold mb-1 text-dark">{q}</p>
                                            <p className="text-muted mb-0">{a || <em>No response</em>}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No specific questions answered.</p>
                            )}

                            <h6 className="fw-bold mt-4 border-bottom pb-2">Detailed Ratings</h6>
                            {selectedFeedback.ratings && Object.keys(selectedFeedback.ratings).length > 0 ? (
                                <Row className="mt-2">
                                    {Object.entries(selectedFeedback.ratings).map(([criterion, rating], idx) => (
                                        <Col sm={6} md={4} key={idx} className="mb-2">
                                            <div className="d-flex justify-content-between align-items-center p-2 border rounded">
                                                <span className="small">{criterion}</span>
                                                <Badge bg="secondary">{rating} ★</Badge>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            ) : (
                                <p className="text-muted">No detailed ratings provided.</p>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                        <strong className="mb-0">Update Status:</strong>
                        <Form.Select 
                            size="sm" 
                            style={{width: 'auto'}} 
                            value={selectedFeedback?.status || 'Submitted'}
                            onChange={(e) => handleUpdateStatus(e.target.value)}
                        >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Progress">Under Progress</option>
                            <option value="Reviewed">Reviewed</option>
                        </Form.Select>
                    </div>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoryFeedback;

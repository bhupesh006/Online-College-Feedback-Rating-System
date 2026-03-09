import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Row, Col, Card, Form, Button, Table, Badge, ProgressBar } from 'react-bootstrap';
import { FileDown, Printer, FileText, CheckCircle, Filter, Download } from 'lucide-react';

const Reports = () => {
    const [generating, setGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [reportStats, setReportStats] = useState({
        totalFeedback: 0,
        averageRating: 0,
        satisfactionRate: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        detailedFeedback: []
    });
    const [filters, setFilters] = useState({
        category: 'All Categories',
        subCategory: 'All Sub-categories',
        month: 'All Months'
    });

    const categorySubMap = {
        'Academic': ['Faculty', 'Examination'],
        'Laboratories': ['IT Labs', 'Core Labs'],
        'Library': ['Book Resources', 'Digital Library', 'Reading Facilities'],
        'Placements': ['Placement Training', 'Recruiting Companies'],
        'Hostel': ['Water Facility', 'Power Supply', 'Room Maintenance', 'Bathroom Maintenance'],
        'Food': ['Food Quality', 'Hygiene & Cleanliness', 'Menu & Variety'],
        'Transport': ['Bus Timings', 'Safety & Maintenance', 'Route Management'],
        'Infrastructure': ['Classrooms', 'Wi-Fi & Internet', 'Campus Facilities'],
        'Sports': ['Sports & Gym'],
        'Culturals': ['Cultural Activities'],
        'Administration': ['Academic Office', 'Accounts & Fees', 'Student Support Services'],
        'Cleanliness': ['Campus Maintenance'],
        'Clubs': ['NCC', 'NSS', 'Technical & Cultural Clubs']
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get('/admin/all-feedback');
            setFeedbacks(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleGenerate = (e) => {
        e.preventDefault();
        setGenerating(true);

        setTimeout(() => {
            let filtered = feedbacks;

            if (filters.category !== 'All Categories') {
                filtered = filtered.filter(f => f.category === filters.category);
            }
            if (filters.subCategory !== 'All Sub-categories') {
                filtered = filtered.filter(f => f.subCategory === filters.subCategory);
            }
            if (filters.month !== 'All Months') {
                // Assuming submittedAt is ISO date string
                // Logic to filter by month name
                filtered = filtered.filter(f => {
                    const date = new Date(f.submittedAt);
                    const monthName = date.toLocaleString('default', { month: 'long' });
                    return monthName === filters.month;
                });
            }

            setFilteredFeedbacks(filtered);
            calculateStats(filtered);
            setGenerating(false);
            setReportReady(true);
        }, 1000);
    };

    const calculateStats = (data) => {
        if (data.length === 0) {
            setReportStats({
                totalFeedback: 0,
                averageRating: 0,
                satisfactionRate: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                detailedFeedback: []
            });
            return;
        }

        const total = data.length;
        const sumRating = data.reduce((sum, f) => sum + f.overallRating, 0);
        const avg = (sumRating / total).toFixed(1);

        const positiveCount = data.filter(f => f.overallRating >= 4).length;
        const satisfaction = ((positiveCount / total) * 100).toFixed(0);

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        data.forEach(f => {
            const r = Math.round(f.overallRating);
            if (distribution[r] !== undefined) distribution[r]++;
        });

        setReportStats({
            totalFeedback: total,
            averageRating: avg,
            satisfactionRate: satisfaction,
            ratingDistribution: distribution,
            detailedFeedback: data
        });
    };

    const reportData = reportStats; // Use computed stats

    return (
        <div className="fade-in">
            <h2 className="h4 fw-bold mb-4 text-dark">Report Generation</h2>

            <Row className="g-4">
                {/* Configuration */}
                <Col lg={4}>
                    <Card className="card-custom border-0 h-100">
                        <Card.Header className="bg-white py-3 border-0">
                            <h6 className="mb-0 fw-bold">Report Configuration</h6>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleGenerate}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">Category</Form.Label>
                                    <Form.Select
                                        className="bg-light border-0"
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                    >
                                        <option>All Categories</option>
                                        <option>Academic</option>
                                        <option>Hostel</option>
                                        <option>Food</option>
                                        <option>Transport</option>
                                        <option>Sports</option>
                                        <option>Library</option>
                                        <option>Laboratories</option>
                                        <option>Placements</option>
                                        <option>Infrastructure</option>
                                        <option>Culturals</option>
                                        <option>Administration</option>
                                        <option>Cleanliness</option>
                                        <option>Clubs</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">Sub-category</Form.Label>
                                    <Form.Select
                                        className="bg-light border-0"
                                        value={filters.subCategory}
                                        onChange={(e) => setFilters({ ...filters, subCategory: e.target.value })}
                                        disabled={filters.category === 'All Categories'}
                                    >
                                        <option>All Sub-categories</option>
                                        {filters.category !== 'All Categories' && categorySubMap[filters.category]?.map((sub, idx) => (
                                            <option key={idx} value={sub}>{sub}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-muted">Month</Form.Label>
                                    <Form.Select
                                        className="bg-light border-0"
                                        value={filters.month}
                                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                                    >
                                        <option>All Months</option>
                                        <option>January</option>
                                        <option>February</option>
                                        <option>March</option>
                                        <option>April</option>
                                        <option>May</option>
                                        <option>June</option>
                                        <option>July</option>
                                        <option>August</option>
                                        <option>September</option>
                                        <option>October</option>
                                        <option>November</option>
                                        <option>December</option>
                                    </Form.Select>
                                </Form.Group>

                                <Button
                                    variant="primary-custom"
                                    type="submit"
                                    className="w-100 py-3 fw-bold rounded-3 shadow-sm"
                                    disabled={generating}
                                >
                                    {generating ? 'Generating...' : 'Generate Report'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Report Preview */}
                <Col lg={8}>
                    {reportReady ? (
                        <div className="animation-fade-in">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold mb-0 text-dark">Report Preview</h5>
                                <div className="d-flex gap-2">
                                    <Button variant="outline-danger" size="sm" className="d-flex align-items-center">
                                        <FileText size={16} className="me-1" /> PDF
                                    </Button>
                                    <Button variant="outline-success" size="sm" className="d-flex align-items-center">
                                        <FileDown size={16} className="me-1" /> Excel
                                    </Button>
                                    <Button variant="outline-dark" size="sm" className="d-flex align-items-center" onClick={() => window.print()}>
                                        <Printer size={16} className="me-1" /> Print
                                    </Button>
                                </div>
                            </div>

                            <Card className="card-custom border-0 mb-4">
                                <Card.Body className="p-4">
                                    <Row className="text-center">
                                        <Col md={4} className="border-end">
                                            <small className="text-muted text-uppercase fw-bold d-block mb-1">Total Feedbacks</small>
                                            <h3 className="fw-bold mb-0 text-dark">{reportData.totalFeedback}</h3>
                                        </Col>
                                        <Col md={4} className="border-end">
                                            <small className="text-muted text-uppercase fw-bold d-block mb-1">Average Rating</small>
                                            <h3 className="fw-bold mb-0 text-primary-custom">{reportData.averageRating} / 5</h3>
                                        </Col>
                                        <Col md={4}>
                                            <small className="text-muted text-uppercase fw-bold d-block mb-1">Satisfaction Rate</small>
                                            <h3 className="fw-bold mb-0 text-success">{reportData.satisfactionRate}%</h3>
                                            <small className="text-success fw-bold">Positive</small>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Row className="g-4 mb-4">
                                {/* Distribution */}
                                <Col lg={12}>
                                    <Card className="card-custom border-0 h-100">
                                        <Card.Header className="bg-white border-0 py-3">
                                            <h6 className="fw-bold mb-0">Star Rating Distribution</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                {[5, 4, 3, 2, 1].map(star => (
                                                    <Col xs={12} key={star} className="mb-2">
                                                        <div className="d-flex align-items-center">
                                                            <div className="d-flex align-items-center me-3" style={{ width: '60px' }}>
                                                                <span className="fw-bold me-1">{star}</span> <span className="text-warning">★</span>
                                                            </div>
                                                            <ProgressBar
                                                                now={(reportData.ratingDistribution[star] / reportData.totalFeedback) * 100}
                                                                className="flex-grow-1 me-3"
                                                                style={{ height: '8px' }}
                                                                variant={star >= 4 ? 'success' : star === 3 ? 'warning' : 'danger'}
                                                            />
                                                            <span className="text-muted small fw-bold" style={{ width: '40px' }}>{reportData.ratingDistribution[star]}</span>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Detailed Table */}
                            <Card className="card-custom border-0">
                                <Card.Header className="bg-white border-0 py-3">
                                    <h6 className="fw-bold mb-0">Detailed Feedback</h6>
                                </Card.Header>
                                <Card.Body className="p-0">
                                    <div className="table-responsive">
                                        <Table hover className="mb-0 align-middle">
                                            <thead className="bg-light text-muted small">
                                                <tr>
                                                    <th className="ps-4 border-0">Student ID</th>
                                                    <th className="border-0">Name</th>
                                                    <th className="border-0" style={{ width: '40%' }}>Feedback Content</th>
                                                    <th className="border-0 text-center">Rating</th>
                                                    <th className="border-0 text-end pe-4">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.detailedFeedback.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="ps-4 fw-bold text-muted small">{item.studentName ? item.studentName.substring(0, 3) + '...' : 'N/A'}</td>
                                                        {/* Using studentName substring as ID proxy or just 'N/A' as we didn't store ID explicitly in accessible way easily unless we populate */}
                                                        <td className="fw-semibold text-dark">{item.studentName}</td>
                                                        <td className="text-secondary small">{item.subCategory}</td>
                                                        <td className="text-center">
                                                            <Badge bg={item.overallRating >= 4 ? 'success' : item.overallRating === 3 ? 'warning' : 'danger'} pill>
                                                                {item.overallRating} ★
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end pe-4 text-muted small">{new Date(item.submittedAt).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-white border-0 py-3 text-center">
                                    <Button variant="link" className="text-primary-custom fw-bold small text-decoration-none">View All Entries</Button>
                                </Card.Footer>
                            </Card>
                        </div>
                    ) : (
                        <Card className="card-custom border-0 h-100 d-flex align-items-center justify-content-center text-center p-5 bg-white">
                            <div className="py-5">
                                <div className="bg-light rounded-circle p-4 mb-3 d-inline-block">
                                    <FileText size={40} className="text-secondary" />
                                </div>
                                <h5 className="fw-bold text-dark">Ready to Generate</h5>
                                <p className="text-muted small px-5">Select filters from the configuration panel and click 'Generate Report' to view detailed analysis.</p>
                            </div>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default Reports;

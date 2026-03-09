import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import {
    MessageSquare, Eye, TrendingUp, TrendingDown,
    BookOpen, Beaker, Library, Briefcase,
    Home, Coffee, Bus, Building,
    Zap, Music, Users, Trash2, Smile
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-5 text-center">Loading Dashboard...</div>;
    if (!stats) return <div className="p-5 text-center text-danger">Failed to load stats.</div>;

    // 1. Graph Data
    const chartLabels = stats.categoryStats.map(item => item._id);
    const chartValues = stats.categoryStats.map(item => item.count);

    const chartData = {
        labels: chartLabels.length > 0 ? chartLabels : ['No Data'],
        datasets: [
            {
                label: 'Feedbacks Received',
                data: chartValues.length > 0 ? chartValues : [0],
                backgroundColor: '#F63049',
                borderRadius: 4,
                barThickness: 30,
            },
        ],
    };

    // 2. Chart Options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Feedback by Category',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    // 2. Summary Cards Data
    const summaryStats = {
        received: stats.totalFeedback,
        pending: stats.pendingActions
    };

    // 3. Top & Low Rated
    const ratingsHighLow = {
        top: stats.topRated,
        low: stats.lowRated
    };

    // 4. Grouped Categories
    const categoryGroups = [
        {
            title: 'Academics & Learning',
            icon: <BookOpen size={20} />,
            items: [
                { id: 'academic', name: 'Academic', icon: <BookOpen size={18} /> },
                { id: 'laboratories', name: 'Laboratories', icon: <Beaker size={18} /> },
                { id: 'library', name: 'Library', icon: <Library size={18} /> },
                { id: 'placements', name: 'Placements', icon: <Briefcase size={18} /> }
            ]
        },
        {
            title: 'Facilities',
            icon: <Home size={20} />,
            items: [
                { id: 'hostel', name: 'Hostel', icon: <Home size={18} /> },
                { id: 'food', name: 'Food', icon: <Coffee size={18} /> },
                { id: 'transport', name: 'Transport', icon: <Bus size={18} /> },
                { id: 'infrastructure', name: 'Infrastructure', icon: <Building size={18} /> }
            ]
        },
        {
            title: 'Activities & Support',
            icon: <Zap size={20} />,
            items: [
                { id: 'sports', name: 'Sports', icon: <Zap size={18} /> },
                { id: 'culturals', name: 'Culturals', icon: <Music size={18} /> },
                { id: 'administration', name: 'Administration', icon: <Users size={18} /> },
                { id: 'cleanliness', name: 'Cleanliness', icon: <Trash2 size={18} /> },
                { id: 'clubs', name: 'Clubs', icon: <Smile size={18} /> }
            ]
        }
    ];

    return (
        <div className="dashboard-container fade-in">
            <h2 className="h4 fw-bold mb-4 text-dark">Dashboard Overview</h2>

            {/* Row 1: Summary Cards & Top/Low Rated */}
            <Row className="g-4 mb-4">
                {/* Monthly Summary Cards */}
                <Col md={6} lg={3}>
                    <Card className="card-custom h-100 border-0">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="text-muted small fw-bold text-uppercase">Total Received <br />(This Month)</div>
                                <div className="bg-light p-2 rounded-circle text-primary-custom">
                                    <MessageSquare size={20} />
                                </div>
                            </div>
                            <h3 className="display-6 fw-bold mb-0 text-dark">{summaryStats.received}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={3}>
                    <Card className="card-custom h-100 border-0">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="text-muted small fw-bold text-uppercase">Action Required <br />(Pending)</div>
                                <div className="bg-light p-2 rounded-circle text-danger">
                                    <MessageSquare size={20} />
                                </div>
                            </div>
                            <h3 className="display-6 fw-bold mb-0 text-danger">{summaryStats.pending}</h3>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Top & Low Sub-Category Card */}
                <Col lg={6}>
                    <Card className="card-custom h-100 border-0">
                        <Card.Header className="bg-white border-0 py-3">
                            <h6 className="fw-bold mb-0">Performance Highlights</h6>
                        </Card.Header>
                        <Card.Body className="pt-0">
                            <Row className="h-100">
                                <Col xs={6} className="border-end">
                                    <div className="d-flex flex-column h-100 justify-content-center">
                                        <div className="d-flex align-items-center mb-2">
                                            <TrendingUp size={18} className="text-success me-2" />
                                            <span className="text-muted small fw-bold text-uppercase">Top Rated</span>
                                        </div>
                                        <h5 className="fw-bold mb-1">{ratingsHighLow.top.name}</h5>
                                        <div className="small text-muted mb-2">{ratingsHighLow.top.category}</div>
                                        <div>
                                            <Badge bg="success" className="rounded-pill px-3 py-2">
                                                {ratingsHighLow.top.rating} / 5.0
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="d-flex flex-column h-100 justify-content-center ps-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <TrendingDown size={18} className="text-danger me-2" />
                                            <span className="text-muted small fw-bold text-uppercase">Lowest Rated</span>
                                        </div>
                                        <h5 className="fw-bold mb-1">{ratingsHighLow.low.name}</h5>
                                        <div className="small text-muted mb-2">{ratingsHighLow.low.category}</div>
                                        <div>
                                            <Badge bg="danger" className="rounded-pill px-3 py-2">
                                                {ratingsHighLow.low.rating} / 5.0
                                            </Badge>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Graph */}
            <Row className="mb-5">
                <Col xs={12}>
                    <Card className="card-custom border-0">
                        <Card.Header className="bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Feedback Volume by Category</h6>
                            <div className="small text-muted">Last 30 Days</div>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '350px' }}>
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Row 3: Grouped Category Cards */}
            <h5 className="fw-bold mb-3 text-dark">Browse Categories</h5>
            <Row className="g-4">
                {categoryGroups.map((group, idx) => (
                    <Col lg={4} key={idx}>
                        <Card className="card-custom border-0 h-100">
                            <Card.Header className="bg-white border-0 py-3 d-flex align-items-center">
                                <span className="text-primary-custom me-2">{group.icon}</span>
                                <h6 className="fw-bold mb-0">{group.title}</h6>
                            </Card.Header>
                            <Card.Body className="pt-0">
                                <div className="d-flex flex-wrap gap-2">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="d-flex align-items-center p-2 rounded border bg-light w-100 category-item-hover"
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => navigate(`/category/${item.id}`)}
                                        >
                                            <div className="p-2 bg-white rounded-circle shadow-sm me-3 text-secondary">
                                                {item.icon}
                                            </div>
                                            <span className="fw-semibold text-dark">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Dashboard;

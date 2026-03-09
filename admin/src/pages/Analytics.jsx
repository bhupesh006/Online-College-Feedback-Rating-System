import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/admin/analytics');
                setData(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-5 text-center">Loading Analytics...</div>;
    if (!data) return <div className="p-5 text-center text-danger">Failed to load analytics.</div>;

    // 1. Month-wise Average Rating Trend
    const ratingTrendData = {
        labels: data.ratingTrend.labels,
        datasets: [
            {
                label: 'Overall Average Rating',
                data: data.ratingTrend.data,
                fill: true,
                borderColor: '#F63049',
                backgroundColor: 'rgba(246, 48, 73, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#F63049',
                pointBorderColor: '#fff',
                pointRadius: 6,
            },
        ],
    };

    // 2. Month-wise Feedback Count
    const countTrendData = {
        labels: data.countTrend.labels,
        datasets: [
            {
                label: 'Total Feedbacks',
                data: data.countTrend.data,
                backgroundColor: '#111F35',
                borderRadius: 4,
                barThickness: 40,
            },
        ],
    };

    const countOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111F35',
                padding: 12
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <div className="fade-in">
            <h2 className="h4 fw-bold mb-4 text-dark">Analytics & Trends</h2>

            {/* Row 1: Trends */}
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <Card className="card-custom border-0 h-100">
                        <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fw-bold">Month-wise Average Rating</h6>
                            <Badge bg="success" className="rounded-pill"><TrendingUp size={12} className="me-1" /> +5% vs last month</Badge>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '300px' }}>
                                <Line
                                    data={ratingTrendData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { min: 2, max: 5, grid: { color: 'rgba(0,0,0,0.05)' } },
                                            x: { grid: { display: false } }
                                        }
                                    }}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="card-custom border-0 h-100 bg-white">
                        <Card.Header className="bg-white py-3 border-0">
                            <h6 className="mb-0 fw-bold">Sentiment Overview</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-semibold text-muted">Positive (4-5 Star)</span>
                                    <span className="small fw-bold text-success">{data.sentiment.positive}%</span>
                                </div>
                                <ProgressBar variant="success" now={data.sentiment.positive} className="mb-3" style={{ height: '6px' }} />

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-semibold text-muted">Neutral (3 Star)</span>
                                    <span className="small fw-bold text-warning">{data.sentiment.neutral}%</span>
                                </div>
                                <ProgressBar variant="warning" now={data.sentiment.neutral} className="mb-3" style={{ height: '6px' }} />

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-semibold text-muted">Negative (&lt;3 Star)</span>
                                    <span className="small fw-bold text-danger">{data.sentiment.negative}%</span>
                                </div>
                                <ProgressBar variant="danger" now={data.sentiment.negative} style={{ height: '6px' }} />
                            </div>

                            <hr className="text-muted opacity-25" />

                            <div className="mt-4">
                                <h6 className="fw-bold fs-6 mb-3">Quick Insights</h6>
                                <div className="d-flex align-items-start mb-3">
                                    <TrendingUp size={18} className="text-success me-2 mt-1" />
                                    <div>
                                        <div className="fw-bold small">Faculty Performance</div>
                                        <div className="text-muted smallest">Consistently high ratings in teaching quality across all depts.</div>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <TrendingDown size={18} className="text-danger me-2 mt-1" />
                                    <div>
                                        <div className="fw-bold small">Hostel Facilities</div>
                                        <div className="text-muted smallest">Recurring complaints about water supply in Block C.</div>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Volume */}
            <Row className="g-4">
                <Col lg={12}>
                    <Card className="card-custom border-0 shadow-sm">
                        <Card.Header className="bg-white py-3 border-0">
                            <h6 className="mb-0 fw-bold">Month-wise Feedback Count</h6>
                        </Card.Header>
                        <Card.Body>
                            <div style={{ height: '350px' }}>
                                <Bar
                                    data={countTrendData}
                                    options={countOptions}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Analytics;

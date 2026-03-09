import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const FEEDBACK_DATA = {
    'Academic': {
        subCategories: {
            'Faculty': {
                ratings: ['Concept Clarity', 'Punctuality', 'Doubt Clarification'],
                questions: [
                    'Are concepts explained clearly with relevant examples?',
                    'Does the faculty maintain punctuality and complete the syllabus on time?',
                    'Are student doubts clarified effectively during or after class?',
                    'Any other suggestions ?'
                ]
            },
            'Examination': {
                ratings: ['Syllabus Alignment', 'Fair Evaluation', 'Result Timeline'],
                questions: [
                    'Are examination questions aligned with the syllabus?',
                    'Is the evaluation process fair and unbiased?',
                    'Are results published within the expected timeline?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Laboratories': {
        subCategories: {
            'IT Labs': {
                ratings: ['System Functionality', 'Internet Stability', 'Skill Improvement'],
                questions: [
                    'Are computers and required software functioning properly?',
                    'Is internet connectivity stable during lab sessions?',
                    'Are lab exercises helpful in improving technical skills?',
                    'Any other suggestions ?'
                ]
            },
            'Core Labs': {
                ratings: ['Equipment Sufficiency', 'Safety Adherence', 'Conceptual Understanding'],
                questions: [
                    'Is laboratory equipment sufficient for all students?',
                    'Are safety guidelines properly followed during experiments?',
                    'Do practical sessions enhance conceptual understanding?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Library': {
        subCategories: {
            'Book Resources': {
                ratings: ['Textbook Availability', 'Reference Relevance', 'New Additions'],
                questions: [
                    'Are prescribed textbooks available in adequate quantity?',
                    'Are reference books updated and relevant?',
                    'Are new books added regularly based on academic needs?',
                    'Any other suggestions ?'
                ]
            },
            'Digital Library': {
                ratings: ['E-Access Convenience', 'Portal Usability', 'Issue Resolution'],
                questions: [
                    'Is access to e-books and online journals convenient?',
                    'Is the digital portal user-friendly and reliable?',
                    'Are login or access issues resolved promptly?',
                    'Any other suggestions ?'
                ]
            },
            'Reading Facilities': {
                ratings: ['Quiet Environment', 'Seating Adequacy', 'Lighting & Ventilation'],
                questions: [
                    'Is the reading environment quiet and comfortable?',
                    'Are seating arrangements sufficient during peak hours?',
                    'Is lighting and ventilation adequate?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Placements': {
        subCategories: {
            'Placement Training': {
                ratings: ['Training Relevance', 'Mock Interviews', 'Confidence Building'],
                questions: [
                    'Are training sessions relevant to industry requirements?',
                    'Are mock interviews and aptitude sessions conducted effectively?',
                    'Does the training improve confidence for job interviews?',
                    'Any other suggestions ?'
                ]
            },
            'Recruiting Companies': {
                ratings: ['Company Reputation', 'Role Alignment', 'Process Coordination'],
                questions: [
                    'Are reputed companies visiting the campus regularly?',
                    'Are job roles aligned with your academic specialization?',
                    'Is the placement process coordinated smoothly?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Hostel': {
        subCategories: {
            'Water Facility': {
                ratings: ['Supply Reliability', 'Water Quality', 'Complaint Redressal'],
                questions: [
                    'Is water supply available without major interruptions?',
                    'Is the water quality satisfactory for daily use?',
                    'Are water-related complaints addressed quickly?',
                    'Any other suggestions ?'
                ]
            },
            'Power Supply': {
                ratings: ['Supply Stability', 'Backup Availability', 'Issue Resolution'],
                questions: [
                    'Is electricity supply stable throughout the day?',
                    'Is backup power available during outages?',
                    'Are electrical issues resolved without delay?',
                    'Any other suggestions ?'
                ]
            },
            'Room Maintenance': {
                ratings: ['Cleaning Regularity', 'Request Handling', 'Infrastructure Condition'],
                questions: [
                    'Are rooms cleaned and maintained regularly?',
                    'Are maintenance requests handled within a reasonable time?',
                    'Is the room infrastructure in good condition?',
                    'Any other suggestions ?'
                ]
            },
            'Bathroom Maintenance': {
                ratings: ['Cleaning Schedule', 'Hygiene Standards', 'Plumbing Resolution'],
                questions: [
                    'Are washrooms cleaned regularly as per schedule?',
                    'Is hygiene maintained consistently in common areas?',
                    'Are plumbing issues resolved promptly?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Food': {
        subCategories: {
            'Food Quality': {
                ratings: ['Consistency', 'Freshness', 'Taste Satisfaction'],
                questions: [
                    'Is the quality of food consistent throughout the week?',
                    'Is food prepared using fresh ingredients?',
                    'Is the taste satisfactory across different meals?',
                    'Any other suggestions ?'
                ]
            },
            'Hygiene & Cleanliness': {
                ratings: ['Dining Area Hygiene', 'Staff Hygiene', 'Utensil Cleanliness'],
                questions: [
                    'Is the dining area maintained hygienically?',
                    'Do staff follow proper hygiene practices?',
                    'Are utensils cleaned properly before serving?',
                    'Any other suggestions ?'
                ]
            },
            'Menu & Variety': {
                ratings: ['Menu Variety', 'Healthy Options', 'Suggestion Consideration'],
                questions: [
                    'Is there sufficient variety in the weekly menu?',
                    'Are healthy food options included regularly?',
                    'Are student suggestions considered in menu planning?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Transport': {
        subCategories: {
            'Bus Timings': {
                ratings: ['Schedule Adherence', 'Communication', 'Timing Convenience'],
                questions: [
                    'Are buses operating according to the announced schedule?',
                    'Are delays communicated properly to students?',
                    'Are pickup and drop timings convenient?',
                    'Any other suggestions ?'
                ]
            },
            'Safety & Maintenance': {
                ratings: ['Bus Condition', 'Safety Measures', 'Seating Comfort'],
                questions: [
                    'Are buses maintained in good mechanical condition?',
                    'Are safety measures followed during transportation?',
                    'Is seating comfortable and sufficient?',
                    'Any other suggestions ?'
                ]
            },
            'Route Management': {
                ratings: ['Route Coverage', 'Change Communication', 'Event Coordination'],
                questions: [
                    'Are routes covering most student residential areas?',
                    'Are route changes communicated clearly?',
                    'Is coordination effective during special events or exams?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Infrastructure': {
        subCategories: {
            'Classrooms': {
                ratings: ['Ventilation & Space', 'Equipment Func.', 'Seating Comfort'],
                questions: [
                    'Are classrooms spacious and well ventilated?',
                    'Are projectors and boards functioning properly?',
                    'Is seating comfortable for long sessions?',
                    'Any other suggestions ?'
                ]
            },
            'Wi-Fi & Internet': {
                ratings: ['Internet Speed', 'Coverage', 'Issue Resolution'],
                questions: [
                    'Is internet speed adequate for academic use?',
                    'Is Wi-Fi accessible across the entire campus?',
                    'Are connectivity issues resolved promptly?',
                    'Any other suggestions ?'
                ]
            },
            'Campus Facilities': {
                ratings: ['Water Availability', 'Cleanliness', 'Lighting'],
                questions: [
                    'Are drinking water facilities available across campus?',
                    'Are common areas clean and well maintained?',
                    'Is campus lighting sufficient during evenings?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Administration': {
        subCategories: {
            'Academic Office': {
                ratings: ['Query Handling', 'Clear Communication', 'Processing Speed'],
                questions: [
                    'Are academic queries handled efficiently?',
                    'Are notices and updates communicated clearly?',
                    'Is documentation processed without unnecessary delay?',
                    'Any other suggestions ?'
                ]
            },
            'Accounts & Fees': {
                ratings: ['Process Transparency', 'Query Resolution', 'Reliability'],
                questions: [
                    'Is the fee payment process smooth and transparent?',
                    'Are payment-related queries resolved promptly?',
                    'Is the online payment system reliable?',
                    'Any other suggestions ?'
                ]
            },
            'Student Support Services': {
                ratings: ['Grievance Redressal', 'Staff Behavior', 'Follow-up'],
                questions: [
                    'Are grievances addressed within a reasonable time?',
                    'Is staff behavior professional and respectful?',
                    'Are student concerns properly recorded and followed up?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Sports': {
        subCategories: {
            'Sports & Gym': {
                ratings: ['Equipment Quality', 'Coaching Availability', 'Maintenance'],
                questions: [
                    'Is the sports equipment in good condition and adequate?',
                    'Are coaches or trainers available and helpful?',
                    'Are the sports fields and gym well maintained?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Culturals': {
        subCategories: {
            'Cultural Activities': {
                ratings: ['Event Frequency', 'Inclusivity', 'Facility Support'],
                questions: [
                    'Are cultural events organized frequently?',
                    'Are activities inclusive of diverse interests and talents?',
                    'Are adequate facilities provided for practice and events?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Cleanliness': {
        subCategories: {
            'Campus Maintenance': {
                ratings: ['General Cleanliness', 'Waste Disposal', 'Restroom Hygiene'],
                questions: [
                    'Is the overall campus kept clean and litter-free?',
                    'Are waste disposal bins available and cleared regularly?',
                    'Are the common restrooms hygienic and well-stocked?',
                    'Any other suggestions ?'
                ]
            }
        }
    },
    'Clubs': {
        subCategories: {
            'NCC': {
                ratings: ['Training Regularity', 'Discipline & Leadership', 'Event Effectiveness'],
                questions: [
                    'Are NCC training sessions conducted regularly?',
                    'Do activities promote discipline and leadership skills?',
                    'Are events organized effectively?',
                    'Any other suggestions ?'
                ]
            },
            'NSS': {
                ratings: ['Activity Consistency', 'Social Responsibility', 'Coordination'],
                questions: [
                    'Are community service activities conducted consistently?',
                    'Do NSS programs encourage social responsibility?',
                    'Is participation well coordinated?',
                    'Any other suggestions ?'
                ]
            },
            'Technical & Cultural Clubs': {
                ratings: ['Meeting Regularity', 'Skill Development', 'Communication'],
                questions: [
                    'Are club meetings and activities conducted regularly?',
                    'Do clubs provide opportunities for skill development?',
                    'Is communication about events clear and timely?',
                    'Any other suggestions ?'
                ]
            }
        }
    }
};

const FeedbackForm = () => {
    const { category: paramCategory, id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [category, setCategory] = useState(paramCategory || '');
    const [subCategory, setSubCategory] = useState('');
    const [ratings, setRatings] = useState({});
    const [questions, setQuestions] = useState({});
    const [overallRating, setOverallRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            fetchFeedback(id);
        }
    }, [id]);

    const fetchFeedback = async (feedbackId) => {
        try {
            setLoading(true);
            const response = await api.get(`/feedback/${feedbackId}`);
            const data = response.data;
            setCategory(data.category);
            setSubCategory(data.subCategory);
            setRatings(data.ratings); // Ensure map is handled correctly
            setQuestions(data.questions); // Ensure map/obj handled
            setOverallRating(data.overallRating);
        } catch (err) {
            setError('Failed to fetch feedback details.');
        } finally {
            setLoading(false);
        }
    };

    const categoryData = FEEDBACK_DATA[category] || {};
    const subCategories = Object.keys(categoryData.subCategories || {});

    const currentSubCatData = subCategory ? categoryData.subCategories[subCategory] : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (overallRating === 0) {
            setError('Overall rating is required');
            return;
        }

        if (!subCategory) {
            setError('Please select a sub-category.');
            return;
        }

        setLoading(true);
        try {
            const feedbackData = {
                studentName: user.name,
                studentEmail: user.email,
                category, // Ensure category is set
                subCategory,
                ratings,
                questions,
                overallRating
            };

            if (isEdit) {
                await api.put(`/feedback/${id}`, feedbackData);
            } else {
                await api.post('/feedback', feedbackData);
            }
            navigate('/my-feedback');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit feedback. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4" style={{ maxWidth: '800px' }}>
            <Card className="shadow-sm border-0">
                <Card.Body className="p-4">
                    <div className="text-center mb-4">
                        <h2 className="mb-2" style={{ color: '#111F35' }}>{isEdit ? 'Edit' : ''} {category} Feedback</h2>
                        <p className="text-muted">{isEdit ? 'Update your feedback' : 'Give your valuable feedback to help us improve.'}</p>
                    </div>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Select Sub-Category <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={subCategory}
                                onChange={(e) => {
                                    setSubCategory(e.target.value);
                                    setRatings({});
                                    setQuestions({});
                                }}
                                required
                            >
                                <option value="">-- Select --</option>
                                {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                            </Form.Select>
                        </Form.Group>

                        {currentSubCatData && (
                            <>
                                <div className="mb-4">
                                    <h5 className="mb-3 border-bottom pb-2" style={{ color: '#8A244B' }}>Rate the following aspects</h5>
                                    {currentSubCatData.ratings.map(aspect => (
                                        <div key={aspect} className="d-flex justify-content-between align-items-center mb-3 bg-light p-3 rounded">
                                            <span className="fw-medium">{aspect}</span>
                                            <StarRating
                                                rating={ratings[aspect] || 0}
                                                onChange={(val) => setRatings({ ...ratings, [aspect]: val })}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4">
                                    <h5 className="mb-3 border-bottom pb-2" style={{ color: '#8A244B' }}>Detailed Feedback</h5>

                                    {currentSubCatData.questions.map((q, idx) => (
                                        <Form.Group className="mb-3" key={idx}>
                                            <Form.Label>{q}</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                value={questions[q] || ''}
                                                onChange={(e) => setQuestions(prev => ({ ...prev, [q]: e.target.value }))}
                                            />
                                        </Form.Group>
                                    ))}
                                </div>

                                <div className="mb-4 text-center">
                                    <h5 className="mb-3" style={{ color: '#8A244B' }}>Overall Rating <span className="text-danger">*</span></h5>
                                    <div className="d-flex justify-content-center">
                                        <StarRating rating={overallRating} onChange={setOverallRating} />
                                    </div>
                                </div>

                                <div className="d-grid gap-2">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                        style={{ backgroundColor: '#F63049', borderColor: '#F63049' }}
                                    >
                                        {loading ? 'Submitting...' : 'Submit Feedback'}
                                    </Button>
                                    <Form.Text className="text-center text-muted mt-2">
                                        Note: You can edit or delete this feedback within 15 minutes of submission.
                                    </Form.Text>
                                </div>
                            </>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default FeedbackForm;

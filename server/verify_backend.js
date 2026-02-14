const API_URL = 'http://localhost:5000/api';

async function verifyBackend() {
    try {
        console.log('--- Starting Backend Verification ---');

        // Helper function for fetch
        const post = async (url, data, token) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`POST ${url} failed: ${res.status} ${text}`);
            }
            return res.json();
        };

        const get = async (url, token) => {
            const headers = {};
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, { headers });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`GET ${url} failed: ${res.status} ${text}`);
            }
            return res.json();
        };

        const del = async (url, token) => {
            const headers = {};
            if (token) headers['x-auth-token'] = token;
            const res = await fetch(url, { method: 'DELETE', headers });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`DELETE ${url} failed: ${res.status} ${text}`);
            }
            return res.json();
        }

        // 1. Login as Student
        console.log('\n1. Logging in as Student...');
        const studentLogin = await post(`${API_URL}/auth/login`, {
            email: 'student@college.edu',
            password: 'student123'
        });
        const studentToken = studentLogin.token;
        console.log('Student Login Successful. Token received.');

        // 2. Create Feedback
        console.log('\n2. Creating Feedback...');
        const feedbackData = {
            category: 'Academics',
            subCategory: 'Teaching',
            ratings: { 'Clarity': 5, 'Pace': 4 },
            questions: { 'Comments': 'Great class!' },
            overallRating: 4.5
        };
        const createFeedback = await post(`${API_URL}/feedback`, feedbackData, studentToken);
        console.log('Feedback Created:', createFeedback._id);
        const feedbackId = createFeedback._id;

        // 3. Get My Feedback
        console.log('\n3. Fetching User Feedback...');
        const myFeedback = await get(`${API_URL}/feedback/my-feedback`, studentToken);
        console.log('User Feedback Count:', myFeedback.length);

        // 4. Login as Admin
        console.log('\n4. Logging in as Admin...');
        const adminLogin = await post(`${API_URL}/auth/login`, {
            email: 'admin@college.edu',
            password: 'admin123'
        });
        const adminToken = adminLogin.token;
        console.log('Admin Login Successful.');

        // 5. Get Admin Stats
        console.log('\n5. Fetching Admin Stats...');
        const stats = await get(`${API_URL}/admin/stats`, adminToken);
        console.log('Admin Stats:', JSON.stringify(stats, null, 2));

        // 6. Delete the created feedback to clean up (optional but good)
        console.log('\n6. Deleting Feedback...');
        await del(`${API_URL}/feedback/${feedbackId}`, studentToken);
        console.log('Feedback Deleted.');

        console.log('\n--- Verification Completed Successfully ---');

    } catch (error) {
        console.error('\n!!! Verification Failed !!!');
        console.error(error.message);
    }
}

verifyBackend();

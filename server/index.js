// server/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- CONFIGURATION [cite: 45, 46] ---
const HOSTAWAY_API_BASE = 'https://api.hostaway.com/v1';
const CLIENT_ID = '61148';
const CLIENT_SECRET = 'f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152';

// --- DATABASE (PostgreSQL) ---
// We use a simple connection check. If no DB is provided, we use in-memory storage for the demo.
let dbPool;
let inMemoryApprovals = {}; // Fallback storage

if (process.env.DATABASE_URL) {
    dbPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    // Initialize table if it doesn't exist
    dbPool.query(`
        CREATE TABLE IF NOT EXISTS review_settings (
            review_id VARCHAR(255) PRIMARY KEY,
            is_approved BOOLEAN DEFAULT FALSE
        );
    `).catch(err => console.error("DB Init Error:", err));
} else {
    console.warn("⚠️ No DATABASE_URL found. Using in-memory storage (data will reset on restart).");
}

// --- HELPER: MOCK DATA ---
// [cite: 9] The prompt asks to mock realistic data since the API is sandboxed.
const MOCK_REVIEWS = [
    {
        id: 9001,
        guestName: "Sarah Jenkins",
        listingName: "Modern Loft in Downtown",
        publicReview: "Absolutely loved the place! The automation was seamless.",
        submittedAt: "2023-10-05 14:30:00",
        channel: "Airbnb",
        reviewCategory: [{ category: "cleanliness", rating: 10 }, { category: "communication", rating: 10 }]
    },
    {
        id: 9002,
        guestName: "Mike Ross",
        listingName: "Cozy Studio",
        publicReview: "Great location, but the wifi was a bit spotty.",
        submittedAt: "2023-09-12 09:15:00",
        channel: "Booking.com",
        reviewCategory: [{ category: "cleanliness", rating: 8 }, { category: "communication", rating: 6 }]
    }
];

// --- ROUTE 1: GET /api/reviews/hostaway [cite: 51] ---
app.get('/api/reviews/hostaway', async (req, res) => {
    try {
        // 1. Fetch Access Token (Hostaway requires this first)
        // Note: In a real app, we cache this token.
        const tokenResponse = await axios.post(`${HOSTAWAY_API_BASE}/accessTokens`, {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'general'
        }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
        
        const accessToken = tokenResponse.data.access_token;

        // 2. Fetch Reviews from Hostaway (Sandbox usually returns empty, but we try)
        const reviewsResponse = await axios.get(`${HOSTAWAY_API_BASE}/reviews`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const apiReviews = reviewsResponse.data.result || [];
        
        // 3. Merge API Data with Mock Data
        const allRawReviews = [...apiReviews, ...MOCK_REVIEWS];

        // 4. Fetch Approvals from DB
        let approvedIds = new Set();
        if (dbPool) {
            const result = await dbPool.query('SELECT review_id FROM review_settings WHERE is_approved = true');
            result.rows.forEach(r => approvedIds.add(r.review_id.toString()));
        } else {
            // Use in-memory fallback
            Object.keys(inMemoryApprovals).forEach(id => {
                if(inMemoryApprovals[id]) approvedIds.add(id.toString());
            });
        }

        // 5. NORMALIZE DATA [cite: 10, 30]
        // We transform the messy JSON into a clean structure for the frontend.
        const normalizedReviews = allRawReviews.map(review => {
            // Calculate average rating from categories if main rating is null [cite: 62]
            let finalRating = review.rating;
            if (!finalRating && review.reviewCategory && review.reviewCategory.length > 0) {
                const sum = review.reviewCategory.reduce((acc, curr) => acc + curr.rating, 0);
                finalRating = (sum / review.reviewCategory.length).toFixed(1);
            }

            return {
                id: review.id,
                guestName: review.guestName || "Anonymous",
                listingName: review.listingName || "Unknown Listing",
                comment: review.publicReview,
                date: review.submittedAt, // In production, parse this to ISO
                rating: finalRating || "N/A",
                channel: review.channel || "Hostaway", // API doesn't always give channel, default to Hostaway
                isApproved: approvedIds.has(review.id.toString())
            };
        });

        res.json({ success: true, data: normalizedReviews });

    } catch (error) {
        console.error("API Error:", error.message);
        // Fallback to just mocks if API fails (Resilience)
        res.json({ success: false, error: error.message, data: MOCK_REVIEWS }); // Simplified fallback
    }
});

// --- ROUTE 2: POST /api/reviews/:id/approve [cite: 17] ---
// Allows the manager to approve/reject a review
app.post('/api/reviews/:id/approve', async (req, res) => {
    const { id } = req.params;
    const { approved } = req.body; // boolean

    try {
        if (dbPool) {
            await dbPool.query(
                `INSERT INTO review_settings (review_id, is_approved) 
                 VALUES ($1, $2) 
                 ON CONFLICT (review_id) 
                 DO UPDATE SET is_approved = $2`,
                [id, approved]
            );
        } else {
            inMemoryApprovals[id] = approved;
        }
        res.json({ success: true, approved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database update failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");

const reviewsRouter = require("./src/routes/reviews");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/reviews", reviewsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});

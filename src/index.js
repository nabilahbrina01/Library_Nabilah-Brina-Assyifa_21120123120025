import express from "express";
import dotenv from "dotenv";
import loanRoutes from "./routes/loanRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Library Loan API is running", endpoint: "/loans" });
});

app.use("/loans", loanRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route tidak ditemukan" });
});

const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
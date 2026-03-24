import express from "express";
import multer from "multer";
import { parseFile } from "./fileParser.js";
import {
  analyzeCV,
  improveCV,
  matchCVWithJD,
  mockTest,
  modifyCVToMatchJD,
  searchJob,
} from "./openaiService.js";

const router = express.Router();
const upload = multer();

router.post("/parse", upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await parseFile(req.file);

    res.json({ text });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/analyze", async (req, res) => {
  try {
    const text = req.body.text;

    const feedback = await analyzeCV(text);

    res.json({ feedback, text });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/improve", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No CV  text provided" });
    }
    const improved = await improveCV(text);
    res.json({ improved });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/match", async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;
    if (!cvText || !jobDescription) {
      return res.status(400).json({ error: "Missing data" });
    }
    const result = await matchCVWithJD(cvText, jobDescription);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/tailorCV", async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;
    if (!cvText || !jobDescription) {
      return res.status(400).json({ error: "Missing data" });
    }
    const result = await modifyCVToMatchJD(cvText, jobDescription);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/jobSearch", async (req, res) => {
  try {
    const { cvText } = req.body;
    if (!cvText) {
      return res.status(400).json({ error: "Missing data" });
    }
    const result = await searchJob(cvText);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/mockTest", async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Missing data" });
    }
    const result = await mockTest(jobDescription);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

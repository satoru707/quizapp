import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import JSZip from "jszip";
import xml2js from "xml2js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

const upload = multer({
  dest: path.join(__dirname, "uploads/"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function extractTextFromPPTX(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const zip = await JSZip.loadAsync(fileBuffer);
    let allText = [];
    for (const fileName of Object.keys(zip.files)) {
      if (/^ppt\/slides\/slide\d+\.xml$/.test(fileName)) {
        const slideContent = await zip.file(fileName).async("string");
        const parser = new xml2js.Parser({ explicitArray: false });
        const slideJson = await parser.parseStringPromise(slideContent);
        let text = "";
        const shapes =
          slideJson?.["p:sld"]?.["p:cSld"]?.["p:spTree"]?.["p:sp"] || [];
        const shapeArray = Array.isArray(shapes) ? shapes : [shapes];
        for (const shape of shapeArray) {
          const paragraphs = shape?.["p:txBody"]?.["a:p"] || [];
          const paragraphArray = Array.isArray(paragraphs)
            ? paragraphs
            : [paragraphs];
          for (const paragraph of paragraphArray) {
            const runs = paragraph?.["a:r"] || [];
            const runArray = Array.isArray(runs) ? runs : [runs];

            for (const run of runArray) {
              const textNode = run?.["a:t"];
              if (textNode)
                text +=
                  (typeof textNode === "string" ? textNode : textNode._ || "") +
                  " ";
            }
          }
        }
        if (text.trim()) allText.push(text.trim());
      }
    }
    return allText.join("\n") || "No text found";
  } catch (error) {
    console.error("Error:", error.message);
    return "Failed to extract text";
  }
}

async function extractTextFromFile(file) {
  const filePath = file.path;
  const fileType = file.mimetype;

  try {
    if (fileType === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      const dataBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else if (fileType === "text/plain") {
      return fs.readFileSync(filePath, "utf8");
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      const text = await extractTextFromPPTX(filePath);
      return text;
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
}

function sanitizeJsonString(jsonString) {
  let sanitized = jsonString
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");

  const jsonStart = sanitized.indexOf("{");
  const jsonEnd = sanitized.lastIndexOf("}") + 1;
  if (jsonStart >= 0 && jsonEnd > jsonStart) {
    sanitized = sanitized.slice(jsonStart, jsonEnd);
  }

  return sanitized;
}
async function generateAIQuestions(text, type, objectiveCount, theoryCount) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text content: text must be a non-empty string");
    }

    if (!["objective", "theory", "both"].includes(type)) {
      throw new Error(
        'Invalid question type: must be "objective", "theory", or "both"'
      );
    }

    if (
      isNaN(objectiveCount) ||
      isNaN(theoryCount) ||
      objectiveCount < 0 ||
      theoryCount < 0
    ) {
      throw new Error("Invalid question counts: must be positive numbers");
    }

    // Split text into sentences or meaningful chunks
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

    // If text is too short, just use the full text
    const textChunks = sentences.length > 3 ? sentences : [text];

    // Function to get random chunks for context
    const getRandomContext = () => {
      const randomIndex = Math.floor(Math.random() * textChunks.length);
      const chunk = textChunks[randomIndex];
      // Include some surrounding context (1-2 sentences before/after if available)
      const contextStart = Math.max(0, randomIndex - 2);
      const contextEnd = Math.min(textChunks.length, randomIndex + 3);
      return textChunks.slice(contextStart, contextEnd).join(". ") + ".";
    };

    const prompt = `You are an expert educator who creates high-quality study questions.
    Generate study questions from random sections of the following text.
    ${
      type === "objective"
        ? `Create ${objectiveCount} objective questions.`
        : ""
    }
    ${type === "theory" ? `Create ${theoryCount} theory questions.` : ""}
    ${
      type === "both"
        ? `Create ${objectiveCount} objective questions and ${theoryCount} theory questions.`
        : ""
    }
    
    IMPORTANT:
    1. Questions should cover different parts of the text, not just the beginning.
    2. For each question, provide an answer and a detailed explanation.
    3. Return ONLY a valid JSON object with an array of questions, each with id, text, answer, explanation, and type fields.
    4. Each question must have a unique numeric id field starting from 1.
    5. If type is "objective", there should options that correspond to the answer.
  
    Example format:
    {
      "questions": [
        {
          "id": 1,
          "text": "What is...?",
          "options": ["Option A", "Option B", "Option C", "Option D", "Option E"],
          "answer": "The answer is...",
          "explanation": "Detailed explanation...",
          "type": "objective"
        }
      ]
    }

       
    Here are random sections from the text to help generate diverse questions:
    ${Array.from({ length: 5 }, () => getRandomContext()).join("\n\n---\n\n")}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const sanitizedJson = sanitizeJsonString(responseText);
    // console.log("Sanitized JSON:", sanitizedJson);

    const parsed = JSON.parse(sanitizedJson);

    const collectOptions = (data) => data.questions.map((q) => q.options);
    const allOpt = collectOptions(parsed);

    // console.log("allOpt", allOpt);

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid questions format from Gemini");
    }
    // console.log("parsed", parsed);
    // console.log(parsed.options);
    // console.log(JSON.stringify(parsed.options));

    parsed.questions = parsed.questions.map((q, i) => ({
      id: q.id || i + 1,
      text: (q.text || "").trim(),
      options: allOpt[i] || [], // Ensure options is always an array
      answer: (q.answer || "").trim(),
      explanation: (q.explanation || "").trim(),
      type: q.type === "theory" ? "theory" : "objective", // Default to objective
    }));
    console.log(parsed.questions);

    // console.log("Processed questions:", JSON.stringify(parsed, null, 2))

    return parsed.questions;
  } catch (error) {
    console.error("Error in generateAIQuestions:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

app.post("/api/generate", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const type = req.body.type || "both";
    const objectiveCount = parseInt(req.body.objectiveCount) || 10;
    const theoryCount = parseInt(req.body.theoryCount) || 5;

    let text;
    try {
      text = await extractTextFromFile(req.file);
      if (!text || typeof text !== "string") {
        throw new Error("Failed to extract text from file");
      }
    } catch (extractError) {
      console.error("Text extraction error:", extractError);
      throw new Error(`File processing failed: ${extractError.message}`);
    }

    const questions = await generateAIQuestions(
      text,
      type,
      objectiveCount,
      theoryCount
    );
    // console.log("requestions", JSON.stringify(questions));

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log("Generated questions:", questions);

    return res.json({ questions });
  } catch (error) {
    console.error("API Error:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      error: "Failed to generate questions",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);

  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
});

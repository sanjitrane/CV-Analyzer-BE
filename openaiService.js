import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeCV = async (text) => {
  // Optional: truncate long CVs
  const truncatedText = text.slice(0, 12000);

  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    messages: [
      {
        role: "system",
        content: "You are an expert resume reviewer.",
      },
      {
        role: "user",
        content: `
Analyze this CV and return:

1. Overall Score (out of 10)
2. Strengths
3. Weaknesses
4. Suggestions
5. Missing keywords (ATS)
6. Formatting issues
7. Expected Package range
8. Suggest AI tools for skill upgrading which can be used for coding and development

CV:
${truncatedText}
Return ONLY valid JSON in this format:

{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "suggestions": string[],
  "keywords": string[],
  "formatIssues": string[],
  "package": string[],
  "aiTools":string[],
}
        `,
      },
    ],
  });

  const raw = response.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.log("JSON parse failed", raw);
    throw new Error("Invalid AI response format");
  }
  return parsed;
};

export const improveCV = async (text) => {
  const truncatedText = text.slice(0, 12000);
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    messages: [
      {
        role: "system",
        content: "You are an expert resume writer.",
      },
      {
        role: "user",
        content: `Rewrite and improve the following CV.

Rules:
- Make it ATS-friendly
- Use strong action verbs
- Improve formatting
- Keep it concise and professional
- Structure it clearly with sections:
  - Summary
  - Skills
  - Experience
  - Education

Return clean formatted text (not JSON).
CV:
${truncatedText}        
`,
      },
    ],
  });
  return response.choices[0].message.content;
};

export const matchCVWithJD = async (cvText, jobDescription) => {
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    messages: [
      {
        role: "system",
        content:
          "You are  an ATS system that evaluates resumes against job descriptions",
      },
      {
        role: "user",
        content: `
Compare this CV with the Job Description.

Return ONLY valid JSON:

{
  "matchScore": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "improvements": string[]
}

CV:
${cvText.slice(0, 8000)}

Job Description:
${jobDescription.slice(0, 4000)}
        `,
      },
    ],
  });

  const raw = response.choices[0].message.content;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("ATS JSON parse failed:", raw);
    throw new Error("Invalid ATS response");
  }
};

export const modifyCVToMatchJD = async (cvText, jobDescription) => {
  const response = await client.chat.completions.create({
    model: "gpt-5.4",
    messages: [
      {
        role: "system",
        content: `You are  an ATS system that evaluates resumes against job descriptions`,
      },
      {
        role: "user",
        content: `Compare this CV with the Job Description. 
        If the ATS score is less than 95%, generate cv based on the job description which will generate a score of over 95%.
        Return ONLY valid JSON:

{
  "matchScore": number (0-100),
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "modifiedCV": string,
}.
        ${cvText.slice(0, 8000)}

Job Description:
${jobDescription.slice(0, 4000)}
        `,
      },
    ],
  });
  const raw = response.choices[0].message.content;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("ATS JSON parse failed:", raw);
    throw new Error("Invalid ATS response");
  }
};

export const searchJob = async (cvText) => {
  const response = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      {
        role: "user",
        content: `Find relevant job search keywords from this CV and find jobs.
        Rules:
      - Job location should be Mumbai, India. 
      - Pull live job links from LinkedIn/Naukri/Indeed
      - Filter for 40-60 LPA roles only
      - Identify roles matching your exact CV (90%+ fit)

      return direct apply link and pass it in url key
      
      Return ONLY valid JSON:

      {
      jobs:[{title:string, url:string}]
      }
      CV:
      ${cvText.slice(0, 8000)}
      `,
      },
    ],
  });
  const raw = response.choices[0].message.content;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("ATS JSON parse failed:", raw);
    throw new Error("Invalid ATS response");
  }
};

export const mockTest = async (jobDescription) => {
  const response = await client.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      {
        role: "system",
        content: "You are an expert interviewer",
      },
      {
        role: "user",
        content: `Based on the job description provided, generate list of interview questions based on the role in the job description.
      Rules for the questions:
      - Theoritical questions
      - Problem Solving
      - DS/ Algo
      - Team player
      - Leadership / Ownership

      Return ONLY valid JSON:
      {
      theoritical:string[],
      problem:string[],
      algo:string[],
      team:string[],
      leadership:string[]
      }

      Job Description:
      ${jobDescription.slice(0, 4000)}
      `,
      },
    ],
  });
  const raw = response.choices[0].message.content;
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("JSON parse failed:", raw);
    throw new Error("Invalid response");
  }
};

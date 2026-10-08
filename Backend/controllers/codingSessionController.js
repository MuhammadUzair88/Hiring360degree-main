import { ScheduledInterview } from "../models/interviewModel.js";

const JUDGE0_API_URL = (
  process.env.JUDGE0_API_URL || "https://ce.judge0.com"
).replace(/\/+$/, "");
const lastRunByCall = new Map();

function judge0Headers() {
  const headers = { "Content-Type": "application/json" };
  if (process.env.JUDGE0_API_KEY) {
    headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
  }
  return headers;
}

function formatCodingSession(interview) {
  const codingSession = interview.codingSession || {};
  return {
    enabled: Boolean(codingSession.enabled),
    languageId: codingSession.languageId ?? null,
    sourceCode: codingSession.sourceCode || "",
    stdin: codingSession.stdin || "",
    revision: codingSession.revision || 0,
    updatedAt: codingSession.updatedAt || null,
  };
}

export const getCodingSession = async (req, res) => {
  return res.status(200).json({
    success: true,
    codingSession: formatCodingSession(req.codingSession.interview),
  });
};

export const updateCodingSession = async (req, res) => {
  try {
    const { enabled, languageId, sourceCode, stdin } = req.body || {};
    const updates = {};

    if (enabled !== undefined) {
      if (req.codingSession.role !== "interviewer") {
        return res.status(403).json({
          success: false,
          message: "Only the interviewer can enable or disable the code editor",
        });
      }
      if (typeof enabled !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "enabled must be a boolean",
        });
      }
      updates["codingSession.enabled"] = enabled;
    }

    if (languageId !== undefined) {
      const parsedLanguageId = Number(languageId);
      if (!Number.isInteger(parsedLanguageId) || parsedLanguageId <= 0) {
        return res.status(400).json({
          success: false,
          message: "A valid compiler language is required",
        });
      }
      updates["codingSession.languageId"] = parsedLanguageId;
    }

    if (sourceCode !== undefined) {
      if (typeof sourceCode !== "string" || sourceCode.length > 100_000) {
        return res.status(400).json({
          success: false,
          message: "Code must be text and cannot exceed 100 KB",
        });
      }
      updates["codingSession.sourceCode"] = sourceCode;
    }

    if (stdin !== undefined) {
      if (typeof stdin !== "string" || stdin.length > 20_000) {
        return res.status(400).json({
          success: false,
          message: "Program input must be text and cannot exceed 20 KB",
        });
      }
      updates["codingSession.stdin"] = stdin;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        message: "No coding session changes were provided",
      });
    }

    if (
      req.codingSession.role === "candidate" &&
      !req.codingSession.interview.codingSession?.enabled
    ) {
      return res.status(403).json({
        success: false,
        message: "The interviewer has not enabled the code editor",
      });
    }

    updates["codingSession.updatedAt"] = new Date();
    const interview = await ScheduledInterview.findByIdAndUpdate(
      req.codingSession.interview._id,
      {
        $set: updates,
        $inc: { "codingSession.revision": 1 },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      codingSession: formatCodingSession(interview),
    });
  } catch (error) {
    console.error("Update coding session failed:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update the shared code editor",
    });
  }
};

export const getCompilerLanguages = async (_req, res) => {
  try {
    const response = await fetch(`${JUDGE0_API_URL}/languages`, {
      headers: judge0Headers(),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Compiler service returned HTTP ${response.status}`);
    }

    const languages = await response.json();
    return res.status(200).json({
      success: true,
      languages: languages.map(({ id, name }) => ({ id, name })),
    });
  } catch (error) {
    console.error("Unable to load compiler languages:", error.message);
    return res.status(502).json({
      success: false,
      message: "The online compiler is unavailable. Try again shortly.",
    });
  }
};

export const runCodingSubmission = async (req, res) => {
  try {
    const { languageId, sourceCode, stdin = "" } = req.body || {};
    const parsedLanguageId = Number(languageId);

    if (!req.codingSession.interview.codingSession?.enabled) {
      return res.status(403).json({
        success: false,
        message: "The interviewer has not enabled the code editor",
      });
    }
    const previousRunAt = lastRunByCall.get(req.params.callId) || 0;
    if (Date.now() - previousRunAt < 1500) {
      return res.status(429).json({
        success: false,
        message: "Please wait a moment before running another submission",
      });
    }
    if (
      !Number.isInteger(parsedLanguageId) ||
      parsedLanguageId <= 0 ||
      typeof sourceCode !== "string" ||
      sourceCode.length > 100_000 ||
      typeof stdin !== "string" ||
      stdin.length > 20_000
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid language, code, and input",
      });
    }

    lastRunByCall.set(req.params.callId, Date.now());

    const submissionResponse = await fetch(
      `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: judge0Headers(),
        body: JSON.stringify({
          language_id: parsedLanguageId,
          source_code: sourceCode,
          stdin,
          cpu_time_limit: 5,
          wall_time_limit: 10,
          memory_limit: 256_000,
        }),
        signal: AbortSignal.timeout(12_000),
      }
    );

    if (!submissionResponse.ok) {
      const details = await submissionResponse.text();
      console.error("Compiler submission rejected:", submissionResponse.status, details);
      return res.status(502).json({
        success: false,
        message: "The compiler could not accept this submission",
      });
    }

    const { token } = await submissionResponse.json();
    if (!token) throw new Error("Compiler did not return a submission token");

    let result = null;
    for (let attempt = 0; attempt < 24; attempt += 1) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 750));
      }

      const resultResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/${encodeURIComponent(token)}?base64_encoded=false`,
        {
          headers: judge0Headers(),
          signal: AbortSignal.timeout(8_000),
        }
      );

      if (!resultResponse.ok) {
        throw new Error(`Compiler result request failed with HTTP ${resultResponse.status}`);
      }

      result = await resultResponse.json();
      if (![1, 2].includes(result.status?.id)) break;
    }

    if ([1, 2].includes(result?.status?.id)) {
      return res.status(202).json({
        success: true,
        pending: true,
        message: "The compiler is still processing this program. Run it again shortly.",
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        status: result?.status?.description || "Finished",
        stdout: result?.stdout || "",
        stderr: result?.stderr || "",
        compileOutput: result?.compile_output || "",
        message: result?.message || "",
        time: result?.time || null,
        memory: result?.memory || null,
      },
    });
  } catch (error) {
    console.error("Code execution failed:", error.message);
    return res.status(502).json({
      success: false,
      message: "The online compiler is unavailable. Try again shortly.",
    });
  }
};

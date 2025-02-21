export const checkTextLength = (text, minWords = 150) => {
  return text.trim().split(/\s+/).length > minWords;
};

export const summarizeText = async (text, onProgress) => {
  try {
    const capabilities = await window.ai.summarizer.capabilities();
    if (capabilities.available === "no") {
      return {
        success: false,
        error: "Summarizer API is not available",
      };
    }

    const summarizer = await window.ai.summarizer.create({
      type: "key-points",
      format: "plain-text",
      length: "medium",
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          if (onProgress) {
            onProgress(
              e.loaded,
              e.total,
              Math.round((e.loaded / e.total) * 100)
            );
          }
        });
      },
      options: {
        preferCPU: true,
        resourceConstraints: {
          cpuUtilization: 0.3,
          memoryUtilization: 0.3,
        },
      },
    });

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Summarization timed out")), 30000);
    });

    const summary = await Promise.race([
      summarizer.summarize(text.trim()),
      timeoutPromise,
    ]);

    if (!summary) {
      return {
        success: false,
        error: "No summary was generated",
      };
    }

    return {
      success: true,
      summary,
    };
  } catch (err) {
    let errorMessage = "Summarization failed: ";
    if (err.message.includes("GPU")) {
      errorMessage +=
        "GPU is busy. Try closing other browser tabs or check hardware acceleration settings.";
    } else if (err.message.includes("timeout")) {
      errorMessage += "Operation timed out. Please try again.";
    } else {
      errorMessage += err.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

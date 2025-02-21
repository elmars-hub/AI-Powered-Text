export const detectLanguage = async (text) => {
  try {
    const detector = await window.ai.languageDetector.create();
    const results = await detector.detect(text);
    if (!results || !results[0]) return null;
    return results[0].detectedLanguage;
  } catch (error) {
    console.error("Language detection error:", error);
    return null;
  }
};

export const translateText = async (
  text,
  sourceLanguage,
  targetLanguage,
  onProgress
) => {
  try {
    if (!("ai" in window) || !("translator" in window.ai)) {
      return {
        success: false,
        error: "Translation API not supported in this browser",
      };
    }

    if (sourceLanguage === targetLanguage) {
      return {
        success: false,
        error: "Source and target languages are the same",
      };
    }

    const translator = await window.ai.translator.create({
      sourceLanguage,
      targetLanguage,
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
    });

    const translation = await translator.translate(text);
    if (!translation) {
      return {
        success: false,
        error: "No translation was generated",
      };
    }

    return {
      success: true,
      translation,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

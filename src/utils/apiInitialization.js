export const checkBrowserSupport = () => {
  if (!("ai" in window)) {
    return {
      isSupported: false,
      error: "Please use Chrome or Edge browser",
    };
  }
  return {
    isSupported: true,
    error: null,
  };
};

export const checkSummarizerAvailability = async () => {
  try {
    if (!("summarizer" in window.ai)) {
      return {
        available: "no",
        error: "Summarizer API is not supported in this browser",
      };
    }

    const capabilities = await window.ai.summarizer.capabilities();
    return {
      available: capabilities.available,
      error: null,
    };
  } catch (err) {
    return {
      available: "error",
      error: `Failed to check API status: ${err.message}`,
    };
  }
};

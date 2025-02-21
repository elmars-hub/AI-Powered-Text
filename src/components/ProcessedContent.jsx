import { useAppContext } from "../context/AppContext";

function ProcessedContent({ processed }) {
  const { getLanguageName } = useAppContext();

  return processed.map((proc, index) => {
    if (proc.type === "translation") {
      return (
        <div key={index} className="flex flex-col ml-8 mt-2 animate-fade-in" role="article" aria-label="Translation">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              {proc.content}
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mt-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block">
            Translated to: {getLanguageName(proc.targetLanguage)}
          </span>
        </div>
      );
    } else if (proc.type === "summary") {
      return (
        <div key={index} className="flex flex-col ml-8 mt-2 animate-fade-in" role="article" aria-label="Summary">
          <div className="flex justify-start">
            <div className="max-w-[80%] bg-gray-100 dark:bg-gray-700 px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                Summary:
              </div>
              {proc.content}
            </div>
          </div>
        </div>
      );
    }
    return null;
  });
}

export default ProcessedContent; 
/**
 * Safely parses a JSON string.
 * @param {string} jsonString - The JSON string to parse.
 * @param {any} fallbackValue - The value to return if parsing fails.
 * @returns {any} The parsed JSON object or the fallback value.
 */
export const safeParseJson = (jsonString, fallbackValue = null) => {
  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
    return fallbackValue;
  }
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallbackValue;
  }
};

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config/gemini';

// Lazy initialization of Gemini AI
let genAI: GoogleGenerativeAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      throw new Error('Gemini AI initialization failed');
    }
  }
  return genAI;
};

interface TranslationResult {
  originalText: string;
  translatedText: string;
  detectedLanguage: string;
  confidence: number;
}

/**
 * Simple fallback translation for common phrases
 */
function getSimpleTranslation(text: string): TranslationResult {
  const simpleTranslations: { [key: string]: { translation: string; language: string } } = {
    // Spanish
    'hola': { translation: 'hello', language: 'Spanish' },
    '¿cómo estás?': { translation: 'how are you?', language: 'Spanish' },
    'gracias': { translation: 'thank you', language: 'Spanish' },
    'por favor': { translation: 'please', language: 'Spanish' },
    'sí': { translation: 'yes', language: 'Spanish' },
    'no': { translation: 'no', language: 'Spanish' },
    'buenos días': { translation: 'good morning', language: 'Spanish' },
    'buenas tardes': { translation: 'good afternoon', language: 'Spanish' },
    'buenas noches': { translation: 'good evening', language: 'Spanish' },
    'adiós': { translation: 'goodbye', language: 'Spanish' },
    
    // French
    'bonjour': { translation: 'hello', language: 'French' },
    'comment allez-vous?': { translation: 'how are you?', language: 'French' },
    'merci': { translation: 'thank you', language: 'French' },
    's\'il vous plaît': { translation: 'please', language: 'French' },
    'oui': { translation: 'yes', language: 'French' },
    'non': { translation: 'no', language: 'French' },
    'bonne journée': { translation: 'have a good day', language: 'French' },
    'au revoir': { translation: 'goodbye', language: 'French' },
    
    // German
    'hallo': { translation: 'hello', language: 'German' },
    'wie geht es dir?': { translation: 'how are you?', language: 'German' },
    'danke': { translation: 'thank you', language: 'German' },
    'bitte': { translation: 'please', language: 'German' },
    'ja': { translation: 'yes', language: 'German' },
    'nein': { translation: 'no', language: 'German' },
    'guten tag': { translation: 'good day', language: 'German' },
    'auf wiedersehen': { translation: 'goodbye', language: 'German' },
  };
  
  const lowerText = text.toLowerCase().trim();
  const translation = simpleTranslations[lowerText];
  
  if (translation) {
    return {
      originalText: text,
      translatedText: translation.translation,
      detectedLanguage: translation.language,
      confidence: 0.8
    };
  }
  
  return {
    originalText: text,
    translatedText: text,
    detectedLanguage: 'Unknown',
    confidence: 0.0
  };
}

/**
 * Detect the language of the input text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    // Check if API key is valid
    if (!GEMINI_CONFIG.API_KEY || GEMINI_CONFIG.API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, skipping language detection');
      return 'Unknown';
    }
    
    // Try different model names if the current one fails
    let model;
    const modelNames = [GEMINI_CONFIG.MODEL, 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of modelNames) {
      try {
        model = getGenAI().getGenerativeModel({ model: modelName });
        break;
      } catch (error) {
        if (modelName === modelNames[modelNames.length - 1]) {
          throw error;
        }
      }
    }
    
    if (!model) {
      throw new Error('Failed to initialize any Gemini model');
    }
    
    const prompt = `Detect the language of this text and respond with only the language name in English (e.g., "Spanish", "French", "Chinese", "English", etc.): "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const detectedLanguage = response.text().trim();
    
    return detectedLanguage;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'Unknown';
  }
}

/**
 * Translate text to English using Gemini AI
 */
export async function translateToEnglish(text: string): Promise<TranslationResult> {
  try {
    console.log('translateToEnglish called with:', text);
    console.log('API Key configured:', !!GEMINI_CONFIG.API_KEY);
    
    // Check if API key is valid
    if (!GEMINI_CONFIG.API_KEY || GEMINI_CONFIG.API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, returning original text');
      return {
        originalText: text,
        translatedText: text,
        detectedLanguage: 'Unknown',
        confidence: 0.0
      };
    }
    
    console.log('Initializing Gemini AI...');
    console.log('Using model:', GEMINI_CONFIG.MODEL);
    
    // Try different model names if the current one fails
    let model;
    const modelNames = [GEMINI_CONFIG.MODEL, 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of modelNames) {
      try {
        console.log('Trying model:', modelName);
        model = getGenAI().getGenerativeModel({ model: modelName });
        console.log('Successfully initialized model:', modelName);
        break;
      } catch (error) {
        console.log('Failed to initialize model:', modelName, error instanceof Error ? error.message : String(error));
        if (modelName === modelNames[modelNames.length - 1]) {
          throw error; // If all models fail, throw the last error
        }
      }
    }
    
    if (!model) {
      throw new Error('Failed to initialize any Gemini model');
    }
    
    // First detect the language
    console.log('Detecting language...');
    const detectedLanguage = await detectLanguage(text);
    console.log('Detected language:', detectedLanguage);
    
    // If it's already English, return as is
    if (detectedLanguage.toLowerCase().includes('english')) {
      console.log('Text is already in English');
      return {
        originalText: text,
        translatedText: text,
        detectedLanguage: 'English',
        confidence: 1.0
      };
    }
    
    // Translate to English
    console.log('Translating to English...');
    const prompt = `Translate the following text to English. Respond with only the English translation, nothing else: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();
    
    console.log('Translation completed:', translatedText);
    
    return {
      originalText: text,
      translatedText: translatedText,
      detectedLanguage: detectedLanguage,
      confidence: 0.9 // High confidence for Gemini translations
    };
  } catch (error) {
    console.error('Error translating text:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    
    // Try simple fallback translation for common phrases
    const fallbackTranslation = getSimpleTranslation(text);
    if (fallbackTranslation.translatedText !== text) {
      console.log('Using fallback translation:', fallbackTranslation);
      return fallbackTranslation;
    }
    
    // Return original text if translation fails
    return {
      originalText: text,
      translatedText: text,
      detectedLanguage: 'Unknown',
      confidence: 0.0
    };
  }
}

/**
 * Enhanced search with translation support
 * This function translates the search query to English and searches with both original and translated terms
 */
export async function searchWithTranslation(
  searchQuery: string, 
  skills: any[]
): Promise<any[]> {
  try {
    // If search query is empty, return all skills
    if (!searchQuery.trim()) {
      return skills;
    }
    
    // Translate the search query to English
    const translationResult = await translateToEnglish(searchQuery);
    
    // Create search terms (original + translated)
    const searchTerms = [
      searchQuery.toLowerCase(),
      translationResult.translatedText.toLowerCase()
    ];
    
    // Remove duplicates
    const uniqueSearchTerms = [...new Set(searchTerms)];
    
    // Filter skills based on all search terms
    const filteredSkills = skills.filter(skill => {
      const searchableText = [
        skill.topic,
        skill.description,
        skill.category,
        skill.location,
        ...skill.skills
      ].join(' ').toLowerCase();
      
      // Check if any search term matches
      return uniqueSearchTerms.some(term => 
        searchableText.includes(term)
      );
    });
    
    return filteredSkills;
  } catch (error) {
    console.error('Error in search with translation:', error);
    // Fallback to original search if translation fails
    return skills.filter(skill => 
      skill.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }
}

/**
 * Get translation suggestions for common search terms
 */
export async function getTranslationSuggestions(text: string): Promise<string[]> {
  try {
    // Try different model names if the current one fails
    let model;
    const modelNames = [GEMINI_CONFIG.MODEL, 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
    
    for (const modelName of modelNames) {
      try {
        model = getGenAI().getGenerativeModel({ model: modelName });
        break;
      } catch (error) {
        if (modelName === modelNames[modelNames.length - 1]) {
          throw error;
        }
      }
    }
    
    if (!model) {
      throw new Error('Failed to initialize any Gemini model');
    }
    
    const prompt = `Given this text: "${text}", provide 3-5 alternative English search terms that might be relevant for finding educational courses or skills. Respond with only the terms separated by commas, no explanations.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text().trim().split(',').map(s => s.trim());
    
    return suggestions.filter(s => s.length > 0);
  } catch (error) {
    console.error('Error getting translation suggestions:', error);
    return [];
  }
}

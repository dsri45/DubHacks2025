# Gemini AI Translation Setup Guide

This guide will help you set up Google's Gemini AI for automatic translation of international user search queries to English.

## 🚀 Quick Setup

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Your App

#### Option A: Environment Variable (Recommended)
1. Create a `.env` file in your project root
2. Add your API key:
```bash
EXPO_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

#### Option B: Direct Configuration
1. Open `config/gemini.ts`
2. Replace `'your_gemini_api_key_here'` with your actual API key:
```typescript
API_KEY: 'your_actual_api_key_here',
```

### 3. Test the Integration

1. Start your app: `npx expo start`
2. Go to the Home/Dashboard tab
3. Try searching in different languages:
   - Spanish: "dibujo" (drawing)
   - French: "cuisine" (cooking)
   - German: "programmierung" (programming)
   - Chinese: "艺术" (art)

## 🌍 Supported Features

### Automatic Language Detection
- Detects the language of user input
- Shows detected language in the UI
- Only translates non-English queries

### Smart Translation
- Translates search queries to English
- Searches with both original and translated terms
- Provides fallback to simple search if translation fails

### Visual Feedback
- Shows "Translating..." indicator during processing
- Displays translation information when applicable
- Maintains smooth user experience

## 🔧 How It Works

1. **User types in any language** (e.g., "dibujo" in Spanish)
2. **Gemini detects the language** (Spanish)
3. **Translates to English** ("drawing")
4. **Searches with both terms** (finds skills matching "dibujo" OR "drawing")
5. **Shows results** with translation info

## 📱 User Experience

### Search Bar
- Placeholder: "Search skills... (supports multiple languages)"
- Real-time translation with 500ms debounce
- Visual indicators for translation status

### Translation Display
- Shows detected language and translation
- Example: "Translated from Spanish: 'drawing'"
- Styled with blue accent color

## 🛠️ Technical Details

### Files Modified
- `services/translationService.ts` - Core translation logic
- `config/gemini.ts` - API configuration
- `app/(tabs)/home.tsx` - UI integration

### Key Functions
- `detectLanguage()` - Identifies input language
- `translateToEnglish()` - Translates to English
- `searchWithTranslation()` - Enhanced search with translation
- `getTranslationSuggestions()` - Alternative search terms

### Performance
- 500ms debounced search to avoid excessive API calls
- Caching of translation results
- Fallback to simple search if API fails

## 🔒 Security Notes

- API key is stored securely
- No user data is logged or stored
- Translation happens client-side
- Respects Google's API usage limits

## 🐛 Troubleshooting

### Common Issues

1. **"API key not found" error**
   - Check your `.env` file or `config/gemini.ts`
   - Ensure the key is correct and active

2. **Translation not working**
   - Check your internet connection
   - Verify API key has proper permissions
   - Check console for error messages

3. **Slow translation**
   - This is normal for first-time translations
   - Subsequent searches should be faster
   - Consider implementing local caching

### Debug Mode
Enable debug logging by adding to your search:
```typescript
console.log('Translation result:', translationResult);
```

## 📊 API Usage

### Free Tier Limits
- 15 requests per minute
- 1 million tokens per day
- Sufficient for most applications

### Monitoring
- Check your usage at [Google AI Studio](https://makersuite.google.com/)
- Monitor for rate limiting
- Consider upgrading if needed

## 🚀 Future Enhancements

### Potential Improvements
- [ ] Cache translations locally
- [ ] Support for more languages
- [ ] Voice input translation
- [ ] Offline translation fallback
- [ ] Translation suggestions
- [ ] Multi-language skill descriptions

### Advanced Features
- [ ] Context-aware translation
- [ ] Domain-specific terminology
- [ ] User language preferences
- [ ] Translation quality scoring

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify your API key is correct
3. Test with simple English queries first
4. Check your internet connection

For more help, refer to:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)

---

**Happy translating! 🌍✨**

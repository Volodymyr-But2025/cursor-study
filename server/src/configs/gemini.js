import { GoogleGenAI } from '@google/genai'
import { ERROR_MESSAGES, HTTP_STATUS } from '../constants/messages.js'

const PLACEHOLDER_KEY = 'your_gemini_api_key_here'

const isApiKeyConfigured = (apiKey) =>
  Boolean(apiKey && apiKey !== PLACEHOLDER_KEY)

const stripCodeFences = (text = '') =>
  text.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '').trim()

export function buildBlogPrompt({ title, subTitle, category }) {
  const details = [
    `Title: ${title.trim()}`,
    subTitle?.trim() ? `Subtitle: ${subTitle.trim()}` : null,
    category?.trim() ? `Category: ${category.trim()}` : null
  ].filter(Boolean).join('\n')

  return `You are an expert blog writer. Write a complete article as HTML only.
Do not use markdown. Do not wrap the result in code fences.
Use only these tags: h2, h3, p, ul, ol, li, strong, em, blockquote.
Do not include an h1 or repeat the title as a heading.
Write 4 to 8 short sections with clear subheadings.

${details}`
}

async function generateBlogContent(prompt) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()

  if (!isApiKeyConfigured(apiKey)) {
    const error = new Error(ERROR_MESSAGES.AI_NOT_CONFIGURED)
    error.statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE
    throw error
  }

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt
  })

  return stripCodeFences(response.text)
}

export default generateBlogContent

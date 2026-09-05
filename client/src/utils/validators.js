export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.trim() !== ''
}

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}

export const validateUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isNonEmptyHtml = (html) => {
  if (!html || typeof html !== 'string') return false
  const trimmed = html.trim()
  if (!trimmed || trimmed === '<p><br></p>' || trimmed === '<p></p>') return false
  const text = trimmed.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
  return text.length > 0
}


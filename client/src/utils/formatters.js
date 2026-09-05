import Moment from 'moment'
import { toHtml } from './sanitizeHtml'

export const formatDate = (date) => {
  return Moment(date).format('MMMM Do YYYY')
}

export const formatRelativeTime = (date) => {
  return Moment(date).fromNow()
}

export const truncateText = (text, length = 80) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '...' : text
}

export const stripHtmlTags = (html) => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

export const truncateHtml = (html, length = 80) => {
  const stripped = stripHtmlTags(toHtml(html))
  return truncateText(stripped, length)
}


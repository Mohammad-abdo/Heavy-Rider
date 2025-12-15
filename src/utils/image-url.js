/**
 * Constructs a full image URL from a relative path
 * @param {string} imagePath - Relative or absolute image path from API
 * @returns {string} Full image URL or null if invalid
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Base URL for images (without /api/)
  const BASE_IMAGE_URL = 'https://heavy-ride.teamqeematech.site'

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath

  // Handle cases where path might already include base URL
  if (cleanPath.includes('heavy-ride.teamqeematech.site')) {
    return `https://${cleanPath}`
  }

  // Construct full URL
  return `${BASE_IMAGE_URL}/${cleanPath}`
}

/**
 * Gets a placeholder image URL or default avatar
 * @param {string} type - Type of placeholder (user, crane, etc.)
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (type = 'user') => {
  // You can use a placeholder service or local placeholder
  return `https://ui-avatars.com/api/?name=${type}&background=random&size=128`
}


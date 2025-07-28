import * as FileSystem from 'expo-file-system'

// Convert image to base64 for local storage (no Firebase Storage costs)
export const uploadImage = async uri => {
  try {
    console.log('Converting image to base64 for local storage...', { uri })
    
    // Validate file exists
    const fileInfo = await FileSystem.getInfoAsync(uri)
    if (!fileInfo.exists) {
      throw new Error('Selected image file does not exist')
    }
    
    // Check file size (limit to 2MB for base64 to avoid performance issues)
    if (fileInfo.size > 2 * 1024 * 1024) {
      throw new Error('Image file is too large (max 2MB for local storage)')
    }
    
    console.log('File info:', { size: fileInfo.size, exists: fileInfo.exists })
    
    // Convert to base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    })
    
    const dataUri = `data:image/jpeg;base64,${base64}`
    console.log('Base64 conversion successful, data URI length:', dataUri.length)
    
    return dataUri
  } catch (error) {
    console.error('Error converting image to base64:', {
      message: error.message,
      stack: error.stack
    })
    
    // Provide user-friendly error messages
    if (error.message.includes('too large')) {
      throw new Error('Image is too large. Please select a smaller image (max 2MB).')
    } else if (error.message.includes('does not exist')) {
      throw new Error('Selected image could not be found. Please try selecting another image.')
    }
    
    throw new Error('Failed to process image. Please try selecting another image.')
  }
}

import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase"

export const profileService = {
  // Get user profile
  getProfile: async (userId) => {
    try {
      const docSnapshot = await getDoc(doc(db, "users", userId))
      if (docSnapshot.exists()) {
        return { success: true, data: docSnapshot.data() }
      }
      return { success: false, message: "Profile not found" }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Update profile with picture URL
  updateProfile: async (userId, updates) => {
    try {
      await setDoc(
        doc(db, "users", userId),
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  // Compress image in Web Worker
  compressImage: async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement("canvas")
          let width = img.width
          let height = img.height

          // Resize to max 400x400
          const maxSize = 400
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height
              height = maxSize
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              resolve(blob)
            },
            "image/jpeg",
            0.8,
          )
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  },

  // Convert image to base64 for Firestore storage
  imageToBase64: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },
}

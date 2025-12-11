import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { setDoc, doc, getDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"

// Validate password complexity
const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};:'",.<>?]/.test(password)
  const isLengthValid = password.length >= 8

  return {
    isValid: hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLengthValid,
    errors: {
      length: !isLengthValid ? "Password must be at least 8 characters" : "",
      uppercase: !hasUpperCase ? "Password must contain at least one uppercase letter" : "",
      lowercase: !hasLowerCase ? "Password must contain at least one lowercase letter" : "",
      number: !hasNumbers ? "Password must contain at least one number" : "",
      special: !hasSpecialChar ? "Password must contain at least one special character" : "",
    },
  }
}

const getFirebaseErrorMessage = (error) => {
  console.error("[v0] Firebase error code:", error.code)

  switch (error.code) {
    case "auth/configuration-not-found":
      return "Firebase authentication is not configured. Please ensure Email/Password auth is enabled in Firebase Console."
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in instead."
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password."
    case "auth/invalid-email":
      return "Invalid email format."
    case "auth/user-not-found":
      return "No account found with this email."
    case "auth/wrong-password":
      return "Incorrect password."
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later."
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection."
    case "unavailable":
      return "Firebase service is temporarily unavailable. Please try again."
    default:
      return error.message || "An authentication error occurred."
  }
}

export const authService = {
  signup: async (email, password, username, displayName) => {
    try {
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          errors: passwordValidation.errors,
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: username,
        displayName: displayName || username,
        profilePicture: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          username: username,
          displayName: displayName || username,
        },
      }
    } catch (error) {
      const message = getFirebaseErrorMessage(error)
      console.error("[v0] Signup error:", error)
      return {
        success: false,
        message: message,
      }
    }
  },

  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Fetch user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid))
      const userData = userDoc.data()

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          username: userData?.username || "",
          displayName: userData?.displayName || "",
          profilePicture: userData?.profilePicture || null,
        },
      }
    } catch (error) {
      const message = getFirebaseErrorMessage(error)
      console.error("[v0] Login error:", error)
      return {
        success: false,
        message: message,
      }
    }
  },

  logout: async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  },

  getCurrentUser: () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid))
            const userData = userDoc.data()
            resolve({
              uid: user.uid,
              email: user.email,
              username: userData?.username || "",
              displayName: userData?.displayName || "",
              profilePicture: userData?.profilePicture || null,
            })
          } catch (error) {
            console.error("[v0] Error fetching user data:", error)
            resolve({
              uid: user.uid,
              email: user.email,
              username: "",
              displayName: "",
              profilePicture: null,
            })
          }
        } else {
          resolve(null)
        }
        unsubscribe()
      })
    })
  },

  updateUserProfile: async (uid, updates) => {
    try {
      await setDoc(
        doc(db, "users", uid),
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
}

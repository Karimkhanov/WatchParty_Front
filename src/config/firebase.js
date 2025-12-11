import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBTv-Qo-jcWo4-h8VQThxolu6n96gBNimg",
  authDomain: "endterm-w2g.firebaseapp.com",
  projectId: "endterm-w2g",
  storageBucket: "endterm-w2g.firebasestorage.app",
  messagingSenderId: "443439470076",
  appId: "1:443439470076:web:9e442ef2bdfe9a55b2ce79",
  measurementId: "G-Q21E3GEJF5",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

if (process.env.NODE_ENV === "development") {
  disableNetwork(db)
    .then(() => enableNetwork(db))
    .catch((err) => console.log("[v0] Firestore network error:", err))
}

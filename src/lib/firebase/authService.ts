import { auth, db } from "./clientApp";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "user" | "admin";
  points: number;
}

export async function signInWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // Create new user profile in Firestore
    const newUser: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "Usuario",
      photoURL: user.photoURL || "",
      role: "user",
      points: 0,
    };
    await setDoc(userDocRef, newUser);
    return newUser;
  }

  return userDoc.data() as UserProfile;
}

export async function logout() {
  await signOut(auth);
}

export function subscribeToAuthChanges(callback: (userProfile: UserProfile | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        callback(userDoc.data() as UserProfile);
      } else {
        // Fallback for edge cases where document isn't created yet
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          role: "user",
          points: 0
        });
      }
    } else {
      callback(null);
    }
  });
}

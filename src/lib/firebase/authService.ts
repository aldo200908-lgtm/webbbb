import { auth, db } from "./clientApp";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

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
  let unsubscribeDoc: (() => void) | null = null;
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (unsubscribeDoc) {
      unsubscribeDoc();
      unsubscribeDoc = null;
    }
    
    if (firebaseUser) {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      
      // Subscribe to real-time changes on the user's document (for points and role updates)
      unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data() as UserProfile);
        } else {
          // Fallback if doc is still creating
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || "",
            role: "user",
            points: 0
          });
        }
      });
    } else {
      callback(null);
    }
  });
}

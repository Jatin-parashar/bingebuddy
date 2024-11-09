import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  return signOut(auth);
}

export function googleSignIn() {
  const googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.setCustomParameters({
    prompt: "select_account",
  });
  return signInWithPopup(auth, googleAuthProvider);
}

export async function verifyEmail(user, actionCodeSettings) {
  return await sendEmailVerification(user, actionCodeSettings);
}

export async function updateUserProfile(user, profileData) {
  return await updateProfile(user, profileData);
}

export async function deleteCurrentUser(user) {
  return await deleteUser(user);
}

export async function resetPassword(email, actionCodeSettings) {
  return await sendPasswordResetEmail(auth, email, actionCodeSettings);
}

export async function signUp(email, password, name) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await verifyEmail(user, null);
  alert("Email Verification link shared to your email! Check your inbox.");

  let isVerified = false;
  const maxAttempts = 10;
  let attempts = 0;

  while (!isVerified && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await user.reload();
    isVerified = auth.currentUser?.emailVerified;
    attempts++;
  }

  if (!isVerified)
    throw new Error("Email verification failed. Please try again.");

  await updateProfile(user, { displayName: name });

  return user;
}

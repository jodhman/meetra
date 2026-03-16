import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

import { auth } from '@/lib/firebase/config';

export function getAuthErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    };
    return messages[code] ?? (error instanceof Error ? error.message : 'An error occurred.');
  }
  return error instanceof Error ? error.message : 'An error occurred.';
}

export async function signUp(email: string, password: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    throw new Error(getAuthErrorMessage(e));
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (e) {
    throw new Error(getAuthErrorMessage(e));
  }
}

export function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

export function subscribeToAuthStateChanged(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

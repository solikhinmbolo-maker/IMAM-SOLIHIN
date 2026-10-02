import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { ArsipItem, MasterSiswa, MasterGuru } from './types/arsip';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes('Quota limit exceeded') || message.includes('resource-exhausted') || message.includes('RESOURCE_EXHAUSTED')) {
    console.warn('[Firestore] Quota limit reached for free tier. Falling back to Supabase & local storage cache.');
    return {
      error: 'Quota limit exceeded',
      operationType,
      path,
      authInfo: { providerInfo: [] }
    };
  }

  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Notice: ', message);
  return errInfo;
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using cache.');
    }
    return true;
  }
}

// Realtime listeners for Arsip
export function subscribeToArsip(onUpdate: (items: ArsipItem[]) => void) {
  try {
    const colRef = collection(db, 'arsip');
    return onSnapshot(colRef, (snapshot) => {
      const list: ArsipItem[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as ArsipItem);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'arsip');
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'arsip');
    return () => {};
  }
}

// Realtime listeners for Master Siswa
export function subscribeToMasterSiswa(onUpdate: (items: MasterSiswa[]) => void) {
  try {
    const colRef = collection(db, 'master_siswa');
    return onSnapshot(colRef, (snapshot) => {
      const list: MasterSiswa[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as MasterSiswa);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'master_siswa');
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'master_siswa');
    return () => {};
  }
}

// Realtime listeners for Master Guru
export function subscribeToMasterGuru(onUpdate: (items: MasterGuru[]) => void) {
  try {
    const colRef = collection(db, 'master_guru');
    return onSnapshot(colRef, (snapshot) => {
      const list: MasterGuru[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as MasterGuru);
      });
      onUpdate(list);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'master_guru');
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'master_guru');
    return () => {};
  }
}

// Save Arsip to Firestore
export async function saveArsipToFirestore(item: ArsipItem): Promise<boolean> {
  try {
    const docRef = doc(db, 'arsip', item.id);
    
    // Create clean plain JS object with NO undefined values (undefined throws FirebaseError)
    const cleanData: Record<string, any> = {};
    Object.entries(item).forEach(([key, val]) => {
      if (val !== undefined) {
        cleanData[key] = val;
      }
    });

    // Ensure isTrash is explicitly boolean (true or false)
    cleanData.isTrash = Boolean(item.isTrash);
    if (!item.isTrash) {
      cleanData.deletedAt = null;
    }
    cleanData.updatedAt = new Date().toISOString();

    // Prevent Firestore 1MB document size limit error if base64 file is large
    if (typeof cleanData.fileDataUrl === 'string' && cleanData.fileDataUrl.length > 500000) {
      delete cleanData.fileDataUrl;
    }

    await setDoc(docRef, cleanData, { merge: true });
    return true;
  } catch (err) {
    console.error('saveArsipToFirestore Error:', err);
    handleFirestoreError(err, OperationType.WRITE, `arsip/${item.id}`);
    return false;
  }
}

// Delete Arsip from Firestore
export async function deleteArsipFromFirestore(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'arsip', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `arsip/${id}`);
    return false;
  }
}

// Save Master Siswa to Firestore
export async function saveSiswaToFirestore(siswa: MasterSiswa): Promise<boolean> {
  try {
    const docRef = doc(db, 'master_siswa', siswa.id || siswa.nisn);
    await setDoc(docRef, siswa, { merge: true });
    return true;
  } catch (err) {
    console.warn('saveSiswaToFirestore quota/write notice:', err);
    handleFirestoreError(err, OperationType.WRITE, `master_siswa/${siswa.id || siswa.nisn}`);
    return false;
  }
}

// Save Master Guru to Firestore
export async function saveGuruToFirestore(guru: MasterGuru): Promise<boolean> {
  try {
    const docRef = doc(db, 'master_guru', guru.id || guru.nuptk);
    await setDoc(docRef, guru, { merge: true });
    return true;
  } catch (err) {
    console.warn('saveGuruToFirestore quota/write notice:', err);
    handleFirestoreError(err, OperationType.WRITE, `master_guru/${guru.id || guru.nuptk}`);
    return false;
  }
}

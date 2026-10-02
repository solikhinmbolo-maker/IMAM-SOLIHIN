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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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
}

// Realtime listeners for Master Siswa
export function subscribeToMasterSiswa(onUpdate: (items: MasterSiswa[]) => void) {
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
}

// Realtime listeners for Master Guru
export function subscribeToMasterGuru(onUpdate: (items: MasterGuru[]) => void) {
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
}

// Save Arsip to Firestore
export async function saveArsipToFirestore(item: ArsipItem): Promise<boolean> {
  try {
    const docRef = doc(db, 'arsip', item.id);
    await setDoc(docRef, {
      ...item,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
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
    handleFirestoreError(err, OperationType.WRITE, `master_guru/${guru.id || guru.nuptk}`);
    return false;
  }
}

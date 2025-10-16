import { db } from '@/services/firebase/firebase'
import { collection, getDocs, orderBy, query, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore'

const COLLECTION = 'logs'

export async function getLogs() {
  // Check if db is available
  if (!db) {
    console.error('Firestore not available - configuration invalid')
    return []
  }
  
  const logsQuery = query(collection(db, COLLECTION), orderBy('timestamp', 'desc'))
  const snapshot = await getDocs(logsQuery)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function approveLogById(id) {
  // Check if db is available
  if (!db) {
    throw new Error('Firestore not available - configuration invalid')
  }
  
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, {
    notes: 'Approved',
    updated_at: serverTimestamp(),
  })
}

export async function rejectLogById(id) {
  // Check if db is available
  if (!db) {
    throw new Error('Firestore not available - configuration invalid')
  }
  
  const ref = doc(db, COLLECTION, id)
  await updateDoc(ref, {
    notes: 'Rejected',
    updated_at: serverTimestamp(),
  })
}

export async function addLog(entry) {
  // Check if db is available
  if (!db) {
    throw new Error('Firestore not available - configuration invalid')
  }
  
  await addDoc(collection(db, COLLECTION), {
    ...entry,
    timestamp: entry.timestamp || serverTimestamp(),
    updated_at: serverTimestamp(),
  })
}

export async function deleteLogById(id) {
  // Check if db is available
  if (!db) {
    throw new Error('Firestore not available - configuration invalid')
  }
  
  const ref = doc(db, COLLECTION, id)
  await deleteDoc(ref)
}
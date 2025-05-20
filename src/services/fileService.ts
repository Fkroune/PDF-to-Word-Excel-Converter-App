import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { FileRecord, ConversionFormat, User } from '../types';

// Initialize Firestore and Storage
const firestore = getFirestore();
const storage = getStorage();

// Upload a file to storage
export const uploadFile = async (file: File, userId: string): Promise<string> => {
  const storageRef = ref(storage, `uploads/${userId}/${uuidv4()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};

// Save file record to Firestore
export const saveFileRecord = async (
  userId: string,
  originalName: string,
  originalType: string,
  convertedFormat: ConversionFormat
): Promise<string> => {
  const fileRecord = {
    userId,
    originalName,
    originalType,
    convertedFormat,
    createdAt: Timestamp.now(),
    status: 'processing'
  };

  const docRef = await addDoc(collection(firestore, 'files'), fileRecord);
  return docRef.id;
};

// Update file record with converted file URL
export const updateFileRecord = async (fileId: string, downloadUrl: string): Promise<void> => {
  const docRef = collection(firestore, 'files').doc(fileId);
  await docRef.update({
    downloadUrl,
    status: 'completed'
  });
};

// Get user's file records
export const getUserFiles = async (userId: string): Promise<FileRecord[]> => {
  const filesQuery = query(
    collection(firestore, 'files'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(filesQuery);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      originalName: data.originalName,
      originalType: data.originalType,
      convertedFormat: data.convertedFormat,
      createdAt: data.createdAt.toMillis(),
      downloadUrl: data.downloadUrl,
      status: data.status
    };
  });
};

// Mock conversion function (in a real app, this would use actual conversion libraries)
export const convertFile = async (
  file: File, 
  format: ConversionFormat
): Promise<Blob> => {
  // This is a mock implementation
  // In a real application, you would use pdf-lib, docx, exceljs, etc. to perform the conversion
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a mock blob
  return new Blob([await file.arrayBuffer()], { type: format === 'docx' ? 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
};
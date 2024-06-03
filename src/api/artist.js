import { db, storage, getServerTimeStamp } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  orderBy,
  addDoc,
  where,
  getDocs,
  onSnapshot,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";

export const getArtists = (cb) => {
  const q = query(collection(db, "artists"), orderBy("name"));
  return onSnapshot(q, cb);
};

// export const getArtistByUid = (uid) => {
//   const q = query(
//     collection(db, "artists"),
//     where("userId", "==", uid)
//   );
//   return getDocs(q);
// };

export const findArtistByUserId = async (userId) => {
  try {
    const artistCollection = collection(db, 'artists');
    const q = query(artistCollection, where('userId', '==', userId));
    
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming userId is unique and there's only one matching document
      return querySnapshot.docs[0].data();
    } else {
      console.log('No matching document found');
      return null;
    }
  } catch (error) {
    console.error("Error finding artist by user ID:", error);
  }
}


export const addArtist = (data) => {
  data.createdAt = getServerTimeStamp();
  return addDoc(collection(db, "artists"), data);
};

export const uploadArtistToStorage = (file) => {
  const { name } = file;
  const storageRef = ref(storage, `artists-images/${name}`);
  return uploadBytesResumable(storageRef, file);
};

export const getArtistImageURL = (fileRef) => {
  return getDownloadURL(fileRef);
};

export const searchArtist = (name) => {
  const q = query(
    collection(db, "artists"),
    where("names", "array-contains", name)
  );
  return getDocs(q);
};

export const getArtistById = (id) => {
  const docRef = doc(db, "artists", id);
  return getDoc(docRef);
};

export const getRecentArtists = (l = 8) => {
  const q = query(
    collection(db, "artists"),
    orderBy("createdAt", "desc"),
    limit(l)
  );
  return getDocs(q);
};

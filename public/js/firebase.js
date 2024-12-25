// Import required Firebase modules from Firebase SDK v11.1.0
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

// Firebase configuration from Firebase Console
// const firebaseConfig = {
//   apiKey: 'YOUR_API_KEY',
//   authDomain: 'YOUR_AUTH_DOMAIN',
//   projectId: 'YOUR_PROJECT_ID',
//   storageBucket: 'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//   appId: 'YOUR_APP_ID',
// };

const firebaseConfig = {
    apiKey: "AIzaSyBZ-ncf_8tIETzDYjZS4_gRWrOHFvHvJuw",
    authDomain: "housing-c48e1.firebaseapp.com",
    projectId: "housing-c48e1",
    storageBucket: "housing-c48e1.firebasestorage.app",
    messagingSenderId: "242188841775",
    appId: "1:242188841775:web:e033e52e22bf6cd6d327da",
    databaseURL: "https://housing-c48e1-default-rtdb.firebaseio.com"
  };

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore instance
const auth = getAuth(app); // Authentication instance

// Collections for "Enquiry" and "Property"
const enquiriesCollection = collection(db, "Enquiry");
const propertiesCollection = collection(db, "Property");

// Function to add a property to Firestore
export const addProperty = async (propertyData) => {
  try {
    const docRef = await addDoc(propertiesCollection, propertyData);
    time: serverTimestamp()
    console.log("Property added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document to Property collection: ", e);
  }
};

// Function to add an enquiry to Firestore
export const addEnquiry = async (enquiryData) => {
  try {
    const docRef = await addDoc(enquiriesCollection, enquiryData);
    console.log("Enquiry added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document to Enquiry collection: ", e);
  }
};

// Function to get all properties from Firestore
export const getProperties = async () => {
  const querySnapshot = await getDocs(propertiesCollection);
  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  return properties;
};

// Function to get all enquiries from Firestore
export const getEnquiries = async () => {
  const querySnapshot = await getDocs(enquiriesCollection);
  const enquiries = [];
  querySnapshot.forEach((doc) => {
    enquiries.push({ id: doc.id, ...doc.data() });
  });
  return enquiries;
};

// Function to delete a property from Firestore
export const deleteProperty = async (propertyId) => {
  try {
    await deleteDoc(doc(db, "Property", propertyId));
    console.log("Property deleted");
  } catch (e) {
    console.error("Error deleting property: ", e);
  }
};

// Function to delete an enquiry from Firestore
export const deleteEnquiry = async (enquiryId) => {
  try {
    await deleteDoc(doc(db, "Enquiry", enquiryId));
    console.log("Enquiry deleted");
  } catch (e) {
    console.error("Error deleting enquiry: ", e);
  }
};

// Firebase Authentication - Sign in and Sign out
export const login = async (email, password) => {
    const auth = getAuth();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // If login is successful, return user data
      return user;
    } catch (error) {
      // Check for Firebase Authentication error codes and return a specific message
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('No user found with this email');
      } else {
        throw new Error('An error occurred during sign-in');
      }
    }
  };

export const logout = () => {
  signOut(auth).then(() => {
    console.log('Logged out');
    window.location.href = 'Signin.html';
  }).catch((error) => {
    console.error('Error logging out: ', error);
  });
};
export const signup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed up: ', user);
      return user;
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error; // Re-throw error so it can be caught in the calling function
    }
  };

  // Function to get all properties from Firestore
export const getAllProperties = async () => {

  const propertiesCollection = collection(db, "Property");
  const querySnapshot = await getDocs(propertiesCollection);
  const properties = [];
  querySnapshot.forEach((doc) => {
    properties.push({ id: doc.id, ...doc.data() });
  });
  return properties;
};

// Function to get properties with pid = "best"
export const getBestProperties = async () => {
  const propertiesCollection = collection(db, "Property");
  const querySnapshot = await getDocs(propertiesCollection);
  const bestProperties = [];
  querySnapshot.forEach((doc) => {
    const property = doc.data();
    if (property.pid === "Best") {
      bestProperties.push({ id: doc.id, ...property });
    }
  });
  return bestProperties;
};

// Function to get a property by its ID
export const getPropertyById = async (id) => {
  const docRef = doc(db, "Property", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.error("No such document!");
    return null;
  }
};

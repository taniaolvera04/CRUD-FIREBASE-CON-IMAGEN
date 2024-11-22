import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";


import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCh3rTEKIFUc0rzOIO75Xqv0DoQ0Nbcv54",
  authDomain: "crud-63249.firebaseapp.com",
  projectId: "crud-63249",
  storageBucket: "crud-63249.firebasestorage.app",
  messagingSenderId: "752560231577",
  appId: "1:752560231577:web:e38f7847d1cfb4169c9408",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Función para validar datos
const validateData = (data) => {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error("Los datos están vacíos o no son válidos.");
  }

  for (const key in data) {
    if (!data[key]) {
      throw new Error(`El campo "${key}" está vacío.`);
    }
  }
};

// Funciones CRUD para la colección 'cecylovers'

// Agregar un contacto
export const addContacto = async (contacto) => {
  validateData(contacto); // Validar datos antes de agregar
  try {
    const docRef = await addDoc(collection(db, "cecylovers"), contacto);
    console.log("Contacto agregado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar contacto:", error.message);
    throw error;
  }
};

// Obtener todos los contactos
export const getContactosCollection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "cecylovers"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener contactos:", error.message);
    throw error;
  }
};

// Eliminar un contacto
export const deleteContactoCollection = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("El ID no es válido.");
  }
  try {
    await deleteDoc(doc(db, "cecylovers", id));
    console.log("Contacto eliminado con ID:", id);
  } catch (error) {
    console.error("Error al eliminar contacto:", error.message);
    throw error;
  }
};

// Obtener un contacto por ID
export const getContactoCollection = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("El ID no es válido.");
  }
  try {
    const docRef = doc(db, "cecylovers", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("El documento no existe.");
    }
  } catch (error) {
    console.error("Error al obtener contacto:", error.message);
    throw error;
  }
};

// Actualizar un contacto
export const updateContactoCollection = async (id, data) => {
  if (!id || typeof id !== "string") {
    throw new Error("El ID no es válido.");
  }
  validateData(data); // Validar datos antes de actualizar
  try {
    const contactoRef = doc(db, "cecylovers", id);
    await updateDoc(contactoRef, data);
    console.log("Contacto actualizado con ID:", id);
  } catch (error) {
    console.error("Error al actualizar contacto:", error.message);
    throw error;
  }
};




// Función para subir una imagen a Firebase Storage
export const subirImagen = async (archivo) => {
  try {
    // Referencia al archivo en la carpeta 'imagenes'
    const storageRef = ref(storage, `imagenes/${archivo.name}`);
    // Sube el archivo al almacenamiento
    await uploadBytes(storageRef, archivo);
    // Obtiene la URL de descarga del archivo
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};

export const eliminarImagen = async (imagenUrl) => {
  try {
    // Verifica si la URL es de Firebase Storage
    if (imagenUrl.includes("firebaseapp.com")) {
      const storage = getStorage();
      const archivoRef = ref(storage, imagenUrl); // Referencia al archivo en Firebase Storage
      await deleteObject(archivoRef); // Elimina el archivo
      console.log('Imagen eliminada con éxito');
    } else {
      console.log('La URL no es válida para eliminar en Firebase Storage');
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
  }
};
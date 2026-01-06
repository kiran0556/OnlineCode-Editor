import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";

const app = initializeApp({ /* your config */ });
const db = getFirestore(app);

export async function saveSnippet({ html, css, js }) {
  const col = collection(db, "snippets");
  const docRef = await addDoc(col, { html, css, js, createdAt: Date.now() });
  return docRef.id;
}

export async function loadSnippet(id) {
  const d = await getDoc(doc(db, "snippets", id));
  return d.exists() ? d.data() : null;
}

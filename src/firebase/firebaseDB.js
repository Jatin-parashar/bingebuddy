import {
  ref,
  set,
  get,
  child,
  remove,
  update,
  getDatabase,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "./firebase";

export async function writeData(path, data) {
  return await set(ref(db, path), data);
}

export const fetchData = async (path) => {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, path));
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};

export function listenForValueEvents(path, callback) {
  const dataRef = ref(db, path);

  const unsubscribe = onValue(
    dataRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening for value events:", error);
    }
  );

  return unsubscribe;
}

export async function updateData(dataPaths) {
  return await update(ref(db), dataPaths);
}

export function deleteData(paths) {
  if (typeof paths === "string") {
    return remove(ref(db, paths));
  }
  if (Array.isArray(paths)) {
    const updates = {};
    paths.forEach((path) => {
      updates[path] = null;
    });
    return update(ref(db), updates);
  }

  throw new Error(
    "Invalid input: paths should be a string or an array of strings."
  );
}

export async function appendToListWithKey(path, data, key = null) {
  const listRef = ref(db, path);
  const itemRef = key ? ref(db, `${path}/${key}`) : push(listRef);
  return await set(itemRef, data);
}

export async function getItemByField(path, field, value) {
  const refPath = ref(db, path);

  const fieldQuery = query(refPath, orderByChild(field), equalTo(value));

  const snapshot = await get(fieldQuery);
  return snapshot.exists() ? snapshot.val() : null;
}

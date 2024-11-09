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
import { db } from "../firebase/firebase";
// import { getDatabase, ref, remove, update } from "firebase/database";
// import { getDatabase, ref, update, push, child } from "firebase/database";
// import { getDatabase, ref, push, set } from "firebase/database";
// import { db } from "../../firebase";

/**
 * Write/Overwrite data to Firebase Realtime Database at a specified path.
 * @param {string} path - Path in the database to save data (e.g., "users/userId").
 * @param {object} data - Data object to save at the specified path.
 * @returns {Promise<void>} - A Promise that resolves when the data is successfully written.
 */
export async function writeData(path, data) {
  try {
    await set(ref(db, path), data);
    // console.log("Data written successfully to path:", path);
  } catch (error) {
    console.error("Error writing data:", error);
    throw error;
  }
}

// Example usage:
// writeData(`users/${userId}`, {
//   username: "JohnDoe",
//   email: "johndoe@example.com",
//   profile_picture: "https://example.com/johndoe.jpg"
// })
//   .then(() => {
//     console.log("User data saved successfully.");
//   })
//   .catch((error) => {
//     console.error("Error saving user data:", error);
//   });

/**
 * Fetch data from Firebase Realtime Database.
 * @param {string} path - Path in the database to the data (e.g., "users/userId").
 * @returns {Promise<any>} - A Promise that resolves with the data if found, or null if no data exists.
 */
export const fetchData = async (path) => {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, path));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      // console.log("No data available at path:", path);
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Example usage:
// fetchData(`users/${userId}`)
//   .then((data) => {
//     if (data) {
//       console.log("Fetched data:", data);
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

/**
 * Listen for real-time updates to data at a specified path in Firebase Realtime Database.
 * @param {string} path - Path in the database to listen for changes (e.g., "posts/postId/starCount").
 * @param {function} callback - Function to handle the data snapshot. Receives data from the snapshot as an argument.
 * @returns {function} - Returns a function to unsubscribe from the listener when called.
 */
export function listenForValueEvents(path, callback) {
  const dataRef = ref(db, path);

  const unsubscribe = onValue(
    dataRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        // console.log("No data available at path:", path);
        callback(null);
      }
    },
    (error) => {
      console.error("Error listening for value events:", error);
    }
  );

  return unsubscribe;
}

// // Example usage:
// const unsubscribe = listenForValueEvents(`posts/${postId}/starCount`, (data) => {
//   if (data !== null) {
//     updateStarCount(postElement, data);
//   }
// });

// // To stop listening, call unsubscribe when needed.
// unsubscribe();

/**
 * Write new data to multiple locations in Firebase Realtime Database.
 * @param {object} dataPaths - An object where keys are database paths and values are the data to write at each path.
 * @returns {Promise<void>} - A Promise that resolves when the data is successfully written.
 */
export function updateData(dataPaths) {
  const db = getDatabase();
  return update(ref(db), dataPaths)
    .then(() => {
      // console.log("Data updated successfully.");
    })
    .catch((error) => {
      console.error("Error updating data:", error);
      throw error;
    });
}

// /**
//  * Create a new post and simultaneously update it in multiple database locations.
//  * @param {string} uid - User ID of the post author.
//  * @param {string} username - Username of the post author.
//  * @param {string} picture - URL of the author's profile picture.
//  * @param {string} title - Title of the post.
//  * @param {string} body - Body content of the post.
//  * @returns {Promise<void>} - A Promise that resolves when the post data is written to both locations.
//  */
// function writeNewPost(uid, username, picture, title, body) {
//   const db = getDatabase();

//   // Define the new post data.
//   const postData = {
//     author: username,
//     uid: uid,
//     body: body,
//     title: title,
//     starCount: 0,
//     authorPic: picture,
//   };

//   // Generate a unique key for the new post.
//   const newPostKey = push(child(ref(db), 'posts')).key;

//   // Set up paths for simultaneous updates (data fan-out).
//   const updates = {
//     [`/posts/${newPostKey}`]: postData,
//     [`/user-posts/${uid}/${newPostKey}`]: postData,
//   };

//   // Perform the update.
//   return updateData(updates);
// }

// // Example usage of writeNewPost:
// writeNewPost("user123", "JohnDoe", "https://example.com/johndoe.jpg", "My First Post", "Hello, world!")
//   .then(() => {
//     console.log("New post created and updated successfully.");
//   })
//   .catch((error) => {
//     console.error("Error creating new post:", error);
//   });

/**
 * Delete data at a specified path in Firebase Realtime Database.
 * @param {string|string[]} paths - A single path (string) or an array of paths (strings) to delete.
 * @returns {Promise<void>} - Resolves when the deletion is successful.
 */
export function deleteData(paths) {
  const db = getDatabase();

  // If `paths` is a single path, use `remove()` to delete it.
  if (typeof paths === "string") {
    return remove(ref(db, paths))
      // .then(() => console.log(`Data at path '${paths}' deleted successfully.`))
      .catch((error) => {
        // console.error(`Error deleting data at path '${paths}':`, error);
        throw error;
      });
  }

  // If `paths` is an array of paths, use `update()` with `null` values to delete them.
  if (Array.isArray(paths)) {
    const updates = {};
    paths.forEach((path) => {
      updates[path] = null;
    });

    return update(ref(db), updates)
      // .then(() => console.log("Data at multiple paths deleted successfully."))
      .catch((error) => {
        // console.error("Error deleting data at multiple paths:", error);
        throw error;
      });
  }

  throw new Error(
    "Invalid input: paths should be a string or an array of strings."
  );
}

// Example usage:
// Deleting a single path
// deleteData("/users/user123");

// // Deleting multiple paths
// deleteData(["/posts/post123", "/users/user123/friends/friend456"]);

/**
 * Append data to a list in Firebase Realtime Database.
 * @param {string} path - The path where the new item should be appended (e.g., "posts").
 * @param {object} data - The data object to append to the list.
 * @returns {Promise<string>} - Resolves with the unique key of the new item.
 */
export async function appendToList(path, data) {
  const db = getDatabase();
  const listRef = ref(db, path);

  // Generate a new reference with a unique key.
  const newItemRef = push(listRef);

  // Set the data at the new reference.
  return set(newItemRef, data)
    .then(() => {
      // console.log(`Data appended to '${path}' with key:`, newItemRef.key);
      return newItemRef.key; // Return the unique key of the new item.
    })
    .catch((error) => {
      console.error("Error appending data:", error);
      throw error;
    });
}
// Example usage:
// appendToList("posts", {
//   author: "JohnDoe",
//   title: "My New Post",
//   body: "This is the content of the post.",
//   timestamp: Date.now(),
// })
//   .then((key) => {
//     console.log("New post added with key:", key);
//   })
//   .catch((error) => {
//     console.error("Error adding post:", error);
//   });

export async function getReviewByEmail(path, targetEmail) {
  const reviewRef = ref(db, path);

  // Create a query to find reviews with the specific email
  const emailQuery = query(
    reviewRef,
    orderByChild("email"),
    equalTo(targetEmail)
  );

  try {
    const snapshot = await get(emailQuery);
    if (snapshot.exists()) {
      // console.log("Review is already present");
      return true;
    } else {
      // console.log("No review found for the specified email.");
      return false;
    }
  } catch (error) {
    console.error("Error fetching review:", error);
    throw error;
  }
}

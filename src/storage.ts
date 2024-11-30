const initializeDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("FileSystemDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("fileSystemQManager")) {
          db.createObjectStore("fileSystemQManager", { keyPath: "id" }); // `id` will be used as the key
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };
  
  

  export const saveFileSystemQManagerToDB = async (fileSystemQManager) => {
    try {
      const db = await initializeDB();
      const transaction = db.transaction("fileSystemQManager", "readwrite");
      const store = transaction.objectStore("fileSystemQManager");
  
      // Clear existing data
      store.clear();
  
      // Save new data
      store.put({ id: 1, data: fileSystemQManager });
  
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve("FileSystemQManager saved successfully");
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error("Error saving fileSystemQManager to IndexedDB:", error);
    }
  };
  
  
  export const getFileSystemQManagerFromDB = async () => {
    try {
      const db = await initializeDB();
      const transaction = db.transaction("fileSystemQManager", "readonly");
      const store = transaction.objectStore("fileSystemQManager");
  
      return new Promise((resolve, reject) => {
        const request = store.get(1);
  
        request.onsuccess = (event) => {
          if (event.target.result) {
            resolve(event.target.result.data);
          } else {
            resolve(null); // No data found
          }
        };
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error("Error retrieving fileSystemQManager from IndexedDB:", error);
    }
  };
  
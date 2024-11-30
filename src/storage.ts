const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("FileSystemDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("fileSystemQManager")) {
        // Create object store with `address` as the keyPath
        db.createObjectStore("fileSystemQManager", { keyPath: "address" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

  

  export const saveFileSystemQManagerToDB = async ( fileSystemQManager, address) => {
    try {
      const db = await initializeDB();
      const transaction = db.transaction("fileSystemQManager", "readwrite");
      const store = transaction.objectStore("fileSystemQManager");
  
      // Save or update data for the specific address
      store.put({ address, data: fileSystemQManager });
  
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(`FileSystemQManager for address ${address} saved successfully`);
        transaction.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error("Error saving fileSystemQManager to IndexedDB:", error);
    }
  };
  
  export const getFileSystemQManagerFromDB = async (address) => {
    try {
      const db = await initializeDB();
      const transaction = db.transaction("fileSystemQManager", "readonly");
      const store = transaction.objectStore("fileSystemQManager");
  
      return new Promise((resolve, reject) => {
        const request = store.get(address);
  
        request.onsuccess = (event) => {
          if (event.target.result) {
            resolve(event.target.result.data);
          } else {
            resolve(null); // No data found for this address
          }
        };
        request.onerror = (event) => reject(event.target.error);
      });
    } catch (error) {
      console.error("Error retrieving fileSystemQManager from IndexedDB:", error);
    }
  };
  
  
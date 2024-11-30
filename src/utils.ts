export function objectToBase64(obj: Object) {
	// Step 1: Convert the object to a JSON string
	const jsonString = JSON.stringify(obj)
	// Step 2: Create a Blob from the JSON string
	const blob = new Blob([jsonString], { type: 'application/json' })
	// Step 3: Create a FileReader to read the Blob as a base64-encoded string
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => {
			if (typeof reader.result === 'string') {
				// Remove 'data:application/json;base64,' prefix
				const base64 = reader.result.replace(
					'data:application/json;base64,',
					''
				)
				resolve(base64)
			} else {
				reject(new Error('Failed to read the Blob as a base64-encoded string'))
			}
		}
		reader.onerror = () => {
			reject(reader.error)
		}
		reader.readAsDataURL(blob)
	})
}

export function base64ToUint8Array(base64: string) {
    const binaryString = atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes
  }

  export function uint8ArrayToObject(uint8Array: Uint8Array) {
    // Decode the byte array using TextDecoder
    const decoder = new TextDecoder()
    const jsonString = decoder.decode(uint8Array)

    // Convert the JSON string back into an object
    const obj = JSON.parse(jsonString)

    return obj
  }


  export const handleImportClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.base64,.txt';

    // Create a promise to handle file selection and reading synchronously
    return await new Promise((resolve, reject) => {
      fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result); // Resolve with the file content
        };
        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };

        reader.readAsText(file); // Read the file as text (Base64 string)
      };

      // Trigger the file input dialog
      fileInput.click();
    });

  }


  class Semaphore {
	constructor(count) {
		this.count = count
		this.waiting = []
	}
	acquire() {
		return new Promise(resolve => {
			if (this.count > 0) {
				this.count--
				resolve()
			} else {
				this.waiting.push(resolve)
			}
		})
	}
	release() {
		if (this.waiting.length > 0) {
			const resolve = this.waiting.shift()
			resolve()
		} else {
			this.count++
		}
	}
}

  let semaphore = new Semaphore(1)
let reader = new FileReader()

export const fileToBase64 = (file) => new Promise(async (resolve, reject) => {
	if (!reader) {
		reader = new FileReader()
	}
	await semaphore.acquire()
	reader.readAsDataURL(file)
	reader.onload = () => {
		const dataUrl = reader.result
		if (typeof dataUrl === "string") {
			const base64String = dataUrl.split(',')[1]
			reader.onload = null
			reader.onerror = null
			resolve(base64String)
		} else {
			reader.onload = null
			reader.onerror = null
			reject(new Error('Invalid data URL'))
		}
		semaphore.release()
	}
	reader.onerror = (error) => {
		reader.onload = null
		reader.onerror = null
		reject(error)
		semaphore.release()
	}
})
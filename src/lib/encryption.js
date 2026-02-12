// holy this was from so long ago...man i loved obfuscating early 7th grade

/*

docs

important! i didnt implement padding thing yet so if you give it a key that isnt 32 bytes or something its gonna break

encryption.sha_256(value)
    asynchronous function that returns hashed value

encryption.aes_256
    this is here cause i copied the entire encryption object

encryption.aes_256.encrypt(value, key)
    asynchronous, returns encrypted value

*/

const encryption = {
  stringToUint8Array: e => new TextEncoder().encode(e),

  padKey: (e, t) => {
    if (e.length >= t) return e.slice(0, t);
    const r = crypto.getRandomValues(new Uint8Array(t - e.length));
    return new Uint8Array([...e, ...r]);
  },

  sha_256: async e => {
    const t = new TextEncoder().encode(e);
    const r = await crypto.subtle.digest("SHA-256", t);
    return Array.from(new Uint8Array(r))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  },

  aes_256: {
    encrypt: async (plaintext, keyStr) => {
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const keyBytes = encryption.stringToUint8Array(keyStr);
      const key = encryption.padKey(keyBytes, 32);

      const importedKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
      );

      const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        importedKey,
        encryption.stringToUint8Array(plaintext)
      );

      const combined = new Uint8Array([...iv, ...new Uint8Array(ciphertext)]);
      return btoa(String.fromCharCode(...combined));
    },

    decrypt: async (base64Cipher, keyStr) => {
      const combined = new Uint8Array(atob(base64Cipher).split("").map(c => c.charCodeAt(0)));
      const iv = combined.slice(0, 16);
      const ciphertext = combined.slice(16);

      const keyBytes = encryption.stringToUint8Array(keyStr);
      const key = encryption.padKey(keyBytes, 32);

      const importedKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "AES-CBC" },
        false,
        ["encrypt", "decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        importedKey,
        ciphertext
      );

      return new TextDecoder().decode(decrypted);
    }
  }
};

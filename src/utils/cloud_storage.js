const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env');
const url = require('url');
const { v4: uuidv4 } = require('uuid');
// Token de descarga de Firebase. Se genera una sola vez al cargar el módulo,
// por lo que todos los archivos subidos mientras corre el servidor comparten el mismo token.
const uuid = uuidv4();

// Cliente de Google Cloud Storage autenticado con la cuenta de servicio del archivo serviceAccountKey.json
// (ruta relativa al directorio desde el que se inicia el servidor).
const storage = new Storage({
  projectId: 'fir-mvvm-237fb',
  keyFilename: './serviceAccountKey.json',
});

// Bucket de Firebase Storage donde se guardan las imágenes.
const bucket = storage.bucket('gs://fir-mvvm-237fb.appspot.com/');

/**
 * Sube un archivo a Firebase Storage y resuelve con su URL pública de descarga.
 * @param file Archivo recibido por Multer; se sube su contenido en memoria (file.buffer).
 * @param pathImage Nombre/ruta con el que se guarda en el bucket. Si ya existe, se sobrescribe.
 * Rechaza la promesa si la subida falla. Si pathImage está vacío, la promesa nunca se resuelve.
 * Todos los archivos se guardan con contentType 'image/png', sin importar su tipo real.
 */
module.exports = (file, pathImage) => {
  return new Promise((resolve, reject) => {
    if (pathImage) {
      if (pathImage != null || pathImage != undefined) {
        let fileUpload = bucket.file(`${pathImage}`);
        // Stream de escritura hacia el bucket. resumable: false sube el archivo en una sola petición.
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: uuid,
            },
          },
          resumable: false,
        });

        blobStream.on('error', (error) => {
          console.log('Error al subir archivo a firebase', error);
          reject('Something is wrong! Unable to upload at the moment.');
        });

        // Al terminar la subida construye la URL pública de descarga (incluye el token).
        blobStream.on('finish', () => {
          const url = format(
            `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`,
          );
          console.log('URL DE CLOUD STORAGE ', url);
          resolve(url);
        });

        // Escribe el contenido del archivo y cierra el stream, lo que dispara la subida.
        blobStream.end(file.buffer);
      }
    }
  });
};

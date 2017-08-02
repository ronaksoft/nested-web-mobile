/**
 * @file utils/picture.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc generates a base64 url of image file
 * @export {FileUtil}
 * Documented by: robzizo
 * Date of documentation:  2017-08-01
 * Reviewed by:            -
 * Date of review:         -
 */

/**
 * resize the uploaded image and make data url of it
 * and rejects the files are not image
 * @class Picture
 */
class Picture {
   /**
    * Draw image into canvas and with canvas prototypes converts it toDataURL
    * @static
    * @param {File} file
    * @returns {string} data url of image
    * @async
    * @memberOf Picture
    */
   public static resize(file: File) {
     if (!Picture.isImage(file)) {
       return Promise.reject(Error('The file is not an image!'));
     }

     return new Promise((resolve) => {
      const reader = new Image();

      reader.onload = () => {
        // resize the image
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        context.drawImage(reader, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg'));
      };

      reader.src = URL.createObjectURL(file);
    });
   }

   public static isImage(file: File) {
     return file.type.startsWith('image');
   }
}

export default Picture;

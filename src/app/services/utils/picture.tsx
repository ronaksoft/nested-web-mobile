class Picture {
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

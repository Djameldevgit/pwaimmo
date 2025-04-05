/*export const checkImage = (file) => {
    let err = ""
    if(!file) return err = "File does not exist."

    if(file.size > 1024 * 1024) // 1mb
    err = "The largest image size is 1mb."

    if(file.type !== 'image/jpeg' && file.type !== 'image/png' )
    err = "Image format is incorrect."
    
    return err;
}*/
export const checkImage = (files) => {
  let err = "";
  if (!files || files.length === 0) return err = "No files selected.";

  // Limitar a un máximo de 3 imágenes
  if (files.length > 3) {
    err = "You can only upload up to 3 images.";
    return err;
  }

  const allowedExtensions = ['jpeg', 'jpg', 'png'];
  const blockedExtensions = ['txt', 'pdf']; // Agregar aquí las extensiones bloqueadas

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 1024 * 1024) {
      err = "The largest image size is 1mb.";
      return err;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      err = "Image format is incorrect.";
      return err;
    }

    if (blockedExtensions.includes(fileExtension)) {
      err = "File type not allowed.";
      return err;
    }
  }

  return err;
};

  

export const imageUpload = async (images) => {
    let imgArr = [];
    for(const item of images){//fpr corre todas las imagenes que se han enviado a la funcion
        const formData = new FormData()//es como un paquete qui contendra las imagenes o imagen como la informacion
        //necesaria para cloudinary como informacion propia 

        if(item.camera){
            formData.append("file", item.camera)//aqui file es la imagen solo que agrega como un campo llamado fule
        }else{
            formData.append("file", item)
        }
        
        formData.append("upload_preset", "xl7nhfgx")//clave predefinida por cloudinary  para poder subir las imagenes 
        formData.append("cloud_name", "arteeeuhgu")// el  nombtre de mi cuenta
//cuando el form data ha empaquetado los datos necesarios se envian con fetch a cloudinary esperando una respuesta
        const res = await fetch("https://api.cloudinary.com/v1_1/arteeeuhgu/image/upload", {
            method: "POST",
            body: formData
        })
        
        const data = await res.json()//cuando se obtiene la respuesta 
        imgArr.push({public_id: data.public_id, url: data.secure_url})//se extare la informacion de data y 
        //se guarda en imgArr, es decir desde data.pblic_id y el secure_ url se extrae desde data en url para poder guardarlos en imgArr
    }
    return imgArr;
}

/*En resumen, el proceso es muy similar a un "paquete" que contiene tanto los archivos (las imágenes) como los datos necesarios para que el servidor de Cloudinary sepa cómo procesarlos correctamente. fetch se encarga de enviar este paquete al servidor, y Cloudinary responde con la información de la imagen subida.*/
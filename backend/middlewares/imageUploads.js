const multer = require("multer");
const path = require("path");

// Destino da image store
const imageStore = multer.diskStorage({

   destination: (req, file, cb) => {

      let folder = ""

      if(req.baseUrl.includes("users")) {
         folder = "users";

      } else if(req.baseUrl.includes("photos")) {
         folder = "photos";

      }

      cb(null, `upload/${folder}/`)
   },

   filename: (req, file, cb) => {

      cb(null, Date.now() + path.extname(file.originalname)) 

   },
})

// Validações de upload de imagens
const imageUpload = multer({
   storage: imageStore,

   // verifica a extensão do arquivo
   fileFilter(req, file, cb) {
      if (file.originalname.match(/\.(pnag|jpg)$/)) {

         // Fazer uplaod somente de png ou jpg
         return cb(new Error("Por favor, envie apenas png ou jpg!"))
      }
      cb(undefined, true)
   },
});

module.exports = { imageUpload };
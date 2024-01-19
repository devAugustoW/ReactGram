const { body } = require("express-validator");

const photoInsertValidation = () => {
  return [
      body("title")
         .not()
         .equals("undefined")
         .withMessage("O título é obrigatório")
         .isString()
         .withMessage("O título é obrigatório")
         .isLength({ min: 3 })
         .withMessage("O nome precisa ter no mínimo 3 caracteres."),

      body("image").custom((value, { req }) => {
         if (!req.file) {
         throw new Error("A imagem é obrigatória");
         }
      return true;
    }),
  ];
};

// Validaador de update de photo
const photoUpdateValidation = () => {
  return [
    body("image")
      .optional()
      .custom((value, { req }) => {
        if (!req.file) {
          throw new Error("A imagem é obrigatória");
        }
        return true;
      }),
    body("title")
      .optional()
      .isString()
      .withMessage("O título é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres."),
  ];
};

// Validador de comentário da photo
const commentValidation = () => {
  return [ body("comment").isString().withMessage("O comentário é obrigatório.") ]
}

module.exports = {
   photoInsertValidation,
   photoUpdateValidation,
   commentValidation,
 };
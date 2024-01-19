const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Funções de inserir foto
const insertPhoto = async (req, res) => {
   const { title } = req.body;
   const image = req.file.filename;
 
   const reqUser = req.user;

   const user = await User.findById(reqUser._id);

   console.log(user.name);

   // Criação da entidade foto 
   const newPhoto = await Photo.create({
      image,
      title,
      userId: user._id,
      userName: user.name,
   });

   // verificar se a foto foi criado com sucesso
   if (!newPhoto) {
      res.status(422).json({
        errors: ["Houve um erro, por favor tente novamente mais tarde."],
      });
      return;

   }
   res.status(201).json(newPhoto);
}

// Função de Remover photo do BD
const deletePhoto = async(req, res) => {
   const {id} = req.params 
   const reqUser = req.user

   try {

      const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

      // checar se a foto existe
      if (!photo) {
         res.status(404).json({ errors: ["Foto não encontrada! 1"] });
         return;
       }

      // Checar se a photo é do próprio usuário
      if (!photo.userId.equals(reqUser.id)) {
         res.status(422)
            .json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
         });
      }

      res.status(200).json({id: photo._id, message: "Foto excluída com sucesso."});

   } catch (error) {

      res.status(404).json({errors: ["foto não encontrada! 2"]})   
      return;   

   }
   
};

// Função para resgatar todas as fotos
const getAllPhotos = async (req, res) => {

   const photos = await Photo.find({})
                           .sort([["createdAt", -1]])
                           .exec()

   return res.status(200).json(photos);
};

// Função para resgatar as fotos do usuário
const getUserPhotos = async(req, res) => {
   const { id } = req.params;

   const photos = await Photo.find({userId: id})
      .sort([["createdAt", -1]])   
      .exec();
   return res.status(200).json(photos)
}

// Função para pegar a foto via _id
const getPhotoById = async (req, res) => {
   const {id} = req.params

   try {
      const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

      //checar se a foto existe
      if (!photo) {
         return res.status(404).json({ errors: ["Foto não encontrada."]});
         
      }

      res.status(200).json(photo)

   } catch (error) {
      return res.status(500).json({ error: "erro interno do servidor de busca"});

   }
}

// Função para atualizar foto
const updatePhoto = async(req, res) => {
   const {id} = req.params;
   const {title} = req.body
   const reqUser = req.user

   try {
      const photo = await Photo.findById(id);

      // Checa se a foto existe
      if (!photo) {
         return res.status(404).json({ errors: ["Foto não encontrada."] });
      }

      // Checa se a foto pertence ao usuário
      if (!photo.userId.equals(reqUser._id)) {
         return res.status(422).json({ errors: ["Ocorreu um erro, tente mais tarde."] });
      }

      // Checa se o título foi enviado na requisição e atualiza se necessário
      if (title) {
         photo.title = title;
      }

      // Salva a foto
      await photo.save();

      // Responde à operação
      return res.status(200).json({ photo, message: "Foto atualizada com sucesso." });

   } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor ao atualizar a foto." });
   }

}

// Função de dar like na foto
const likePhoto = async(req, res) => {
   const {id} = req.params;
   const reqUser = req.user;

   // procurar foto
   const photo = await Photo.findById(id);

   // checar se a foto existe
   if(!photo) {
      return res.status(404).json({error: ["Foto não encontrada"]});
   }

   // checar se usuário já não deu o like na foto
   if (photo.likes.includes(reqUser._id)) {
      return res.status(422).json({ errors: ["Você já curtiu a foto."] })
   }

   // Colocar o id no usuário no array de likes
   photo.likes.push(reqUser._id);

   photo.save();
   res
      .status(200)
      .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida."})
}

// Função de comentário na foto
const commentPhoto = async(req, res) => {
   const {id} = req.params
   const {comment} = req.body
   const reqUser = req.user

   // pegar o id do usuário que comentou na foto
   const user = await User.findById(reqUser._id);

   //  Pegar a foto do comentário pela URL
   const photo = await Photo.findById(id)

   // checar se foto existe
   if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."]})
   };

   // colocar um model de comentários
   const userComment = {
      comment,
      userName: user.name,
      userImage: user.profileImage,
      userId: user._id,
   };

   // inserir o comentário do usuário no array de comentários
   photo.comments.push(userComment);

   // Salvar a photo com os novos dados
   await photo.save();

   // resposta
   res.status(200).json({
      comment: userComment,
      message: "O cometário foi adicionado com sucesso!",
   });
}

// Função de busca de imagens -> meio do título
const searchPhotos = async(req, res) => {
   const { q } = req.query;
   const photos = await Photo.find({title: new RegExp(q, "i") }).exec();

   res.status(200).json(photos)
}

module.exports = {
   insertPhoto,
   deletePhoto,
   getAllPhotos,
   getUserPhotos,
   getPhotoById,
   updatePhoto,
   likePhoto,
   commentPhoto,
   searchPhotos,
}
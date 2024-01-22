const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const jwtSecret = process.env.JWT_SECRET;

// função que gera o token do usuário
const generateToken = (id) => {
   return jwt.sign({ id }, jwtSecret, { 
      expiresIn: "7d",
   });
};

// Rota de registar usuário e sign in
const register = async (req, res) => {
   
   const {name, email, password}  = req.body;

   //checar se usuário já existe
   const user = await User.findOne({email})

   if (user) {
      res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
      return
   }

   // Gerar senha hash se validações OK
   const salt = await bcrypt.genSalt()
   const passwordHash = await bcrypt.hash(password, salt)

   // criar usuário
   const newUser = await User.create({
      name,
      email,
      password: passwordHash
   })

   // checar se usuário foi criado com sucesso
   if(!newUser) {
      res.status(422).json({errors: ["Houve um erro, por favor tente mais tarde!"]})
      return
   }

   res.status(201).json({
      _id:newUser._id,
      token: generateToken(newUser._id),
   })
};

// Rota de autenticação de usuário
const login = async (req, res) => {
   
   const {email, password} = req.body;

   // Cheacar email no cadastro
   const user = await User.findOne({ email });

   // Checar se usuário não existe
   if(!user) {
      res.status(404).json({erros: ["Usuário não encontrado"]})
      return
   }
   
   // checar se a senha não bate
   if (!(await bcrypt.compare(password, user.password))) {
      res.status(422).json({erros: ["Senha inválida."]})
      return
   }

   // tudo ok, retornar token do usuáro
   res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      token: generateToken(user._id),
   })
};

// Função usuário sign in
const getCurrentUser = async(req, res) => {
   const user = req.user

   res.status(200).json(user);
};

// Função de update do usuário
const update = async(req, res) => {
   const {name, password, bio} = req.body

   let profileImage = null

   if (req.file) {
      profileImage = req.file.filename;
   }
  
   const reqUser = req.user;
  
   const user = await User.findById(reqUser._id).select("-password");
  
   if (name) {
      user.name = name;
   }
  
   if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;

   }

   if (profileImage) {
    user.profileImage = profileImage;
  }

   if (bio) {
      user.bio = bio;
   }

   await user.save();

   res.status(200).json(user);
};

// Função de resgate de usuário pelo ID
const getUserById = async(req, res) => {
   const {id} = req.params;

   try {
      const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")

      // checar se usuário existe
      if (!user) {
         res.status(404).json({errors: ["Usuário não encontrado 2."]})
         return;
      }

      res.status(200).json(user);

   } catch (error) {
      res.status(404).json({errors: ["Usuário não encontrado."]})
      return;
      
   }  
}

module.exports = {
   register,
   login,
   getCurrentUser,
   update,
   getUserById,
};
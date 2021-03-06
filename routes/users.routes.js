const { Router } = require('express');
const User = require('../models/User');
const fileUploader = require('../config/cloudinary.config');

const router = Router();

// Virou uma rota de Autenticação:
// router.post('/user', async (req, res) => {
//   const payload = req.body;
//   try {
//     const newUser = await User.create(payload);
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ msg: 'Error while creating user', error });
//   }
// });

router.get('/user', async (req, res) => {
  try {
    const users = await User.find().populate('favoriteJokes');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put('/user/addjoke/:jokeid', async (req, res)=> {
  const { jokeid } = req.params;
  const { id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $push: { favoriteJokes: jokeid } }, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }

})

router.put('/user/uploadimage', fileUploader.single('image'), async (req,res)=> {
  const { path } = req.file
  const { id } = req.user
  try {
    const updatedUser = await User.findByIdAndUpdate(id, {image: path}, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
})

module.exports = router;

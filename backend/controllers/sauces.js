const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next)=>{
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; //remove the id, let the database generate it 
  delete sauceObject.userId; // making sure that the sauce is associated with the authenticated user who made it 
  const sauce = new Sauce({ // so here we make a new sause schema 
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.likes = 0;
  sauce.dislikes = 0;
  sauce.save() //save the new instance of the sause in the database 
    .then(() => res.status(201).json({ message: 'Sauce added!'})) 
    .catch((error) => res.status(400).json({ error }));
};


exports.getOneSauce =  (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id }) //using findone method to find a sause from the database based on the provided id 
  .then((sauce) => res.status(200).json(sauce))
  .catch((error) => res.status(400).json({ error }));

};

exports.getAllSauce = (req, res, next)=>{ 
  Sauce.find() //retriving all the sauces from the database with find method 
  .then((sauces) => res.status(200).json(sauces))
  .catch((error) => res.status(400).json({ error }));
};


exports.modifySauce =  (req, res, next) =>{
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id : req.params.id})
        .then((sauce) => {
          if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Unauthorized'});
          } else {
            Sauce.updateOne({ _id: req.params.id}, {...sauceObject,_id: req.params.id})
            .then(() => res.status(200).json({message: 'Sauce changed!'}))
            .catch((error) => res.status(400).json({ error}));
          }
        })
        .catch((error) =>{
          res.status(400).json({error});
        });
};

exports.deleteSauce =  (req, res, next) =>{
  Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
          if(sauce.userId !== req.auth.userId) {
            res.status(401).json({message: 'Unauthorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/'[1]);
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Sauce removed!'})})
                  .catch((error) => res.status(401).json({ error }));
              });
          }
      })
      .catch((error) => res.status(500).json({ error }));

};


// like and dislike
exports.likeSauce = (req, res, next) => {
  if (req.body.like === 1) { // to add the like 
    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
        .then(() => res.status(200).json({ message: 'Like added!' }))
        .catch((error) => res.status(400).json({ error }))
} else if (req.body.like === -1) { // to add a dislike  
    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
        .then(() => res.status(200).json({ message: 'Dislike added!' }))
        .catch((error) => res.status(400).json({ error }))
} else {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                    .then(() => { res.status(200).json({ message: 'Like deleted!' }) })
                    .catch((error )=> res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                    .then(() => { res.status(200).json({ message: 'Dislike deleted!' }) })
                    .catch((error) => res.status(400).json({ error }))
            }
        })
        .catch((error) => res.status(400).json({ error }))
} 
}
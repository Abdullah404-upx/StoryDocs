const express = require('express');
const router = express.Router();
const Story = require('../models/Story')
const {ensureAuth, ensureGuest} = require('../middleware/auth')

// @desc login/landing page
// @route GET / 

router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {
        layout: 'login'
    })
})

// @desc the Dashboard
// @route GET / 


router.get('/dashboard', ensureAuth, async (req, res)=>{
    
    try{
    const stories = await Story.find({user: req.user.id}).lean()
    res.render('dashboard', {
        name: req.user.firstName,
        stories: stories

    })
    }catch(err){
    console.log(err);
    res.render('error/500')
    }



  
})


module.exports = router;
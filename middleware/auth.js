// funcstion that hass acceot to repson and requst object

module.exports ={
    ensureAuth: function(req,res, next){
        // next functoin done when're you dn't done
        if(req.isAuthenticated()){
            return next()
        }else{
            res.redirect('/')
        }
    },

  ensureGuest: function(req,res, next){
        // next functoin done when're you dn't done
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }else{
            return next();
        }
    }

}
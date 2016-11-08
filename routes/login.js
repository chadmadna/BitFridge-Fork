var express = require('express')
var passport = require('passport')
var router = express.Router()

router.get('/facebook',
  passport.authenticate('facebook'))

router.get('/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/')
  })

module.exports = router

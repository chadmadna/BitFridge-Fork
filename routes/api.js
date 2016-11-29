var express = require('express')
var router = express.Router()
var apicalls = require('../modules/apicalls')
var User = require('../models/user')

var searchIngredients = apicalls.searchIngredients
var searchResults = apicalls.searchResults

router.get('/ingredients/autocomplete', function (req, res, next) {
  var params = req.query
  var searchText = params.query
  var number = params.number
  searchIngredients(searchText, number, function (err, body) {
    if (!err) {
      res.json(body)
    } else {
      next(err)
      console.error(err)
      console.log(err.stack)
    }
  })
})

router.get('/recipes/results', function (req, res, next) {
  var params = req.query
  var ingredients = JSON.parse(params.ingredients)
  var page = parseInt(params.page)
  searchResults(ingredients, page, function (err, body) {
    if (!err) {
      res.json(body)
    } else {
      next(err)
      console.error(err)
    }
  })
})

router.get('/user/data', function (req, res, next) {
  if (req.session.user) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache')
    res.json({ user: req.session.user })
  } else {
    res.status(404).end()
  }
})

router.post('/user/sync', function (req, res, next) {
  const userData = req.body
  console.log(req.body)
  User.findOne({ id: req.session.user.id }, function (err, user) {
    if (!err) {
      user.syncUser(userData, function (err, status) {
        if (!err && status.ok) {
          console.log('MAU LU APA')
          res.status(200).end()
        } else {
          console.log(status)
          next(err)
        }
      })
    } else {
      console.log('USER LO MANA')
      next(err)
    }
  })
})

module.exports = router

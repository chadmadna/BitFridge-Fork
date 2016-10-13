var request = require('request')
var append = require('append-query')

// DEVELOPMENT ONLY
const baseUrl = 'http://localhost:3000/api/'


/**
*@summary
*speak with the API.js
*@see api.js
*
*#callback
*@param {string} string - the ingredient's name
* @param cb - callback
*/
function searchIngredients (string, cb) {
  var url = baseUrl + 'ingredients/autocomplete'
  var params = {
    metaInformation: true,
    number: 6,
    query: string
  }
  get(url, params, cb)
}

function get (url, params, cb) {
  url = append(url, params)
  request.get(url, function (err, res, body) {
    if (!err && res.statusCode == 200)
      cb(null, res, JSON.parse(body))
  }).on('error', function (err) {
    cb(err)
  })
}
/**Search Ingredients*/
module.exports = {
  searchIngredients: searchIngredients
}

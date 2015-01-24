/**
* MenuItem.js
*
* @description :: Represents an item offered in the menu of the maidcafe
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},
  	price: {
  		type: 'float',
  		required: true
  	},
  	shortname: {
  		type: 'string',
  		required: true,
  		unique: true
  	},
  	category: {
  		type: 'string',
  		enum: ['entree', 'main', 'side', 'desert', 'drink'],
  		required: true
  	}
  }
};


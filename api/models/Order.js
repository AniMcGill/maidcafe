/**
* Order.js
*
* @description :: Represents a single order for a MenuItem placed by a single Customer
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    table: {
      type: 'integer',
      required: true
    },
    category: {
      type: 'string',
      enum: ['entree', 'main', 'side', 'desert', 'drink'],
      required: true
    },
  	state: {
  		type: 'string',
  		enum: ['new', 'preparing', 'ready', 'served'],
  		defaultsTo: 'new',
  		required: true
  	},
    paid: {
      type: 'boolean',
      defaultsTo: false
    },
  	customer: {
  		model: 'Customer'
  	},
  	menuItem: {
  		model: 'MenuItem'
  	}
  }
};


/**
* Order.js
*
* @description :: Represents a single order for a MenuItem placed by a single Customer
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	notes: 'text',
  	state: {
  		type: 'string',
  		enum: ['new', 'preparing', 'ready', 'served'],
  		defaultsTo: 'new',
  		required: true
  	},
  	customer: {
  		model: 'Customer'
  	},
  	item: {
  		model: 'MenuItem'
  	}
  }
};


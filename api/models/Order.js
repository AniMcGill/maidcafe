/**
* Order.js
*
* @description :: Represents a single order for a MenuItem placed by a single Customer
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
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


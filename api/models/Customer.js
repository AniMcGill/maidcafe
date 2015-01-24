/**
* Customer.js
*
* @description :: Represents a customer of the maid cafe
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	name: {
  		type: 'string',
  		required: true
  	},
  	table: {
  		type: 'integer',
  		required: true
  	},
  	paidAt: {
  		type: 'datetime'
  	},
  	orders: {
  		collection: 'Order',
  		via: 'customer'
  	}
  }
};


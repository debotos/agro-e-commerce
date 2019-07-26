const order = (sequelize: any, DataTypes: any) => {
	const Order = sequelize.define('order', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		buyer_id: {
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				notEmpty: { args: true, msg: 'Buyer is required.' }
			}
		},
		seller_id: {
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				notEmpty: { args: true, msg: 'Seller is required.' }
			}
		},
		product_id: {
			type: DataTypes.UUID,
			allowNull: false,
			validate: {
				notEmpty: { args: true, msg: 'Product is required.' }
			}
		},

		pending: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true
		},
		accepted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},

		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum value for quantity is 1.' },
				notEmpty: { args: true, msg: 'Order quantity is required.' }
			}
		},
		quantity_extension: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [1, 50], msg: 'Quantity extension length min: 1 and max: 50' },
				notEmpty: { args: true, msg: 'Quantity extension is required.' }
			}
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum price is 1.' },
				notEmpty: { args: true, msg: 'Order price is required.' }
			}
		},
		price_extension: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [1, 70], msg: 'Price extension length min: 1 and max: 70' },
				notEmpty: { args: true, msg: 'Price extension is required.' }
			}
		},

		delivery_date: {
			type: DataTypes.DATE,
			allowNull: false,
			validate: {
				isDate: { args: true, msg: 'Invalid delivery date format.' },
				notEmpty: { args: true, msg: 'Delivery date is required.' }
			}
		},
		complete: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		complete_date: {
			type: DataTypes.DATE,
			allowNull: true
		},

		buyer_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [3, 100], msg: 'Buyer name length min: 3 and max: 100' },
				notEmpty: { args: true, msg: 'Buyer name is required.' }
			}
		},
		seller_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [3, 100], msg: 'Seller name length min: 3 and max: 100' },
				notEmpty: { args: true, msg: 'Seller name is required.' }
			}
		},
		product_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [3, 100], msg: 'Product name length min: 3 and max: 100' },
				notEmpty: { args: true, msg: 'Product name is required.' }
			}
		}
	})

	return Order
}

export default order

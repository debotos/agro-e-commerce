const product = (sequelize: any, DataTypes: any) => {
	const Product = sequelize.define('product', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [3, 100], msg: 'Product name length min: 3 and max: 100' },
				notEmpty: { args: true, msg: 'Product name is required.' }
			}
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum value for quantity is 1.' },
				notEmpty: { args: true, msg: 'Product quantity is required.' }
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
		min_quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum value for Minimum Quantity is 1.' },
				notEmpty: { args: true, msg: 'Product minimun quantity is required.' }
			}
		},
		min_quantity_extension: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [1, 50], msg: 'Minimum Quantity extension length min: 1 and max: 50' },
				notEmpty: { args: true, msg: 'Minimum Quantity extension is required.' }
			}
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum price is 1.' },
				notEmpty: { args: true, msg: 'Product price is required.' }
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
		available_now: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
			validate: {
				notEmpty: { args: true, msg: 'Confirm available or not.' }
			}
		},
		retailable: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
			validate: {
				notEmpty: { args: true, msg: 'Confirm retailable or not.' }
			}
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
			validate: {
				len: { args: [15], msg: 'Description length min: 15' },
				notEmpty: { args: true, msg: 'Product description is required.' }
			}
		},
		gov_price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate: {
				isNumeric: { args: true, msg: 'Only numeric value allowed.' },
				min: { args: 1, msg: 'Minimum price is 1.' },
				notEmpty: { args: true, msg: 'Gov. price is required.' }
			}
		},
		gov_price_extension: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: { args: [1, 70], msg: 'Gov.price extension length min: 1 and max: 70' },
				notEmpty: { args: true, msg: 'Gov. Price extension is required.' }
			}
		},
		images: {
			type: DataTypes.ARRAY(DataTypes.JSON),
			allowNull: true
		}
	})

	Product.associate = (models: any) => {
		Product.belongsTo(models.Category)
		Product.belongsTo(models.User)
	}

	return Product
}

export default product

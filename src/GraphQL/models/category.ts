const category = (sequelize: any, DataTypes: any) => {
	const Category = sequelize.define('category', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		name: {
			type: DataTypes.STRING,
			validate: {
				len: { args: [3, 50], msg: 'Address length min: 3 and max: 50' },
				notEmpty: { args: true, msg: 'A category has to have a name.' }
			}
		}
	})

	Category.associate = (models: any) => {
		Category.hasMany(models.Product, { onDelete: 'CASCADE' })
	}

	return Category
}

export default category

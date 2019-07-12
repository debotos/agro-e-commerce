import bcrypt from 'bcrypt'
import uuid from 'uuid/v4'

const user = (sequelize: any, DataTypes: any) => {
	const User = sequelize.define('user', {
		id: {
			allowNull: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		username: {
			type: DataTypes.STRING,
			unique: { args: true, msg: 'Username is already taken.' },
			allowNull: false,
			validate: { notEmpty: true }
		},
		email: {
			type: DataTypes.STRING,
			unique: { args: true, msg: 'Email already exist!' },
			allowNull: false,
			validate: {
				notEmpty: true,
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [7, 42]
			}
		},
		role: {
			type: DataTypes.ENUM,
			allowNull: false,
			values: ['ADMIN', 'PARTNER', 'CONSUMER'],
			defaultValue: 'CONSUMER',
			validate: {
				isIn: {
					args: [['ADMIN', 'PARTNER', 'CONSUMER']], // check the value is one of these
					msg: "Must be one of ['ADMIN', 'PARTNER', 'CONSUMER']"
				}
			}
		},
		image: {
			type: DataTypes.JSON,
			allowNull: true
		}
	})

	User.associate = (models: any) => {
		User.hasMany(models.Message, { onDelete: 'CASCADE' })
	}

	User.findByLogin = async (login: any) => {
		let user = await User.findOne({
			where: { username: login }
		})

		if (!user) {
			user = await User.findOne({
				where: { email: login }
			})
		}

		return user
	}

	User.beforeCreate(async (user: any) => {
		user.password = await user.generatePasswordHash()
		user.id = uuid()
	})

	User.prototype.generatePasswordHash = async function() {
		const saltRounds = 10
		return await bcrypt.hash(this.password, saltRounds)
	}

	User.prototype.validatePassword = async function(password: string) {
		return await bcrypt.compare(password, this.password)
	}

	return User
}

export default user

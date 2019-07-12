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
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { len: [3, 100], notEmpty: { args: true, msg: 'Full name is required.' } }
		},
		user_name: {
			type: DataTypes.STRING,
			unique: { args: true, msg: 'Username is already taken.' },
			allowNull: false,
			validate: { len: [3, 60], notEmpty: { args: true, msg: 'Username is required.' } }
		},
		email: {
			type: DataTypes.STRING,
			unique: { args: true, msg: 'Email already exist!' },
			allowNull: false,
			validate: {
				len: [3, 100],
				notEmpty: { args: true, msg: 'Email is required.' },
				isEmail: true
			}
		},
		phone: {
			type: DataTypes.STRING,
			unique: { args: true, msg: 'Phone number belongs to someone else!' },
			allowNull: false,
			validate: { len: [11, 13], notEmpty: { args: true, msg: 'Phone number is required.' } }
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { len: [6, 42], notEmpty: { args: true, msg: 'Password is required.' } }
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
		},
		division: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { len: [3, 100], notEmpty: { args: true, msg: 'Division is required.' } }
		},
		region: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { len: [3, 100], notEmpty: { args: true, msg: 'Region is required.' } }
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: { len: [3, 200], notEmpty: { args: true, msg: 'Residence Address is required.' } }
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

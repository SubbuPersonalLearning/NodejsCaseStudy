const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator =require('validator')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

const userSchema = mongoose.Schema({
    
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"')
                }
            }
        },
        userRoles: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'UserRoles'
        }]
    }, {
        timestamps: true
    }
)

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// userSchema.methods.toJSON = function()
// {
//     const user = this
//     const userObject = user.toObject()

//     delete userObject.password
//     delete userObject.tokens
    
//     return userObject
// }


// userSchema.methods.generateAuthToken = async function() {
//     const user = this;
//     const token = jwt.sign({_id: user._id.toString()}, config.jwt.secret)
    
//     user.tokens = user.tokens.concat({token});
//     await user.save()

//     return token 
// }

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };

const User = mongoose.model('User', userSchema)

module.exports = User
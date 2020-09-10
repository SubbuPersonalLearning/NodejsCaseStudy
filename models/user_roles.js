const mongoose = require('mongoose')


const UserRolesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }]
    RoleId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Roles'
    }
},{
    timestamps: true
})

const UserRoles = mongoose.model('UserRoles', UserRolesSchema)

module.exports=UserRoles;
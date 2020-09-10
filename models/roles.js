const { string } = require('@hapi/joi');
const mongoose = require('mongoose')


const rolesSchema = mongoose.Schema({
    rolename: {
        type: string,
        required:true,
        trim: true
    }
},{
    timestamps: true
})

const Roles = mongoose.model('Roles', rolesSchema)

module.exports=Roles;
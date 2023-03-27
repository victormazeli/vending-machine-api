/* eslint-disable func-names */
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid';
// import mongoosePaginate from 'mongoose-paginate-v2'

import argon2 from 'argon2'

// const saltRounds = 10 // or another integer in that ballpark

const { Schema } = mongoose

const UserSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        deposit: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            enum: ["seller", "buyer"],
            required: true
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
       try {
        const hash =  await argon2.hash(this.password)
        this.password = hash
        next();
        
       } catch (error) {
        next(new Error(error));
       }
    }
    try {
        const hash = await argon2.hash(this.password)
        this.password = hash
        next();
        
    } catch (error) {
        next(new Error(error));
    }
    
});


// UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', UserSchema)

export default User
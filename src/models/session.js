/* eslint-disable func-names */
import mongoose from 'mongoose'


const { Schema } = mongoose

const SessionSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        token: {
            type: String,
            required: true
        },
        expiryTime: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
)


const Session = mongoose.model('Session', SessionSchema)

export default Session
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        dob: {
            type: Date,
            default: null,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', ''],
            default: '',
        },
        address: {
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        refreshTokens: [
            {
                token: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },   
    picture: {
        type: String,
        default: "Backend/assets/default_Profile.webp",
    },
}, {
    timestamps: true  
});

//pre means before saving use this function
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.matchPassword = async function(enteredPswd){
    return await bcrypt.compare(enteredPswd , this.password);
}

const User = mongoose.model('User', userSchema);
export default User;

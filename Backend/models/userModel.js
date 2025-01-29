import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
    {
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
            required: true,
            default: "/public/images/default-profile-pic.jpg",
        },
    },
    {
        timestamps: true,
    }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match passwords
userSchema.methods.matchPassword = async function (enteredPswd) {
    return await bcrypt.compare(enteredPswd, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require("../utils/sendEmail");


// routes post /api/auth/register   public access
exports.register =  async (req, res, next) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
            role
        });
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(err);
    }
};


// login  post/api/auth/login public
exports.login = async (req, res, next) => {
    const {email, password} = req.body;
    // validate 
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }
    try {
        // check for user
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 401));
        }

        // check for password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};


// get token from model, create cookies and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ), httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};



// get current user logged in GET api/auth/me private
exports.getMe = async (req, res,  next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err)
    };
}
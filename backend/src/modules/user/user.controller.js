import { User } from './user.model.js';

export const registerUser = async (req, res, next) => {
  try {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user in DB
    const newUser = await User.create(userData);

    // Remove password from response
    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

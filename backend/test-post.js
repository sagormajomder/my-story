import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
    name: String, email: String, role: String
}, { strict: false });
const User = mongoose.model('User', userSchema);

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = `test-${Date.now()}@test.com`;
    let res = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin', email, password: 'password123' })
    });
    let data = await res.json();
    console.log('Register:', data.success);

    const user = await User.findOne({ email });
    user.role = 'super_admin';
    await user.save();

    res = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    data = await res.json();
    const token = data.data.token;

    console.log('Role in token:', data.data.user.role);

    // Now try to create a post
    res = await fetch('http://localhost:8000/api/v1/posts', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title: 'Test Post', content: 'Test Content' })
    });
    data = await res.json();
    console.log('Create Post Response:', data);

  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}
test();

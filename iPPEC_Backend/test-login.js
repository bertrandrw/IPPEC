// Test login functionality
import fetch from 'node-fetch';

async function testLogin() {
  try {
    const loginData = {
      emailOrPhone: "another-unique-email@example.com",
      password: "password123" // You'll need to know the actual password
    };

    console.log('Testing login with:', loginData.emailOrPhone);
    
    const response = await fetch('http://localhost:30000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const result = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', result);
    
  } catch (error) {
    console.error('Login test failed:', error.message);
  }
}

testLogin();
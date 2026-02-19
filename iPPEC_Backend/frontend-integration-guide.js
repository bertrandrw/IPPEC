// Frontend Integration Guide - Save this for your frontend developers

// 1. CORRECT API CONFIGURATION
const API_CONFIG = {
  BASE_URL: 'http://localhost:30000/api/v1',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    ADMIN: {
      MEDICINES: '/admin/medicines',
      USERS_PENDING: '/admin/users/pending',
      // Add other admin endpoints as needed
    }
  }
};

// 2. ADMIN LOGIN CREDENTIALS (For local development)
const ADMIN_CREDENTIALS = {
  email: 'another-unique-email@example.com', // Use emailOrPhone field
  password: 'admin123'
};

// 3. CORRECT LOGIN FUNCTION
async function loginAdmin() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrPhone: ADMIN_CREDENTIALS.email, // IMPORTANT: Use 'emailOrPhone', not 'email'
        password: ADMIN_CREDENTIALS.password
      })
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Store token for future requests
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    console.log('Login successful:', data.data.user);
    return data;
    
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// 4. AUTHENTICATED API REQUESTS
async function makeAuthenticatedRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login
    }
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

// 5. EXAMPLE USAGE
async function loadAdminDashboard() {
  try {
    // Login first
    await loginAdmin();
    
    // Then load admin data
    const medicines = await makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.ADMIN.MEDICINES);
    const pendingUsers = await makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.ADMIN.USERS_PENDING);
    
    console.log('Medicines:', medicines);
    console.log('Pending Users:', pendingUsers);
    
    // Update your UI here
    
  } catch (error) {
    console.error('Dashboard load failed:', error);
    alert('Failed to load admin dashboard: ' + error.message);
  }
}

// 6. COMMON FRONTEND ISSUES TO CHECK:

/* 
ISSUE 1: Wrong field name in login request
❌ Wrong: { email: '...', password: '...' }
✅ Correct: { emailOrPhone: '...', password: '...' }

ISSUE 2: Missing Authorization header
❌ Wrong: No Authorization header
✅ Correct: headers: { 'Authorization': 'Bearer ' + token }

ISSUE 3: Wrong API URL
❌ Wrong: 'https://health-agaba-be.onrender.com/api/v1'
✅ Correct: 'http://localhost:30000/api/v1'

ISSUE 4: Not handling token storage
❌ Wrong: Not storing token after login
✅ Correct: localStorage.setItem('authToken', token)

ISSUE 5: Not handling authentication errors
❌ Wrong: Not checking for 401 responses
✅ Correct: Check response status and redirect on 401
*/

export { API_CONFIG, ADMIN_CREDENTIALS, loginAdmin, makeAuthenticatedRequest, loadAdminDashboard };
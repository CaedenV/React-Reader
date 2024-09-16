import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create();

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  response => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && error.response.data.error === 'TokenExpiredError' && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token
        const response = await axios.post('http://localhost:8080/users/refresh', { token: refreshToken });

        // Save the new access token
        localStorage.setItem('accessToken', response.data.accessToken);

        // Update the authorization header and retry the request
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Error refreshing token:', err);
        // Optionally, redirect to login if refresh fails
      }
    }

    return Promise.reject(error); // Return any other errors
  }
);

export default apiClient;

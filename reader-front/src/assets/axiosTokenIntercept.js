import axios from 'axios';
import { userBack } from './backendRoutes';

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
        //console.log('in refresh!');
        const response = await axios.post(`${userBack}/refresh`, {token: refreshToken});
        //console.log(response.data.accessToken);
        // Save the new access token
        localStorage.setItem('accessToken', response.data.accessToken);

        // Update the authorization header and retry the request
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error('Error refreshing token:', err);

        // If refresh fails, call the logout endpoint
        try {
          await axios.post('http://localhost:5000/logout', { token: localStorage.getItem('refreshToken') });
        } catch (logoutError) {
          console.error('Error logging out:', logoutError);
        }

        // Clear tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Redirect to login or home page
        window.location.href = '/'; // or any other page
        return Promise.reject(err);
      }
    }

    return Promise.reject(error); // Return any other errors
  }
);

export default apiClient;

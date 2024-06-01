import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const useTokenRefresh = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token && refreshToken) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

            if (decodedToken.exp < currentTime) {
                // Access token has expired
                axios.post(`https://localhost:7264/api/Token/refresh?accessToken=${token}&refreshToken=${refreshToken}`)
                    .then(response => {
                        const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

                        // Update tokens in localStorage
                        localStorage.setItem('token', newAccessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);
                    })
                    .catch(error => {
                        console.error('Token refresh failed:', error);

                        // If the refresh token is also expired, log out the user
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        // Redirect to login page
                        window.location.reload();
                    });
            }
        }
    }, []);
};

export default useTokenRefresh;

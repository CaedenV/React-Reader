import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if(token) {
            const decodedToken = jwtDecode(token).id;
            setUser(decodedToken);
        }
    }, []);

    return user;
};

export default useUser;
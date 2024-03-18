import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useUser = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = Cookies.get('token');

        if(token) {
            const decodedToken = jwtDecode(token).id;
            setUser(decodedToken);
        }
    }, []);

    return user;
};

export default useUser;
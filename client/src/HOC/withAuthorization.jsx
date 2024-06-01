import { jwtDecode } from 'jwt-decode';

const withAuthorization = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const accessToken = localStorage.getItem("token") || "";
        if (accessToken) {
            try {
                const decode = jwtDecode(accessToken);
                if (!allowedRoles.includes(decode['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])) {
                    window.location.replace("/accessDenied");
                    return null;
                }
            } catch (error) {
                window.location.replace("/authentication");
                return null;
            }
        } else {
            window.location.replace("/authentication");
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthorization;

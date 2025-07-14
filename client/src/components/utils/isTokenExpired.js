function isTokenExpired() {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
        return true;
    }

    try {
        const payload = JSON.parse(atob(userToken.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        return currentTime > payload.exp; // Returns true if token is still valid
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
}

export default isTokenExpired;

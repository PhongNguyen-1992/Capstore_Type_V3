import axios,{type AxiosInstance} from "axios";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    timeout: 30000, // Thời gian chờ 30 giây
})

// interceptor để xử lý request
api.interceptors.request.use((config: any) => {
    const userLocal:string | null = localStorage.getItem("user");
    const userParsed = userLocal ? JSON.parse(userLocal) : null;
    const token = userParsed ? userParsed.accessToken : ""

    // Thêm token vào headers nếu có
    return {
        ...config,
        headers: {
            TokenCybersoft:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eVOf1g8zhTZZg6WSx4",
            Authorization: token ? `Bearer ${token}` : "",
        }

    };

});
export default api;
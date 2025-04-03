// App.js
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import axiosInstance from "../../config/axios";

function GoogleLoginButton() {
  const beUrl = process.env.REACT_APP_BE_URL;
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string;
  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response: { accessToken: string; refreshToken: string } =
        await axiosInstance.post(`${beUrl}/google`, {
          token: credentialResponse.credential,
        });
      console.log(response);
      localStorage.setItem("access_token", response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => console.log("Đăng nhập thất bại")}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;

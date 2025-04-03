// App.js
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import axiosInstance from "../../config/axios";

function GoogleLoginButton() {
  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response: { accessToken: string; refreshToken: string } =
        await axiosInstance.post("http://localhost:5000/google", {
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
    <GoogleOAuthProvider clientId="375207417006-u77a0k3mnbi6coog727rd590ipo524lc.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => console.log("Đăng nhập thất bại")}
      />
    </GoogleOAuthProvider>
  );
}

export default GoogleLoginButton;

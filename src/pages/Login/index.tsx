import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LockClosedIcon,
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../../config/axios";
import GoogleLoginButton from "./GoogleLoginButton";
import { useLocalStorage } from "../../hooks/useLocalStorage";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [, setAccessToken] = useLocalStorage("access_token", "");

  // Form data with TypeScript interface
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });

  // UI states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Form errors with TypeScript interface
  const [errors, setErrors] = useState<FormErrors>({});

  // Clear error when input changes
  const clearError = (field: keyof FormErrors): void => {
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    clearError(name as keyof FormErrors);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      const response: { accessToken: string; refreshToken: string } =
        await axiosInstance.post("/login", {
          email: form.email,
          password: form.password,
        });
      console.log(response);
      setAccessToken(response.accessToken);
      localStorage.setItem("refresh_token", response.refreshToken);

      // Redirect after successful login
      navigate("/");
    } catch (error) {
      setErrors({
        email: "Email hoặc mật khẩu không đúng",
        password: "Email hoặc mật khẩu không đúng",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eeebeb] py-12 px-4">
      <div className="max-w-md w-full space-y-4 shadow-sm p-4 sm:p-6 lg:p-6 rounded bg-white">
        {/* Logo & Title */}
        <div className="w-full text-center">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
            >
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-2 space-y-4" onSubmit={handleLogin}>
          <div className="rounded-md gap-2">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 py-2"
              >
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-700 ph-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 py-2"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-gray-700 ph-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-black placeholder-gray-400 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={form.remember}
              onChange={handleChange}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 pl-2"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#0118D8] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className={`h-5 w-5 text-indigo-500 group-hover:text-indigo-400 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </span>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          {/* Social Login */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Hoặc</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <GoogleLoginButton />

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

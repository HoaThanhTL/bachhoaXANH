import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logoLight } from "../../assets/images";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [successModal, setSuccessModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const API_URL = "http://127.0.0.1:8080/api/auth/login";
  const REFRESH_URL = "http://127.0.0.1:8080/api/auth/refresh"; 
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail("");
    setAuthError(""); // Tắt lỗi xác thực khi người dùng nhập lại
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword(""); // Tắt lỗi password khi người dùng nhập lại
    setAuthError(""); // Tắt lỗi xác thực khi người dùng nhập lại
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setErrEmail(email ? "" : "Vui lòng nhập email.");
      setErrPassword(password ? "" : "Vui lòng nhập mật khẩu.");
      return;
    }
  
    try {
      // Gửi request đăng nhập
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const accessToken = data.accessToken;
        const refreshToken = data.refreshToken;

        if (accessToken) {
          localStorage.setItem("authToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          console.log("Đăng nhập thành công. Token đã được lưu.", accessToken);
  
          // Gọi API để lấy thông tin người dùng
          const userResponse = await fetch("http://127.0.0.1:8080/api/users/current", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("Coi cái này giúp ", userData);
          
            if (userData && userData.role) {
              const roleName = userData.role.roleName; // Lấy vai trò người dùng
              const userId = userData.userId; // Lấy ID của người dùng
          
              console.log("Vai trò người dùng:", roleName);
          
              // Lưu ID và vai trò vào localStorage
              localStorage.setItem("userId", userId);
              localStorage.setItem("role", roleName);
          
              console.log("Vai trò người quản trị", localStorage.getItem("role"));
              console.log("User ID:", localStorage.getItem("userId"));
          
              // Hiển thị thông báo đăng nhập thành công
              setSuccessModal(true);
          
              setTimeout(() => {
                setSuccessModal(false);
                if (roleName === "ROLE_ADMIN") {
                  navigate("/admin");
                } else if (roleName === "ROLE_USER") {
                  navigate("/"); // Chuyển hướng về trang người dùng
                } else {
                  navigate("/"); // Trang mặc định
                }
              }, 2000); // Ẩn modal sau 2 giây
            } else {
              setAuthError("Không thể xác định vai trò người dùng.");
              console.error("Lỗi: Dữ liệu người dùng không hợp lệ.", userData);
            }
          } else {
            const errorData = await userResponse.json();
            setAuthError(errorData.message);
          }
          
        }
      } else {
        const errorData = await response.json();
        setAuthError(errorData.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối máy chủ:", error);
      setAuthError("Không thể kết nối máy chủ.");
    }
  };

  const refreshToken = async () => {
    setIsRefreshing(true);
  
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('Không tìm thấy refresh token trong localStorage.');
        handleLogout();
        return;
      }
  
      console.log("Bắt đầu làm mới token...");
  
      const response = await fetch(REFRESH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });
  
      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data.accessToken;
        localStorage.setItem('authToken', newAccessToken);
        
        console.log("Token đã được làm mới:", newAccessToken);
      } else {
        console.error("Lỗi khi làm mới token:", response.statusText);
        handleLogout();
      }
    } catch (error) {
      console.error("Lỗi khi làm mới token:", error.message);
    } finally {
      setIsRefreshing(false);
    }
  };  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/Sinup');
  };

  useEffect(() => {
    const intervalId = setInterval(refreshToken, 180000); // Làm mới token mỗi 3 phút

    return () => {
      clearInterval(intervalId); // Dọn dẹp interval khi component unmount
    };
  }, []);
  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {/* Modal thông báo thành công */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <BsCheckCircleFill className="text-green-500 text-4xl mx-auto mb-3" />
            <p className="text-lg font-semibold">Đăng nhập thành công!</p>
          </div>
        </div>
      )}

      {/* Phần bên trái */}
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Duy trì đăng nhập để trải nghiệm tốt hơn
            </h1>
            <p className="text-base">Khi đăng nhập, bạn đồng hành cùng chúng tôi!</p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © orebi
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Điều khoản
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Quyền riêng tư
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Bảo mật
            </p>
          </div>
        </div>
      </div>

      {/* Phần bên phải - Form đăng nhập */}
      <div className="w-full lgl:w-1/2 h-full">
        <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center">
          <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
            <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
              Đăng nhập
            </h1>
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Email công việc
                </p>
                <input
                  onChange={handleEmail}
                  value={email}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="email"
                  placeholder="name@domain.com"
                />
                {errEmail && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errEmail}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-.5">
                <p className="font-titleFont text-base font-semibold text-gray-600">
                  Mật khẩu
                </p>
                <input
                  onChange={handlePassword}
                  value={password}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  type="password"
                  placeholder="******"
                />
                {errPassword && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {errPassword}
                  </p>
                )}
                {authError && (
                  <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                    <span className="font-bold italic mr-1">!</span>
                    {authError}
                  </p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                onClick={handleSignUp}
                className="w-full py-2 mt-4 bg-primeColor text-white text-lg font-semibold rounded-md hover:bg-[#2521e1] duration-300"
              >
                Đăng nhập
              </button>
              
              {/* Link to quên mật khẩukhẩu */}
              <div className="flex justify-between mt-6 text-sm text-gray-500">
              
                <Link to="/forgot-password">
                  <p className="font-semibold cursor-pointer hover:text-primeColor">
                    Quên mật khẩukhẩu
                  </p>
                </Link>
              </div>

              {/* Link to SignUp */}
              <div className="flex justify-between mt-6 text-sm text-gray-500">
                <p>Bạn chưa có tài khoản?</p>
                <Link to="/signup">
                  <p className="font-semibold cursor-pointer hover:text-primeColor">
                    Đăng ký
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;

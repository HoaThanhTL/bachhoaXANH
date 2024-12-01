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
  const [authError, setAuthError] = useState(""); // Thêm lỗi chung cho việc xác thực
  const [successModal, setSuccessModal] = useState(false);

  const API_URL = "http://127.0.0.1:8080/api/auth/login";
  const navigate = useNavigate();
  const location = useLocation();

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail(""); // Tắt lỗi email khi người dùng nhập lại
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
      setErrEmail(email ? "" : "Vui lòng nhập email của bạn.");
      setErrPassword(password ? "" : "Vui lòng tạo mật khẩu.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("authToken", token);
        console.log("Đây là token:",token)

        setSuccessModal(true); // Hiển thị modal thành công

        // Lưu lại trang hiện tại vào localStorage
        localStorage.setItem("lastPath", location.pathname);
        console.log("Kiểm tra", localStorage.getItem("authToken"))

        // Ẩn modal sau 1 giây và điều hướng
        setTimeout(() => {
          setSuccessModal(false); // Ẩn modal
          const lastPath = localStorage.getItem("lastPath");
          const restrictedPaths = ["/signup", "/verify-otp", "/signin"];

          // Kiểm tra nếu trang trước là một trong các trang hạn chế
          if (restrictedPaths.includes(lastPath)) {
            navigate("/"); // Điều hướng về trang Home
          } else {
            navigate(lastPath); // Điều hướng về trang gần nhất
          }
        }, 1000); // Hiển thị modal trong 1 giây
      } else {
        const data = await response.json();
        if (data.message === "Email hoặc mật khẩu không chính xác") {
          setAuthError("Email hoặc mật khẩu không chính xác.");
        }
      }
    } catch (error) {
      setErrEmail("Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại.");
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    localStorage.setItem("lastPath", currentPath);
  }, [location]);

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

      {/* Cột bên trái */}
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
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Bắt đầu nhanh với levenst
              </span>
              <br />
              Khám phá những trải nghiệm tuyệt vời cùng dịch vụ của chúng tôi.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Truy cập mọi dịch vụ của levenst
              </span>
              <br />
              Dễ dàng quản lý tài khoản và trải nghiệm tối ưu nhất.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Được tin tưởng bởi người mua sắm trực tuyến
              </span>
              <br />
              Mang lại sự an tâm với chất lượng dịch vụ hàng đầu.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © levenst
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

      {/* Cột bên phải */}
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

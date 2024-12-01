import React, { useState, useCallback } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { logoLight } from "../../assets/images";
import { useNavigate } from "react-router-dom";

import axios from "axios"; 

const SignUp = () => {
  // ============= Initial State Start here =============
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // ============= Error Msg Start here =================
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    terms: "",
  });
  // ============= Error Msg End here ===================

  // ============= Event Handler Start here =============
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  }, []);

  // ============= Email Validation start here ============
  const isValidEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  // ============= Email Validation End here ==============

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    // Form validation
    let formIsValid = true;
    let tempErrors = {};
  
    if (!name) {
      formIsValid = false;
      tempErrors.name = "Enter your name";
    }
  
    if (!email) {
      formIsValid = false;
      tempErrors.email = "Enter your email";
    }
  
    if (!phone) {
      formIsValid = false;
      tempErrors.phone = "Enter your phone number";
    }
  
    if (!password) {
      formIsValid = false;
      tempErrors.password = "Create a password";
    } else if (password.length < 6) {
      formIsValid = false;
      tempErrors.password = "Passwords must be at least 6 characters";
    }
  
    if (!checked) {
      formIsValid = false;
      tempErrors.terms = "You must agree to the Terms & Conditions";
    }
  
    setErrors(tempErrors);
  
    if (formIsValid) {
      try {
        const response = await axios.post("http://127.0.0.1:8080/api/auth/register", {
          name,
          email,
          phone,
          password,
        });
  
        if (response.status === 200) {
          // Đăng ký thành công, chuyển sang form nhập OTP
          setSuccessMsg(response.data.message);
          navigate("/verify-otp",  { state: { email } }); // Điều hướng sang trang nhập OTP
        }
      } catch (error) {
        // Kiểm tra lỗi từ backend
        if (error.response && error.response.data.message === "Email đã tồn tại") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already exists. Please use another email.",
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            apiError: "An error occurred. Please try again later.",
          }));
        }
      }
  
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    }
  };
  

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <img src={logoLight} alt="logoImg" className="w-28" />
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Get started for free</h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Get started fast with Levenst</span><br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Access all Levenst services</span><br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1"><BsCheckCircleFill /></span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Trusted by online Shoppers</span><br />
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">© Levenst</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terms</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacy</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Security</p>
          </div>
        </div>
      </div>

      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
            <Link to="/signin">
              <button className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300">Sign in</button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">Create your account</h1>
              
              {/* Client name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="font-titleFont text-base font-semibold text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={handleInputChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  placeholder="eg. John Doe"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="email" className="font-titleFont text-base font-semibold text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={handleInputChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  placeholder="eg. johndoe@domain.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="phone" className="font-titleFont text-base font-semibold text-gray-600">Phone</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={handleInputChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  placeholder="eg. +1 234-567-890"
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="password" className="font-titleFont text-base font-semibold text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={handleInputChange}
                  className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                  placeholder="Create a password"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  id="terms"
                  name="terms"
                />
                <label htmlFor="terms" className="text-sm">I agree to the <span className="text-primeColor">Terms & Conditions</span></label>
                {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  onClick={handleSignUp}
                  disabled={!name || !email || !phone || !password || !checked}
                  className={`w-full h-10 ${!checked ? "bg-gray-400" : "bg-primeColor"} rounded-md text-base font-titleFont font-semibold text-gray-200 tracking-wide`}
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;

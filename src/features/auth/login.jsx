import React, { useState } from "react"
import api from "../../api/api";
import AppInput from "../../components/AppInput";
import AppBtn from "../../components/AppBtn";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginBanner from '../../assets/images/encryption.jpg';
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [isLoading, setIsLoading] = useState();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const login = (e) => {
    e.preventDefault();
    setIsLoading(true)
    api.post('api/auth/login', formData).then((res) => {
      if (res.status === 200 && res) {
        setIsLoading(false);
        toast.success(res.data.message);
        localStorage.setItem('data', JSON.stringify(res.data))
        navigate('/')
      }
    }).catch((error) => {
      setIsLoading(false);
      console.error(error);
      toast.error(error.message)
    })
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="hidden bg-primary w-1/2 lg:flex h-screen justify-center items-center">
        <img className="xl:h-[60vh] xl:w-[550px] rounded-2xl" src={loginBanner} alt="home-banner" />
      </div>
      <div className="flex justify-center lg:w-1/2 w-full h-screen items-center bg-[#f5f5f5]">
        <div className="flex flex-col gap-8 w-[90%] lg:w-auto">
          <h1 className="lg:text-[50px] text-[40px] font-extrabold text-primary">Acta BioScientia</h1>
          <div className="flex flex-col gap-6 w-full lg:w-[400px] xl:w-[500px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl text-primary font-bold">Login</h1>
              <span>Enter your email & password to login.</span>
            </div>
            <form onSubmit={login} className="flex flex-col gap-6">
              <AppInput label="Email address" required type="email" onChange={handleChange} value={formData.email} name="email" id="email"
                placeholder="Enter your email address" />
              <AppInput label="Password" required type="password" onChange={handleChange} value={formData.password} name="password"
                id="password" placeholder="Enter your password" />
              <AppBtn isLoading={isLoading} type="submit" variant="primary">Log in</AppBtn>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogIn;
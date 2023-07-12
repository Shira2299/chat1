import "./auth.css";
import avatar from "./profileimg.png";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { Link, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { authRegister } from "../Redux/Auth/action";
import { useNavigate } from "react-router-dom";
import { navigate } from 'react-router-dom';
import { useEffect } from "react";

export const LoginComp = () => {
  const { user, loading, error } = useSelector((store) => store.user);
  const [regData, setRegData] = useState({
    email: "albert@gmail.com",
    password: "albert",
  });
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegData({ ...regData, [name]: value });
  };
  const navigate=useNavigate();
  const handleSubmit = () => {
    console.log('enter');
    const url = "http://localhost:5000/auth/login";
    dispatch(authRegister(url, regData));
    console.log('user._id',user._id);
    console.log('user.id',user.id);
    // {user && (
    //   // <Navigate to="/" replace={true} />
    //   navigate("/");
    // )}
  
    if(user.id)
    {
      console.log('navigate');
      navigate('/');
    }
  };
  // useEffect(() => {
  //   if (user.id) {
  //     console.log('navigate');
  //     navigate('/');
  //   }
  // }, [user, navigate]);
  // if (user.id!=undefined) {
  //   return <Navigate to={"/"} />;
  // }
  // if (user.id) {
  //   <Navigate to="/"/>
  // }
 
  // useEffect(()=>{
  //   if (user.id!=undefined) {
  //     return <Navigate to={"/"} />;
  //   }
  // },[user]);
 

  // useEffect(() => {
  //   if (userIsInactive) {
  //     fake.logout();
  //     navigate("/session-timed-out");
  //   }
  // }, [userIsInactive]);

  return (
    <div className="auth-cont">
      <div>
        <h2 className="auth-heading">Welcome back!</h2>

        <div className="details-cont">
          <p>Email</p>
          <input name="email" onChange={handleChange} className="inputcom" />

          <p>Password</p>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            className="inputcom"
          />

          {loading ? (
            <ColorButton disabled>
              <CircularProgress style={{ color: "white" }} />
            </ColorButton>
          ) : (
            <ColorButton onClick={handleSubmit}>Continue</ColorButton>
          )}

          <p className="auth-link" onClick={handleSubmit}>
            Don't have an account? Click continue to login as guest
          </p>
          <p className="contract">
            Need an account ?
            <Link className="auth-link" to={"/register"}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export const ColorButton = styled(Button)(() => ({
  color: "white",
  fontSize: "20px",
  textTransform: "none",
  backgroundColor: "#5865f2",
  "&:hover": {
    backgroundColor: "#3a45c3",
  },
}));

import Button from "../components/common/Button";
import React, { useState,useRef,useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged } from "firebase/auth";
import { useSocketRef } from "./contextProvider/SocketProvider";
import axios from "axios";

const Login = () => {
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const socketRef = useSocketRef();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider); 
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user.email)
          axios.get(`https://poolpayapi.onrender.com/user/hasMobileNumber?email=${user.email}`).then((res) => {
              if(!res.data.hasMobileNumber){
                console.log("user don't have mobile number")
                setShowMobileInput(true);
              }else{
                if (socketRef.current) {
                  const mobileNumber = res.data.hasMobileNumber;
                  socketRef.current.emit("joinPool", mobileNumber);
                }
              }
          }).catch((err) => {  console.log(err); }); 
        }
      });
  
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleMobileNumberSubmit = () => {
    if (socketRef.current) {
      socketRef.current.emit("joinPool", mobileNumber);
    }
    setShowMobileInput(false);
  };

  return (
    <div>
      <Button onClick={handleGoogleSignIn} buttonText="Start Pooling" />
      {showMobileInput && (
        <div className="bg-white p-4 rounded-lg">
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            className="w-full text-black bg-gray-200 rounded-lg border-2 border-gray-300 p-2 mt-2"
          />
          <button
            onClick={handleMobileNumberSubmit}
            className="w-full bg-black text-white rounded-lg px-4 py-2 mt-2"
          >
            Confirm Number
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;

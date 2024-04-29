import React  from 'react';
import { useEffect } from 'react';
import "./styles.css"
import { collection } from 'firebase/firestore';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import userImg from '..//../assets/user.svg';

function Header() {
  
  const [user, loading] = useAuthState(auth);
 const navigate = useNavigate();
 
  useEffect (()=> {
    if(user) {
      navigate('/dashboard');
    }
  },[user,loading,navigate]);


  function logoutfnc (){
    try{
      signOut(auth).then(() => {
        toast.success("Logged Out Successfully!");
        navigate("/");
        // Sign-out successful.
      }).catch((error) => {
        toast.error(error.message);
        // An error happened.
      });
      
    }catch(e){
      toast.error(e.message)
    }
  }



  return (
    <div className='navbar'>
     <p className='logo'>Financely.</p>
     {user && 
      (
      <div style={{display:"flex", alignItems:'center',gap:" 0.75rem"}}> 
      <img src={user.photoURL ? user.photoURL : userImg } width={"2rem"} height={"2Rem"} 
       style={{borderRadius:"50%" ,width:"1.5rem", height:"1.5Rem"}}  alt="" />
      <p className='logo link' onClick={logoutfnc}>Logout</p>
      </div>
      )}
    </div>
  )
}

export default Header
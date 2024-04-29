import React, { useState, useTransition } from 'react'
import './styles.css';
import Input from '../Input';
import Button from '../Button';
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword  } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth ,db, provider } from '../../firebase';
import { doc , getDoc, setDoc} from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function SignupSigninComponent() {
    const [name, setName] = useState ("");
    const [email, setEmail] = useState("");
    const [password ,setPassword] =useState("");
    const [confirmPassword , setConfirmPassword] = useState("");
    const [loginForm ,setLoginForm] = useState(false);
    const [loading ,setLoading] = useState(false);
    const navigate  = useNavigate();

   

    function SignupWithEmail (){
        setLoading(true);
        console.log("Name" , name);
        console.log("email", email);
        console.log("password" , password);
        console.log("confirmpassword" , confirmPassword);

        //authenticate user here or create new account using password and email
         
        if(name !="" && email !="" && password!="" && confirmPassword!=""){
            if(password == confirmPassword) {

                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    console.log("user" , user);
                    toast.success("User Created!")
                    setLoading(false);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    createDoc(user); 
                    navigate("/dashboard");
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                    // ..
                });
            }else{
                toast.error("Password and ConfirmPassword Dont Match!");
                setLoading(false);
            }
        }else{
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    function loginUsingEmail (){
        console.log("email" , email );
        console.log("password" ,password);
        setLoading(true);
        if(email !="" && password!=""){
            signInWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
          // Signed in 
         const user = userCredential.user;
         toast.success("User Logged In!");
         console.log("User Logged In " , user );
         setLoading(false);
         navigate("/dashboard");
         // ...
         })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          setLoading(false);
         });
        }
        else{
            toast.error("All Fields are Mandatory!");
            setLoading(false);
        }

        
    }
    

    async function createDoc (user) {
        // make sure that the doc with uid doesnt exist 
        // create a doc 
        setLoading(true)
        if(!user) return ;
        const useRef = doc(db,"users", user.uid);
        const userData = await getDoc(useRef);
        if(!userData.exists()) {
        try{
        await setDoc(doc(db,"users" , user.uid), {
            name: user.displayName ? user.displayName : name,
            email,
            photoURL : user.photoURL ? user.photoURL : "",
            createdAt : new Date(),
                   });
               toast.success("Doc Created!")
               setLoading(false)
              } catch (e){
          toast.error(e.message);
          setLoading(false);
          }
         }
         else {
            toast.error("Hey The Doc already exist!");
            setLoading(false);
         }
     }




     function googleAuth () {
        setLoading(true);
        try{
         signInWithPopup(auth, provider)
         .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential.accessToken;
         
        // The signed-in user info.
         const user = result.user;
         console.log("user>>" , user);
         toast.success("User Authenticated!");
         setLoading(false);
         createDoc(user);
         navigate('/dashboard');
        // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
           
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
        // The email of the user's account used.
        // const email = error.customData.email;
        // // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
  });
        }catch(e){
            toast.error(e.message);
            setLoading(false);
        }
     }


  return (
    <>
     {loginForm ? ( <div className='signup-wrapper'>
        <h2 className='title'>Login On <span style={{color:"var(--theme"}}>Financely</span></h2>
        <form action="">
           
            <Input label={"Email"} state={email} type="email" setState={setEmail} placeholder={"JohnDoe@gmail.com"} />
            <Input label={"Password"} state={password} type="password" setState={setPassword} placeholder={"Your Password"} />
            
           
           {/* buttons are here  */}
            <Button disabled={loading} text={ loading ? "Loading..." : "Login using Email and Password"} onClick={loginUsingEmail} />
            <p className='p-login'>or</p>
            <Button  blue={true} onClick={googleAuth} text={loading ? "Loading..." :"Login using Google "}  />
            <p className='p-login' style={{cursor:"pointer"}} onClick={() => setLoginForm(!loginForm)}>  Or Create an Account : <span style={{color:"#2970ff"}}>Click Here</span> </p>
        </form>
    </div>
    ):( 
    <div className='signup-wrapper'>
        <h2 className='title'>Sign Up On <span style={{color:"var(--theme"}}>Financely</span></h2>
        <form action="">
            <Input label={"Full Name"} state={name} setState={setName} placeholder={"John Doe"} />
            <Input label={"Email"} state={email} type="email" setState={setEmail} placeholder={"JohnDoe@gmail.com"} />
            <Input label={"Password"} state={password} type="password" setState={setPassword} placeholder={"Your Password"} />
            <Input label={"Confirm Password"} state={confirmPassword}  type="password" setState={setConfirmPassword} placeholder={"Confirm Password"} />
           
           {/* buttons are here  */}
            <Button disabled={loading} text={ loading ? "Loading..." : "Signup using Email and Password"} onClick={SignupWithEmail} />
            <p className='p-login'>or</p>
            <Button disabled={loading} blue={true} onClick={googleAuth} text={loading ? "Loading..." :"Signup using Google "}  />
            <p className='p-login' style={{cursor:"pointer"}} onClick={() => setLoginForm(!loginForm)}>Or Have An Account Already? <span style={{color:"#2970ff"}}>Click Here</span>  </p>
        </form>
    </div>)}
    </>
  )
}

export default SignupSigninComponent
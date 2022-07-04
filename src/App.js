import './App.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user, setUser]  = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''

  })
  
  const provider = new firebase.auth.GoogleAuthProvider();

  const handelSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name : displayName,
        email : email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(res)
      console.log(displayName, photoURL, email)
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handelSignOut = () => {
    firebase.auth().signOut()
    .then (res => {
      const signedOutUser = {
        isSignedIn: false,
        name : '',
        photo : '',
        email : '',
        password : '',
        error:'',
        isValid : false,
        existingUser: false
      }
      setUser(signedOutUser);
    })
    .catch(arr => {

    })
  }

  const is_valid_email = email => /^.+@.+\..+$/.test(email);
  const hasNumber = input =>  /\d/.test(input);

  const switchForm = e => {
      const createdUser = {...user}
      createdUser.existingUser = e.target.checked;
      createdUser.error = '';
      setUser(createdUser);
      console.log(e.target.checked)
  }

  const handelChange = e => {
    const newUserInfo = {
      ...user
    };

    let isValid = true;
    if(e.target.name === 'email'){
      isValid = (is_valid_email(e.target.value));
    }

    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }


    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
    // console.log(newUserInfo);
    // console.log(e.target.name, e.target.value);
  }

  const createAcount = (event) => {
    
    if(user.isValid){
      console.log("data seve setUser",user.email, user.password);
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res)
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err =>{
          console.log(err.message);
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
      })
    }
    else{
      console.log('form is not valid', {email: user.email, pass: user.password})
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {

    if(user.isValid){
      console.log("data seve setUser",user.email, user.password);
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res)
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err =>{
          console.log(err.message);
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
      })
    }


    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        //if else er condition short cut lekhar upoy
        user.isSignedIn 
        ? 
        <button onClick={handelSignOut}>Sign Out</button> 
        :
        <button onClick={handelSignIn}>Sign In</button>

      }

      {
        user.isSignedIn && 
        <div style={{margin:'10px'}}>
          <img src={user.photo} alt="" />
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
        </div>  
      }

      <h1>Our Own Authentication</h1>

      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label>

      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        
        <input type="text" onBlur={handelChange} name="email" placeholder="Enter Your Email" required />
        <br />
        <input type="text" onBlur={handelChange} name="password" placeholder="Enter Your Password" required />
        <br />
        <input type="submit" value="SignIn" />
      </form>

      <form style={{display: user.existingUser ? 'none' : 'block'}} onSubmit={createAcount}>
        <input type="text" onBlur={handelChange} name="name" placeholder="Enter Your Name" required />
        <br />
        <input type="text" onBlur={handelChange} name="email" placeholder="Enter Your Email" required />
        <br />
        <input type="text" onBlur={handelChange} name="password" placeholder="Enter Your Password" required />
        <br />
        <input type="submit" value="Create Acount" />
      </form>

      {
        user.error && <p style= {{color: 'red'}}>{user.error}</p>
      }

    </div>
  );
}

export default App;

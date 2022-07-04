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
  
  //google signIn er maddome korte hole ekta provider lage(jeta bole debe ei email ta authenticated)
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
    })

    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
  // console.log("setUser",user) ////eikhane res.user er data gulo setUser() e set kora hosse sei data gulo payo jasse user state e

  const handelSignOut = () => {
    //signOut() ta firebase.auth er ekta function
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
      //amra jehetu setUser(signedOutUser) setUser er object notun kore set kore disi
      //object gulo set hosse signOut button click korle
      setUser(signedOutUser);
    })
    .catch(arr => {
    })
  }
  // console.log('signOut user',user)//eikhane state er object maan gulo empty hoye jabe (signedOutUser) er jonno





  const is_valid_email = email => /^.+@.+\..+$/.test(email);//email valid korar jonno is_valid_email function er sotto puron korte hobe
  const hasNumber = input =>  /\d/.test(input);//pasword valid korar jonno hasNumber function er sotto puron korte hobe

  const switchForm = e => {
      const createdUser = {...user}
      //user State e existingUser er = value set kortece
      createdUser.existingUser = e.target.checked;//(e.target.checked) er maan tru or false hobe
      createdUser.error = '';
      setUser(createdUser);
      console.log(e.target.checked)
  }

  //handleChange e amra form er input tag thake value nisce
  const handelChange = e => {
    const newUserInfo = {
      //amader user state e je properties/object gulo ase (...user) er maddome seigulo antece
      //object gulo anar karon holo =(state er jei object gulo ase sei object gulote value set korar jonno)
      ...user
    };
    // console.log("newUserInfo",newUserInfo);//handleChange e click korle useState er object gulo astese

    //amra inputTag e je email r password disce seta thik kina ta check kortece
    let isValid = true;
    if(e.target.name === 'email'){
      //email intupTag e je value disce seta (is_valid_email) er sotto upor kore kina tai check kortece
      //check korar por return korbe true or false
      isValid = (is_valid_email(e.target.value));
    }
    if(e.target.name === "password"){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    //newUserInfo[e.target.name]-> er maddome amra useState er vitorer object e = inputTag er value ta set kortece
    //state er object basai kortese je vabe:  name="name" = (state er name object)
    //state er object basai kortese je vabe: : name="email" = (state er email object)
    //state er object basai kortese je vabe: : name="password" = (state er password object)
    //je je input tag e lickbo sei sei (state er object) er = naam set hobe
    newUserInfo[e.target.name] = e.target.value;

    //useState er isValid je object ase seitar naam set kortece
    newUserInfo.isValid = isValid;

    //newUserInfo er maddome useState er je je object e maan set korce seigulo (user state) e set kortece
    setUser(newUserInfo);

    // console.log(newUserInfo);
    // console.log(e.target.name, e.target.value);
  }

  const createAcount = (event) => {

    // console.log("createAcount", user.name, user.password)//handleChange er maan gulo (user state) e pasce
    
    //user State er isValid jothy true hoy tahole if er vitorer duckbe
    if(user.isValid){
      console.log("data seve setUser",user.email, user.password); 
      //(createUserWithEmailAndPassword) er maddome firebase e (email & password) pathasce
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log(res)
        //(...user) er maddome amra user state er object/ propertis gulo nisce
        const createdUser = {...user}
        //user State er isSignedIn er value amra eikhane true kore disce
        createdUser.isSignedIn = true;
        ////useState er error object e = '' string kore disce
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err =>{
          console.log(err.message);
          //jothy kno error thake tahole state er data gulo eki thakbe sudu (isSignedIn = false)hobe
          //tarmane signedIn hobe na
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          //useState er error object e = err.message ta bosasce
          createdUser.error = err.message;
          setUser(createdUser);
      })
    }
    else{
      console.log('form is not valid', {email: user.email, pass: user.password})
    }
    //event ta dorkar hoyse nicher deita kaj er jonn
    event.preventDefault();//from ta sathe sathe load na hoy sei jonno
    event.target.reset();// Create Acount btn e click korar por from er value gulo mosar jonno
  }

  const signInUser = event => {

    //inputtag e je email and password disce
    console.log("userState",user.email, user.password);
    console.log("userState", user)

    if(user.isValid){
      //sign in korar jonno firebase e data thake user r password niye
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        console.log("res", res)
        const createdUser = {...user}
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
        console.log("userState", user)
      })
      .catch(err =>{
          console.log(err.message);
          const createdUser = {...user}
          createdUser.isSignedIn = false;
          createdUser.error = err.message;
          setUser(createdUser);
      })
      console.log("userState2", user)
    }


    
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        //if else condition ke short cut lekhar upoy (? eta if condition er jonno) (: else condition er jonno)
        user.isSignedIn 
        ? 
        <button onClick={handelSignOut}>Sign Out</button> 
        :
        <button onClick={handelSignIn}>Sign In</button>

      }

      {
        // (&&) eita mane hosse isSignedIn jothy true hoy
        user.isSignedIn && 
        <div style={{margin:'10px'}}>
          {/* data gule user state thake neyo hosse */}
          <img src={user.photo} alt="" />
          <p>Welcome, {user.name}</p>
          <p>Your Email : {user.email}</p>
        </div>  
      }

      <h1>Our Own Authentication</h1>

      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm">Returning User</label>

      {/* amra input tag gulo form er vitore disi tar karon(jothy form er vitor na dei tahole create  btn e click korle undefine ekta man chole astese r form er vitore inputTag e (required) dile input tag gule fill na korle btn e kaj korbe na) */}
      <form style={{display: user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        {/* onBlur={} hosse input tag er vitore amra jeta lickbo ba ja kisu change korbo ta setake capture korar jonno */}
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
        // && mane bujasse jothy error thase state e tahole dekhabe
        user.error && <p style= {{color: 'red'}}>{user.error}</p>
      }

    </div>
  );
}

export default App;

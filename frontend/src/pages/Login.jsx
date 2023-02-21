import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import authService from '../services/authService'
import { useContext } from 'react';
import { UserContext } from "../utils/globalContext";


function Login() {
  const {user, setUser} = useContext(UserContext)
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  
  const { email, password } = formData

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
    // console.log("formData: ", formData)
  }

  

  const handleSubmit = (e) => {

    async function tryLogin(userData) {
      // const tryLogin = async (userData) => {
        let user = await authService.login(userData);
     
        console.log('Here is what we are getting back from login: ',user);
        if(!user._id) {
          setErrorMessage('Invalid user name or password')
        }
        
        if(user._id) {
          setUser(user.name)
          navigate('/')
        }
      }

    e.preventDefault()
    const userData = {
      email,
      password,
    }
    tryLogin(userData)
  }
    

  
  
  return (
    
    <>
    <section className="center">
      <h1>Login</h1>
      <p>Please log in</p>
    </section>
    <section>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column',alignItems: 'center'}}>
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='email'
        label='Email'
        value={email}
        variant='outlined'
        onChange={onChange} />
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='password'
        label='Password'
        type="password"
        value={password}
        variant='outlined'
        onChange={onChange} />
        <Button
          variant='contained'
          disabled={ email && password ? false : true }
          size='small'
          sx={{ mt: "0rem", mb: '1rem', width: {sm: 300, md: 400, lg: 500}, height: '2.5rem' }}
          onClick={(e) => { handleSubmit(e) }}
          >Submit
      </Button>
    <div>{errorMessage}</div>
      </Box>
    </section>
    </>
  )
}

export default Login
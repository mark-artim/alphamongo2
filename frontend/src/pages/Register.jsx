import { useState, useEffect } from "react"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import authService from '../services/authService'
import CheckIcon from '@mui/icons-material/Check';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password2: '',
  })
  
  const { name, email, phone, password, password2 } = formData

  const onChange = (e) => {
    console.log('e: ',e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
    console.log("formData: ", formData)
  }

  const onSubmit = (e) => {
    // e.preventDefault()
    const userData = {
      name,
      email,
      phone,
      password,
    }
    authService.register(userData)
  }
  
  return (
    
    <>
    <section className="center">
      <h1>Register</h1>
      <p>Please create an account</p>
    </section>
    <section>
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column',alignItems: 'center'}}>
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='name'
        label='Name'
        value={name}
        variant='outlined'
        onChange={onChange} />
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='email'
        label='Email'
        value={email}
        variant='outlined'
        onChange={onChange} />
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='phone'
        label='Phone'
        value={phone}
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
        { password.length < 6 ? <p style={{fontWeight: "100",color: 'red'}}>Password must be at least 6 characters.</p> : <CheckIcon /> }
        <TextField
        sx={{m:1, width: {sm: 300, md: 400, lg: 500}}}
        id='password2'
        label='Confirm Password'
        type="password"
        value={password2}
        variant='outlined'
        onChange={onChange} />
        { password && password !== password2 ? <p style={{fontWeight: "bold",color: 'red'}}>Passwords do not match!</p> : <p></p> }
        <Button
          variant='contained'
          disabled={ name && email && phone && password && password === password2 ? false : true }
          size='small'
          sx={{ mt: "0rem", mb: '1rem', width: {sm: 300, md: 400, lg: 500}, height: '2.5rem' }}
          onClick={() => { onSubmit() }}
          >Submit
      </Button>
      </Box>
    </section>
    </>
  )
}

export default Register
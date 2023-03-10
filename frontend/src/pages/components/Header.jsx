import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { UserContext } from '../../utils/globalContext';
import { useContext } from 'react';
import { TheMenu } from '../../utils/TheMenu'

const Header = () => {
    
    const {user, setUser} = useContext(UserContext)

  return (
    <Paper elevation={6} sx={{mb: "25px"}}>
    <header id='mainheader' className='mainheader'>
        <div className='logo'>
            { user !== '' ? <TheMenu /> : '' }
            <Link to='/' style={{ fontSize: '2rem', color: 'black', textDecoration: 'none', fontWeight: '900' }}>Jack ERP</Link>
        </div>
        {user !== '' ? <div>Hello {user}!</div> : <div></div>}
        <div className='mainheader'>
            { user === '' ?
            <div className="mainheader">
                <p style={{ marginRight: '2rem'}}>
                <Link to='/login' style={{ color: 'black', textDecoration: 'none' }}>
                    <LoginIcon /> Login
                </Link>
            </p>
            <p>
                <Link to='/register' style={{ color: 'black', textDecoration: 'none' }}>
                    <PersonAddIcon /> Register
                </Link>
            </p>
            </div> :
            <p style={{ marginRight: '2rem'}}>
                <Link to='/login' style={{ color: 'black', textDecoration: 'none' }} onClick={() => setUser('')}>
                    <LogoutIcon /> Logout
                </Link>
            </p>}
            
        </div>
        
    </header>
    </Paper>
  )
}

export default Header
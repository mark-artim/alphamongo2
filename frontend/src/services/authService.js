

const API_URI = '/api/users'

//Register User
const register = async (userData) => {
    console.log('I made it to authService Register!!',userData)
    fetch(API_URI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Data: ", data)
        localStorage.setItem('user',JSON.stringify(data))
        // return data
    })
    .catch((error) => {
        console.error('There was a problem with your Register fetch operation:', error)
        // return error
    })
}


//Login User
const login = (userData) => {
    console.log('I made it to authService Login!!',userData)
    return fetch(API_URI+'/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(userData)
    })
    .then((response) => response.json())
    .then((data) => {
        // console.log("Data: ", JSON.stringify(data))
        localStorage.setItem('user',JSON.stringify(data))
        return data
        
    })
    .catch((error) => {
        console.error('There was a problem with your login fetch operation:');
        console.error(error);
        // return ({message: "Fetch failed!"});
        return error;
    })
}

const authService = {
    register,
    login
}

export default authService
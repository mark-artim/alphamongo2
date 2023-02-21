const API_URI = '/api/customers/'

//GET Customer
const get = async (cn) => {
    console.log('I made it to customerService Get!!',cn)
    return fetch(API_URI+cn, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        // body: JSON.stringify(cn)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Customer Get fetch operation:', error)
        return error
    })
}

//SEARCH Customer
const search = async (cn) => {
    console.log('I made it to customerService Search!!',cn)
    return fetch(API_URI+'search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        // body: (cn)
        body: JSON.stringify({text: cn})
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Search Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Customer Get fetch operation:', error)
        return error
    })
}

//CREATE Customer
const create = async (custData) => {
    console.log('I made it to custoemrService Create!!',custData)
    return fetch(API_URI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(custData)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Create Cust Response Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Customer Create fetch operation:', error)
        return error
    })
}

//UPDATE Customer
const update = async (updateData) => {
    console.log('I made it to customerService UPDATE!!',updateData)
    return fetch(API_URI+updateData._id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(updateData)
    })
    .then((response) => response.json())
    .then((data) => {
        // console.log("Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Customer Create fetch operation:', error)
        return error
    })
}

//DELETE Customer
const del = async (cn) => {
    console.log('I made it to customerService Delete!!',cn)
    return fetch(API_URI+cn, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
          },
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Customer Get fetch operation:', error)
        return error
    })
}

const customerService = {
    create,
    get,
    update,
    del,
    search,
}

export default customerService
const API_URI = '/api/products/'

//GET Product
const get = async (pn) => {
    console.log('I made it to productService Get!!',pn)
    return fetch(API_URI+pn, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        // body: JSON.stringify(pn)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Product Get fetch operation:', error)
        return error
    })
}

//SEARCH Product
const search = async (pn) => {
    console.log('I made it to productService Search!!',pn)
    return fetch(API_URI+'search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        // body: (pn)
        body: JSON.stringify({text: pn})
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Search Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Product Get fetch operation:', error)
        return error
    })
}

//CREATE Product
const create = async (prodData) => {
    console.log('I made it to productService Create!!',prodData)
    return fetch(API_URI, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        body: JSON.stringify(prodData)
    })
    .then((response) => response.json())
    .then((data) => {
        console.log("Create Prod Response Data: ", data)
        return data
    })
    .catch((error) => {
        console.error('There was a problem with your Product Create fetch operation:', error)
        return error
    })
}

//UPDATE Product
const update = async (updateData) => {
    console.log('I made it to productService UPDATE!!',updateData)
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
        console.error('There was a problem with your Product Create fetch operation:', error)
        return error
    })
}

//DELETE Product
const del = async (pn) => {
    console.log('I made it to productService Delete!!',pn)
    return fetch(API_URI+pn, {
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
        console.error('There was a problem with your Product Delete fetch operation:', error)
        return error
    })
}

const productService = {
    create,
    get,
    update,
    del,
    search,
}

export default productService
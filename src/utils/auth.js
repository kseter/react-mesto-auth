export const BASE_URL = 'https://auth.nomoreparties.co'

export const register = (email, password) => {
    return fetch (`${BASE_URL}/signup`, {
        method: 'POST',
        headers: 
         {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            'email': email, 
            'password': password
        })
    })
    // .then((response) => {
    //     return response.json();
    // })
}

export const login =(email, password) => {
    return fetch (`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                'password': password,
                'email': email
            } 
        )
    })
    // .then((response) => {
    //     return response.json();
    // })
    // .then((data) => {
    //     if(data.token){
    //         localStorage.setItem('jwt', data.token)
    //         return data
    //     } else {
    //         return
    //     }
    // })
}

export const getContent = (token) => {
    return fetch (`${BASE_URL}/users/me`, {
        method: 'GET', 
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((response) => {
        return response.json();
    }).then(data => data)
}


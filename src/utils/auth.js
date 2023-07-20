export const BASE_URL = 'https://auth.nomoreparties.co'

export const register = (email, password) => {
    return fetch (`${BASE_URL}/signup`, {
        method: 'POST',
        headers: 
         {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then((res) => {
        if (res.ok) {
            return res.json()
        } else if (res.status === 400) {
            throw new Error(`${res.status} - некорректно заполнено одно из полей `);
        } 
    })
};

export const login = (email, password) => {
    return fetch (`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then((res) => {
        if(res.ok) {
            return res.json();
        } else if (res.status === 400) {
            throw new Error(`${res.status} - не передано одно из полей`);
        } else if (res.status === 401) {
            throw new Error(`${res.status} - пользователь с email не найден`);
        } 
    })
    // .then((data) => {
    //     if(data.token){
    //         localStorage.setItem('jwt', data.token)
    //         return data
    //     } else {
    //         return
    //     }
    // })
};

export const checkToken = (token) => {
    return fetch (`${BASE_URL}/users/me`, {
        method: 'GET', 
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`,
        }
    })
    .then((res) => {
        if (res.ok) {
            return res.json()
        } else if (res.status === 400) {
            throw new Error(`${res.status} — Токен не передан или передан не в том формате`);
        } else if (res.status === 401) {
            throw new Error(`${res.status} - — Переданный токен некорректен`);
        } 
    })
    .then(data => data);
};


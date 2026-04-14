class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Error: ${res.status}`);
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse);
    }

    getAppInfo() {
        return Promise.all([this.getInitialCards(), this.getUserInfo()])
    }

    getInitialCards() {
return this._request(`${this._baseUrl}/cards`, {
    headers: this._headers,
    })
}

    addCard({name, link}) {
    return this._request(`${this._baseUrl}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
            name: name,
            link: link
        }),
    });
    }


   editUserInfo({name, about}) {
        return this._request(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                name: name, 
                about: about
            }),
        });
    }


    editUserAvatar({avatar}) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
            avatar: avatar
        }),
    });
}

deleteCard(id) {
        return this._request(`${this._baseUrl}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
        });
} 

    getUserInfo() {
        return this._request(`${this._baseUrl}/users/me`, {
            headers: this._headers,
        });
    }

    checkLikeStatus (id, isLiked) {
        return this._request(`${this._baseUrl}/cards/${id}/likes`, {
            method: isLiked ? "DELETE" : "PUT",
            headers: this._headers,
        });
} 
}

export default Api;
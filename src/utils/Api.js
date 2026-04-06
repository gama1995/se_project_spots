class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    getAppInfo() {
        return Promise.all([this.getInitialCards(), this.getUserInfo()])
    }

    getInitialCards() {
return fetch(`${this._baseUrl}/cards`, {
    headers: this._headers,
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
       return Promise.reject(`Error: ${res.status}`);
    }); 
    }

    addCard({name, link}) {
    return fetch(`${this._baseUrl}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify({
            name: name,
            link: link
        })
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }   
         return Promise.reject(`Error: ${res.status}`);
    });
}

   editUserInfo({name, about}) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                name: name, 
                about: about
            })
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
           return Promise.reject(`Error: ${res.status}`);
        });
    }


    editUserAvatar({avatar}) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
        method: "PATCH",
        headers: this._headers,
        body: JSON.stringify({
            avatar: avatar
        })
    }).then((res) => {
        if (res.ok) {
            return res.json();
        }
      return Promise.reject(`Error: ${res.status}`);
        
    });
}

deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
           return Promise.reject(`Error: ${res.status}`);
        });
} 

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers,
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
          return Promise.reject(`Error: ${res.status}`);
        });
    }

    checkLikeStatus (id, isLiked) {
        return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: isLiked ? "DELETE" : "PUT",
            headers: this._headers,
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
           return Promise.reject(`Error: ${res.status}`);
        });
} 
}

export default Api;
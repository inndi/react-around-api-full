class Api {
  constructor(fetchData) {
    this._baseUrl = fetchData.baseUrl;
    this._headers = fetchData.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  delete(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  postNewCardData(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: card.name,
        link: card.link
      })
    })
      .then(this._checkResponse);
  }

  patchProfileData(editFields) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: editFields.name,
        about: editFields.about
      })
    })
      .then(this._checkResponse);
  }

  patchAvatar(fieldValue) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: fieldValue.avatar,
      })
    })
      .then(this._checkResponse);
  }

  changeLikeCardStatus(itemId, isLiked) {
    if (isLiked) {
      return fetch(`${this._baseUrl}/cards/likes/${itemId}`, {
        method: 'DELETE',
        headers: this._headers
      })
        .then(this._checkResponse);
    } else if (!isLiked) {
      return fetch(`${this._baseUrl}/cards/likes/${itemId}`, {
        method: 'PUT',
        headers: this._headers
      })
        .then(this._checkResponse);
    }
  }
}

const api = new Api({
  baseUrl: "https://around-the-us.students.nomoreparties.sbs",
  headers: {
    authorization: "2f92e6f8-d3bf-4f0b-b7c9-ecb844a65d7b",
    "Content-Type": "application/json"
  }
});

export default api;
import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import '../index.css';
import unsuccessReg from '../images/unsuccessReg.svg';
import successReg from '../images/successReg.svg';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { EditProfilePopup } from "./EditProfilePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { AddPlacePopup } from "./AddPlacePopup";
import { ConfirmationPopup } from "./ConfirmationPopup";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as auth from '../utils/auth.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isAuthPopupOpen, setIsAuthPopupOpen] = useState(false);
  const [isSelectedCard, setIsSelectedCard] = useState(false);
  const [isNavActive, setIsNavActive] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [buttonText, setButtonText] = useState('');

  const [loggedIn, setLoggedIn] = useState(false);

  const [isRegistered, setIsRegistered] = useState('');
  const history = useHistory();

  const [email, setEmail] = useState('');

  function handleRegisterSubmit(email, password) {
    auth.register(email, password)
      .then((res) => {
        if (res.status !== 400) {
          setIsRegistered('true');
          setEmail(email);
          setLoggedIn(true);
          history.push('/')
        } else {
          setIsRegistered('false');
        }
      })
      .catch((err) => {
        setIsRegistered('false');
        console.log(err);
      })
      .finally(() => {
        setIsAuthPopupOpen(true);
      });
  }

  function handleAuthorizeSubmit(email, password) {
    if (!email || !password) {
      return;
    }
    auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          setEmail(email);
          setLoggedIn(true);
          setIsNavActive(false);
          history.push('/');
        }
      })
      .catch((err) => console.log(err));
  }

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth.getContent(jwt)
        .then((res) => {
          setEmail(res.data.email);
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => console.log(err));
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [])

  function handleEditProfileClick() {
    setButtonText('Save');
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setButtonText('Create');
    setIsAddPlacePopupOpen(true);
  }


  function handleEditAvatarClick() {
    setButtonText('Save');
    setIsEditAvatarPopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setIsDeleteCardPopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsSelectedCard(false);
    setIsAuthPopupOpen(false);
    setIsNavActive(false);
    setIsRegistered('');
  }

  function handleCardClick(card) {
    setIsSelectedCard(true);
    setSelectedCard(card);
  }

  function handleUpdateUser(userInfo) {
    setButtonText('Saving...');
    api.patchProfileData(userInfo)
      .then((user) => {
        setCurrentUser(user);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(function () {
        setButtonText('Save');
      });
  }

  function handleUpdateAvatar(fieldValue) {
    setButtonText('Saving...');
    api.patchAvatar(fieldValue)
      .then((user) => {
        setCurrentUser(user);

      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(function () {
        setButtonText('Save');
      });
  }

  useEffect(() => {
    api.getUserInfo()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  function handleCardLike(card) {
    const isLiked = card.likes.some(user => user._id === currentUser._id);
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((currentCard) => currentCard._id === card._id ? newCard : currentCard));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(currentCard) {
    api.delete(currentCard._id)
      .then(() => {
        const newCards = cards.filter((card) => card._id !== currentCard._id);
        setCards(newCards);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    api.getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleAddPlaceSubmit(card) {
    setButtonText('Creating...');
    api.postNewCardData(card)
      .then((card) => {
        setCards([card, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(function () {
        setButtonText('Create');
      });
  }

  function handleOnSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/signin');
  }

  function handlerNav() {
    if (window.innerWidth < 657) {
      setIsNavActive(true);
    }
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Switch>

            <Route path="/signup">
              <Register handleAuthSubmit={handleRegisterSubmit} />
              {(isRegistered === 'false') && <InfoTooltip
                isOpen={isAuthPopupOpen}
                onClose={closeAllPopups}
                imgSrc={unsuccessReg}
                title='Oops, something went wrong! Please try again.' />}
            </Route>

            <Route path="/signin">
              <Login handleAuthSubmit={handleAuthorizeSubmit} />
            </Route>

            <ProtectedRoute path="/" loggedIn={loggedIn} >

              <Header isNavActive={isNavActive} onClose={closeAllPopups}>
                <div className={`header__container ${isNavActive ? 'header__container_active' : ''}`}
                  onClick={handlerNav}>
                  <p className="header__email">{email}</p>
                  <button className="header__button hover-btn" onClick={handleOnSignOut}>Log out</button>
                </div>
              </Header>

              <Main
                onEditProfileClick={handleEditProfileClick}
                onEditAvatarClick={handleEditAvatarClick}
                onAddPlaceClick={handleAddPlaceClick}
                onDeleteClick={handleDeleteCardClick}
                onCardClick={handleCardClick}
                cards={cards}
                onCardLike={handleCardLike}
              />
              <Footer />

              {(isRegistered === 'true') && <InfoTooltip
                isOpen={isAuthPopupOpen}
                onClose={closeAllPopups}
                imgSrc={successReg}
                title='Success! You have now been registered.' />}

              <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
                buttonText={buttonText} />

              <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlaceSubmit={handleAddPlaceSubmit}
                buttonText={buttonText} />

              <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
                buttonText={buttonText}
              />

              <ConfirmationPopup
                isOpen={isDeleteCardPopupOpen}
                onClose={closeAllPopups}
                card={selectedCard}
                onCardDelete={handleCardDelete}
              />

              <ImagePopup
                card={selectedCard}
                isOpen={isSelectedCard}
                onClose={closeAllPopups} />

            </ProtectedRoute>

          </Switch>

        </div>
      </div>
    </CurrentUserContext.Provider >
  );
}

export default App;

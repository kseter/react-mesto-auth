import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate} from "react-router-dom"
import '../index.css';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import * as authorization from '../utils/auth.js';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';

function App() {
//popups states 
	const [isEditProfilePopupOpen, setEditProfileOpen] = useState(false)
	const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false)
	const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false)
	const [isFullscreenCardOpen, setFullscreenCardOpen] = useState(false)
	const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false)
	// const [isCardDeletePopupOpen, setCardDeletePopupOpen] = useState(false)
//cards&user states
	const [selectedCard, setSelectedCard] = useState({})
	const [currentUser, setCurrrentUser] = useState({})
	const [cards, setCards] = useState([])
//login&registration states 
	const [loggedIn, setLoggedIn] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const [isRegisterOk, setRegisterOk] = useState(false)
	const [isRegisterFailure, setRegisterFailure] = useState(false)
	const [textInfoTooltip, settextInfoTooltip] = useState('')
	const navigate = useNavigate()
	
//before page will be loaded 

//check the token
	const auth =(jwt)=> {
		return authorization.getContent(jwt)
		.then((res) => {
			if(res){
				setLoggedIn(true); 
				setUserEmail(res.data.email) //put email data to the header on '/' page
			}
		})
	}

	useEffect(() => {
		const jwt = localStorage.getItem('jwt'); //get the token from the storage 
		if(jwt) {
			auth(jwt)
		}
	}, [])

	useEffect(() => {
		if (loggedIn) {
			navigate('/')
		}
	}, [loggedIn])
//put updated data to user profile
	useEffect(() => {
		api.requestUserInfo()
		.then((data) => {
			setCurrrentUser(data) 
		})
		.catch((err) => {
			console.log(err)
		})
	}, [])
//load the cards
	useEffect(() => {
		api.getInitialCards()
		.then((cards) => {
           setCards(cards);
        })
		.catch((err) => {
			console.log(err)
		})
	}, [])
//finctions for to change popup states 
	function handleEditAvatarClick() {
		setAvatarPopupOpen(true);
    }

    function handleEditProfileClick(){
		setEditProfileOpen(true);
    }

   function handleAddPlaceClick() {
		setAddPlacePopupOpen(true);
    }

	function handleCardClick(card){
		setSelectedCard(card);
		setFullscreenCardOpen(true)
	}

	function handleRegisterSubmit() {
		setInfoTooltipOpen(true)
	}

	// function handleCardDeleteButton(){
	// 	setCardDeletePopupOpen(true)
	// }

	function closeAllPopups(){
		setAvatarPopupOpen(false);
		setEditProfileOpen(false);
		setAddPlacePopupOpen(false);
		setFullscreenCardOpen(false)
		setInfoTooltipOpen(false)
	}
//like&delete cards with btns
	function handleCardLike(card){
		const isLiked = card.likes.some(i => i._id === currentUser._id); //check likes from user on the card

		api.changeLikeCardStatus(card._id, !isLiked)
		.then((newCard) => {
			setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
		})
		.catch((err) => {
			console.log(err)
		})
	}

	function handleCardDelete(card){
		api.deleteCard(card)
		.then(() => {
			setCards((state) => state.filter((c) => c._id !== card._id)); 
		})
		.catch((err) => {
			console.log(err)
		})
	}
//update user info/avatar by popups
	function handleUpdateUser(user){
	api.setUserInfo(user)
	.then((data) => {
		setCurrrentUser(data)
	})
	.then(() => {
		closeAllPopups()
	})
	.catch((err) => {
		console.log(err)
	})
	}

	function handleUpdateAvatar(avatar){
		api.changeAvatar(avatar)
		.then((data) => {
			setCurrrentUser(data)
		})
		.then(() => {
			closeAllPopups()
		})
		.catch((err) => {
			console.log(err)
		})
		}
//add a new card with button 
	function handleAddPlaceSubmit(card){
		api.addNewCard(card)
		.then((newCard)=> {
			setCards([newCard, ...cards]); 
		})
		.then(() => {
			closeAllPopups()
		})
		.catch((err) => {
			console.log(err)
		})
	}
//sign-in 
	const onLogin = ({email, password}) => {
		 return authorization.login(email, password)
		 .then((res) => {
			if (res.status === 400) {
				handleSignIn()
				throw new Error('Не передано одно из полей ')
			}
			if (res.status === 401) {
				handleSignIn()
				throw new Error('Пользователь с email не найден ')
			}
			return res.json();
		 }) 
		.then((res) => {
			if (res.token) {
				setLoggedIn(true);
				localStorage.setItem('jwt', res.token)
			}
		})	
		 .catch((err) => {
			console.log(err)
		})
	}
//sign-up
	const onRegister = ({email, password}) => {
		return authorization.register(email, password)
		.then((res) => {
			if (res.status === 201) {
				setRegisterOk(true) //change state for infotooltip icon type
				setRegisterFailure(false) // если не поставить false, то при успешной регистрации 
				//после неудачной попытки будет показан на попапе значок неудачной регистрации 
				settextInfoTooltip('Вы успешно зарегистрировались!') //change state for infotooltip text type
				return res
			} else {
				setRegisterOk(false)
				setRegisterFailure(true)//change state for infotooltip icon type
				settextInfoTooltip('Что-то пошло не так!Попробуйте ещё раз.') //change state for infotooltip text type
				handleRegisterSubmit() //open the infotooltip
				throw new Error('Не передано одно из полей ')
			}
		})
		.catch((err) => {
			console.log(err)
		})
	}

	//sign out
	const handleSighOut = () => {
		localStorage.removeItem('jwt')
		setUserEmail('')
		navigate('/sign-in')
	}

	const handleSignIn =()=> {
		navigate('/sign-in')
	}

	const handleSignUp =() => {
		navigate('/sign-up')
	}


  return (
		<CurrentUserContext.Provider value={currentUser}>
		<div className="App">
		<div className="page__container">
		<Header
		userEmail={userEmail} 
		handleSighOut={handleSighOut}
		handleSignIn={handleSignIn}
		handleSignUp={handleSignUp}
		/>
		<Routes>
			<Route element={<ProtectedRoute 
			loggedIn={loggedIn}/>}>
				<Route path='/' 
				element={<Main 
					cards={cards}
					onEditProfile={handleEditProfileClick}
					onAddPlace={handleAddPlaceClick}
					onEditAvatar={handleEditAvatarClick}
					onCardClick={handleCardClick}
					onCardLike={handleCardLike}
					onCardDelete={handleCardDelete} 
					/>} exact/>
			</Route>
		<Route 
		path="/sign-up" 
		element={
		<Register 
		onRegister={onRegister} 
		handleInfoTooltipOpen={handleRegisterSubmit}
		 />} />
		<Route path="/sign-in"  element={<Login onLogin={onLogin} />} />
		</Routes>
		<EditProfilePopup 
		isOpen={isEditProfilePopupOpen} 
		onClose={closeAllPopups}
		onUpdateUser={handleUpdateUser}>
		</EditProfilePopup>
		<AddPlacePopup
		isOpen={isAddPlacePopupOpen}
		onClose={closeAllPopups}
		onPlaceAdd={handleAddPlaceSubmit}>
		</AddPlacePopup>
		<EditAvatarPopup 
		isOpen={isEditAvatarPopupOpen}
		onClose={closeAllPopups}
		onUpdateAvatar={handleUpdateAvatar}>
		</EditAvatarPopup>
		<ImagePopup 
		card={selectedCard}
		isOpen={isFullscreenCardOpen}
		onClose={closeAllPopups}/>
		<InfoTooltip 
		text={textInfoTooltip}
		isOpen={isInfoTooltipOpen}
		onClose={closeAllPopups}
		isRegisterOk={isRegisterOk}
		isRegisterFailure={isRegisterFailure}
		/>
		{/* <CardDeletePopup
		isOpen={isCardDeletePopupOpen}
		onClose={closeAllPopups}
		></CardDeletePopup> */}
		<Footer />
		</div>
		</div>
		</CurrentUserContext.Provider>
  );
}

export default App;

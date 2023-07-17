import React from 'react';
import logoPath from '../images/logo.svg'
import {Route, Routes} from 'react-router-dom'
import SignBtn from './SignBtn';
import Navbar from './Navbar';


const Header = ({userEmail, handleSighOut, handleSignIn, handleSignUp}) => {

    return (
        <header className="header">
		<img src={logoPath} alt="Лого Mesto" className="header__logo" />
        <Routes>
        <Route path="/sign-up" element={<SignBtn 
		text={"Войти"}
        handleClick={handleSignIn}
        className={"header__btn_white"}
        />}/>
        <Route path="/sign-in" element={<SignBtn 
		text={"Регистрация"}
        handleClick={handleSignUp}
        className={"header__btn_white"}
        />}/>
        <Route path='/' element={ 
        <Navbar 
            userEmail={userEmail}
            handleSighOut={handleSighOut}
            />}/>
        </Routes>
	</header>
    );
};

export default Header;
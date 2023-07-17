import React from 'react';

const InfoTooltip = ({text, isOpen, onClose, isRegisterOk, isRegisterFailure}) => {
    return (
        <section className={`popup popup_type_infotooltip ${isOpen && 'popup_opened'}`}>
		<div className="popup__container popup__container_type_infotooltip">
            <div className={`popup__icon ${isRegisterOk && 'popup__icon_type_success'} 
            ${isRegisterFailure && 'popup__icon_type_failure'}`}></div>
			<h3 className="popup__text">{text}</h3>
			<button type="button" onClick={onClose} className="popup__close-button" value=" "
				aria-label="Закрыть"></button>
		</div>
	</section>
    );
};

export default InfoTooltip;
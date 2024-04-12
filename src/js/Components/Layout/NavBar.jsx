import React, { Component } from "react";
import { SECTION } from "../../Definitions";

const renderRadioButtons = (defaultIndex, buttons) => {
	return buttons.map((button, index) => (
		<React.Fragment key={index}>
			<input type="radio" className="btn-check" name="btnradio" id={`btnradio${index + 1}`} autoComplete="off" defaultChecked={index === defaultIndex}/>
			<label className="btn btn-outline-primary" htmlFor={`btnradio${index + 1}`} onClick={button.onClick}>
				{button.label}
			</label>
		</React.Fragment>
	));
};

class NavBar extends Component {
	render() {
		const { setSection, display } = this.props;
		if(!display)
			return null;
		
		return (
			<header className="navbar navbar-expand-lg sticky-top navbar-light text-dark bg-light">
				<div className="container-xxl">
					<div className="navbar-nav flex-row flex-wrap bd-navbar-nav">
						<div className="btn-group radio-group">
							{renderRadioButtons( 1, [
								{label: 'Определение класса кредитоспособности', onClick: () => setSection(SECTION.DETERMINING_THE_CREDITWORTHINESS_CLASS)},
								{label: 'Классы кредитоспособности', onClick: () => setSection(SECTION.CLASSES_LIST)},
								{label: 'Признаки', onClick: () => setSection(SECTION.ATTRIBUTES)},
								{label: 'Возможные значения признаков', onClick: () => setSection(SECTION.ATTRIBUTES_VALUES)},
								{label: 'Значение признаков для класса', onClick: () => setSection(SECTION.CLASSES_DESCRIPTION)},
								{label: 'Проверка полноты знаний', onClick: () => setSection(SECTION.CHECK_COMPLETENESS_KNOWLEDGE)},
							])}
						</div>
					</div>
				</div>
			</header>
		)
	}
}

export default NavBar;
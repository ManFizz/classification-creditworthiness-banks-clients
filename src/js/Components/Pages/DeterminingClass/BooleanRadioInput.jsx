import React, { Component } from 'react';

class BooleanRadioInput extends Component {

	render() {
		const { selectedValue, onChange } = this.props;
		return (
			<div>
				<div className="form-check">
					<input
						type="radio"
						className="form-check-input"
						id="unknown"
						value="Неизвестно"
						checked={selectedValue === null}
						onChange={() => onChange(null)}
					/>
					<label className="form-check-label" htmlFor="yes">
						Неизвестно
					</label>
				</div>
				<div className="form-check">
					<input
						type="radio"
						className="form-check-input"
						id="yes"
						value="Да"
						checked={selectedValue === true}
						onChange={() => onChange(true)}
					/>
					<label className="form-check-label" htmlFor="yes">
						Да
					</label>
				</div>
				<div className="form-check">
					<input
						type="radio"
						className="form-check-input"
						id="no"
						value="Нет"
						checked={selectedValue === false}
						onChange={() => onChange(false)}
					/>
					<label className="form-check-label" htmlFor="no">
						Нет
					</label>
				</div>
			</div>
		);
	}
}

export default BooleanRadioInput;

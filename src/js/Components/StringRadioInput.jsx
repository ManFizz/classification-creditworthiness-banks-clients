import React, { Component } from 'react';

class StringRadioInput extends Component {
	handleChange = (event) => {
		const { onChange } = this.props;
		let value = event.target.value;
		if(value.length === 0)
			value = null;
		onChange(value);
	}

	render() {
		const { allValues, selectedValue } = this.props;
		return (
			<div>
				<div className="form-check">
					<input
						type="radio"
						className="form-check-input"
						id="unknown"
						value={null}
						checked={selectedValue === null}
						onChange={this.handleChange}
					/>
					<label className="form-check-label" htmlFor="unknown">
						Неизвестно
					</label>
				</div>
				{allValues.map((value) => (
					<div key={value} className="form-check">
						<input
							type="radio"
							className="form-check-input"
							id={value}
							value={value}
							checked={selectedValue === value}
							onChange={this.handleChange}
						/>
						<label className="form-check-label" htmlFor={value}>
							{value}
						</label>
					</div>
				))}
			</div>
		);
	}
}

export default StringRadioInput;

import React, { Component } from 'react';

class StringSelectInput extends Component {

	handleChange = (event) => {
		const { selectedValues, onChange } = this.props;
		const value = event.target.value;
		let newArr = selectedValues;
		const index = newArr.indexOf(value);
		if(index === - 1)
			newArr = [...newArr, value];
		else {
			newArr.splice(index, 1);
		}

		onChange(newArr);
	}

	render() {
		const { allValues, selectedValues } = this.props;
		return (
			<div>
				{allValues.map((value) => (
					<div key={value} className="form-check">
						<input
							type="checkbox"
							className="form-check-input"
							id={value}
							value={value}
							checked={selectedValues.includes(value)}
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

export default StringSelectInput;

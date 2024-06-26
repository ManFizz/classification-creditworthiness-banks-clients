import React, { Component } from "react";

class StringArrayInput extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newString: "",
			addError: null,
		};
	}

	handleNewStringChange = (event) => {
		this.setState({ newString: event.target.value });
	};

	handleAddString = () => {
		const { newString } = this.state;

		if(this.props.value.some(s => s.localeCompare(newString.trim()) === 0)) {
			this.setState({addError: "Такое значение уже существует"});
			return;
		}

		if(newString.trim() === "") {
			this.setState({addError: "Значение не может быть пустым"});
			return;
		}

		this.props.onChange([...this.props.value, newString.trim()]);
		this.setState({ newString: "" });
	};

	handleRemoveString = (index) => {
		const newArray = [...this.props.value];
		newArray.splice(index, 1);
		this.props.onChange(newArray);
	};

	render() {
		const { value } = this.props;
		const { newString, addError } = this.state;
		return (
			<div>
				<ul className="list-group">
					{value.map((str, index) => (
						<li key={index} className="list-group-item">
							<button className="btn btn-sm btn-outline-danger" onClick={() => this.handleRemoveString(index)}>
								<i className="bi bi-trash-fill"/></button>
							<span className="mx-2">{str}</span>
						</li>
					))}
				</ul>
				<div className="input-group">
					<input type="text" className="form-control" value={newString} onChange={this.handleNewStringChange}
								 aria-describedby="btn-gr-add"/>
					<button className="btn btn-outline-success" type="button" onClick={this.handleAddString} id="btn-gr-add">
						<i className="bi bi-plus-lg"/>
					</button>
				</div>
				{addError && <div className="alert alert-danger mt-2">{addError}</div> }
			</div>
		);
	}
}

export default StringArrayInput;

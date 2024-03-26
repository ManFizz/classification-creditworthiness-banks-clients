import React, { Component } from "react";
import axios from 'axios';
import { ATTRIBUTE_TYPE } from "../Definitions";
import StringSelectInput from "./StringSelectInput";

function isTrue(attribute) {
	return attribute.value.includes(true) || attribute.value.includes('true');
}

function isFalse(attribute) {
	return attribute.value.includes(false) || attribute.value.includes('false');
}

function displayValue(attribute) {
	const warn = <span className="badge text-bg-warning">Не задано</span>;
	switch (attribute.attr.type) {
		case ATTRIBUTE_TYPE.DOUBLE :
		case ATTRIBUTE_TYPE.INT : {
			if (attribute.minValue === undefined || attribute.maxValue === undefined ||
				attribute.minValue === null || attribute.maxValue === null)
				return warn;
			return <span>от {attribute.minValue} до {attribute.maxValue}</span>;
		}
		case ATTRIBUTE_TYPE.STRING : {
			if(attribute.value === undefined)
				attribute.value = [];

			if (attribute.value.length === 0)
				return warn;
			return `${attribute.value.join(", ")}`;
		}
		case ATTRIBUTE_TYPE.BOOLEAN: {
			if(attribute.value === undefined)
				attribute.value = [];

			if(isTrue(attribute)) {
				if(isFalse(attribute))
					return <span>Да/Нет</span>;
				return <span>Да</span>;
			}

			if(isFalse(attribute))
				return <span>Нет</span>;

			return warn;

		}
		default:
			return null;
	}
}

class ClassesDescription extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			currentClass: props.classes[0] || null,
			minValue: null,
			maxValue: null,
			value: null,
		};

		this.selectRef = React.createRef();
	}

	handleEdit = (a) => {
		this.setState({
			editingId: a.id,
			minValue: a.minValue,
			maxValue:a.maxValue,
			value: a.value,
		});
	};

	handleCancel = () => {
		this.setState({ editingId: null });
	};

	handleSave = () => {
		const { currentClass, editingId, minValue, maxValue, value } = this.state;
		const attr = this.props.attributes.find(a => a.id === editingId);
		const newAttributes = [...currentClass.attributes.filter(a => a.id !== editingId), {
			id: editingId,
			attr: attr,
			minValue: minValue,
			maxValue:maxValue,
			value: value,
		}];
		this.setNewAttributes(newAttributes).then(r =>
			this.setState({ editingId: null })
		);
	}

	handleDelete = async (id) => {
		const { currentClass } = this.state;
		currentClass.attributes = currentClass.attributes.filter(a => a.id !== id);
		this.props.setProps(prevProps => ({
			classes: prevProps.classes.map(c => c.id === currentClass.id ? {...c, attributes: currentClass.attributes} : c),
		}));
	};

	handleAttributeChange = (event) => {
		const { currentClass} = this.state;
		const selectedAttributeId = event.target.value;
		if(!selectedAttributeId)
			return;

		this.selectRef.current.selectedIndex = -1;

		const newAttributes = [...currentClass.attributes, {
			id: selectedAttributeId,
			attr: this.props.attributes.find(a => a.id === selectedAttributeId),
		}];
		this.setNewAttributes(newAttributes);
	};

	setNewAttributes = async (newAttributes) => {
		const { currentClass } = this.state;
		try {
			await axios.put(`/api/classes/${currentClass.id}`, { attributes: newAttributes });
			currentClass.attributes = newAttributes;

			this.props.setProps(prevProps => ({
				classes: prevProps.classes.map(c => c.id === currentClass.id ? {...c, attributes: newAttributes} : c),
			}));
			this.setState({
				currentClass: currentClass,
			});
		} catch (error) {
			console.error('Error saving class:', error);
		}
	}

	handleClickClass = (c) => {
		this.setState({currentClass: c})
	}

	handleMinChangeInteger = (event) => {
		const value = parseInt(event.target.value);
		if (!isNaN(value)) {
			this.setState({ minValue: value });
		}
	};

	handleMaxChangeInteger = (event) => {
		const value = parseInt(event.target.value);
		if (!isNaN(value)) {
			this.setState({ maxValue: value });
		}
	};

	handleMinChangeDouble = (event) => {
		const value = parseFloat(event.target.value);
		if (!isNaN(value)) {
			this.setState({ minValue: value });
		}
	};

	handleMaxChangeDouble = (event) => {
		const value = parseFloat(event.target.value);
		if (!isNaN(value)) {
			this.setState({ maxValue: value });
		}
	};

	displayInput = (a) => {
		const { minValue, maxValue, value} = this.state;
		switch (a.attr.type) {
			case ATTRIBUTE_TYPE.INT: {
				return <>
					<label>от</label>
					<input type="number" value={minValue} min={a.attr.minValue} onChange={this.handleMinChangeInteger}/>
					<label>до</label>
					<input type="number" value={maxValue} max={a.attr.maxValue} onChange={this.handleMaxChangeInteger}/>
				</>;
			}
			case ATTRIBUTE_TYPE.DOUBLE: {
				return <>
					<label>от</label>
					<input type="number" step="any" value={minValue} min={a.attr.minValue} onChange={this.handleMinChangeDouble}/>
					<label>до</label>
					<input type="number" step="any" value={maxValue} max={a.attr.maxValue} onChange={this.handleMaxChangeDouble}/>
				</>;
			}
			case ATTRIBUTE_TYPE.STRING: {
				return <StringSelectInput selectedValues={value} allValues={a.attr.value} onChange={(v) => { this.setState({value: v}); }} />;
			}
			case ATTRIBUTE_TYPE.BOOLEAN: {
				let selectedValues = [];
				if(value.includes(true))
					selectedValues.push('Да');
				if(value.includes(false))
					selectedValues.push('Нет');
				return <StringSelectInput selectedValues={selectedValues} allValues={['Да','Нет']} onChange={(v) => {
					let newVal = [];
					if(v.includes('Да'))
						newVal.push(true);
					if(v.includes('Нет'))
						newVal.push(false);
					this.setState({value: newVal});
				}} />;
			}
			default : {
				return null;
			}
		}
	}

	render() {
		const {editingId, currentClass} = this.state;
		return (
			<>
				<header className="col-12">Список классов кредитоспособности</header>
				<div className="col-2">
					<table className="table table-hover">
						<thead className="table-light">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Название</th>
						</tr>
						</thead>
						<tbody className="table-group-divider">
						{this.props.classes.map((c, index) => (<>
								<tr key={c.id} onClick={() => this.handleClickClass(c)}
										className={(currentClass && c.id === currentClass.id) ? "table-active" : ''}>
									<th scope="row">{index + 1}</th>
									<td>{c.name}</td>
								</tr>
							</>
						))}
						</tbody>
					</table>
				</div>
				<div className="col-9 mx-2">
					<table className="table">
						<thead>
						<tr>
							<th>#</th>
							<th>Название</th>
							<th>Значения</th>
							<th>{/* Buttons */}</th>
						</tr>
						</thead>
						<tbody>
						{currentClass && currentClass.attributes
							.sort((a, b) => a.attr.name.localeCompare(b.attr.name))
							.map((a, index) => (<>
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{a.attr.name}</td>
									<td style={{maxWidth: '500px'}}>
										{a.id === editingId ? this.displayInput(a) : displayValue(a)}
									</td>
									<td className="text-center">
										{editingId === a.id ? (
											<>
												<button className="btn btn-success btn-sm mx-1" onClick={this.handleSave}>
													<i className="bi bi-floppy-fill"/>
												</button>
												<button className="btn btn-secondary btn-sm" onClick={this.handleCancel}>
													<i className="bi bi-x-lg"/>
												</button>
											</>
										) : (
											<>
												<button className="btn btn-primary btn-sm mx-1" onClick={() => this.handleEdit(a)}>
													<i className="bi bi-pencil-fill"/>
												</button>
												<button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(a.id)}>
													<i className="bi bi-trash-fill"/>
												</button>
											</>
										)}
									</td>
								</tr>
							</>))}
						</tbody>
					</table>
					{currentClass && this.props.attributes.filter(attribute => !currentClass.attributes.some(attr => attr.id === attribute.id)).length > 0 && (
						<select onChange={this.handleAttributeChange} ref={this.selectRef}>
							<option>Добавить атрибут</option>
						{this.props.attributes
							.filter(attribute => !currentClass.attributes.some(attr => attr.id === attribute.id))
							.map((attribute, index) => (
							<option key={index} value={attribute.id}>
								{attribute.name}
							</option>
						))}
					</select>
					)}
				</div>
			</>
		);
	}
}

export default ClassesDescription;
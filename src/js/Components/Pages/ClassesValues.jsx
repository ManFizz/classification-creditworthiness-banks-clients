import React, { Component } from "react";
import axios from 'axios';
import ValueFieldStatic from "./ClassesValues/ValueFieldStatic";
import { ATTRIBUTE_TYPE } from "../../Definitions";

class ClassesValues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			currentClass: props.classes[0] || null,
			value: null,
			isError: false,
		};
		this.selectRef = React.createRef();
	}

	handleEdit = (a) => {
		let value = a.value || [];
		value = value.map(val => ({
			...val,
			id: '_' + Math.random().toString(16).slice(2),
		}))

		this.setState({
			editingId: a.id,
			value: value,
			isError: false,
		});
	};

	handleCancel = () => {
		this.setState({ editingId: null });
	};

	handleSave = () => {
		const { currentClass, editingId, value } = this.state;
		const attr = this.props.attributes.find(a => a.id === editingId);
		if(attr.type === ATTRIBUTE_TYPE.DOUBLE || attr.type === ATTRIBUTE_TYPE.INT) {
			const isError = value.some(newValue => {
				if (newValue.minValue > newValue.maxValue) {
					return true;
				}

				return !attr.value.some(checkValue =>
					newValue.minValue >= checkValue.minValue && newValue.maxValue <= checkValue.maxValue
				);
			});

			if(isError) {
				this.setState({ isError: true });
				return;
			}
		}

		const newAttributes = [...currentClass.attributes.filter(a => a.id !== editingId), {
			id: editingId,
			attr: attr,
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
		this.setNewAttributes(newAttributes).then();
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

	render() {
		const {editingId, currentClass, value, isError} = this.state;
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
								<tr key={a.attr.id}>
									<th scope="row">{index + 1}</th>
									<td>{a.attr.name}</td>
									<td style={{maxWidth: '500px'}}>
										<ValueFieldStatic isEdit={a.id === editingId} attribute={a} value={value}
																			setProps={data => this.setState(data)}/>
										{a.id === editingId && isError && (
											<div className="alert alert-danger" role="alert">
												Ошибка! Проверьте правильность введенных данных!
											</div>
										)}
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
							<option key={"option"+attribute.id} value={attribute.id}>
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

export default ClassesValues;
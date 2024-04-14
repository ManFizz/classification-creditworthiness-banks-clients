import React, { Component } from "react";
import axios from "axios";

class AttributesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			newName: "",
			newAttributeName: "",
			addError: null,
		};
	}

	handleNewAttributeNameChange = (event) => {
		this.setState({
			newAttributeName: event.target.value,
		}, () => this.checkNewAttributeField());
	};

	checkNewAttributeField = () => {
		const { newAttributeName } = this.state;

		if(this.props.attributes.some(c => c.name.localeCompare(newAttributeName.trim()) === 0)) {
			this.setState({addError: "Признак с таким наименованием уже существует"});
			return false;
		}

		this.setState({addError: null});
		return true;
	}

	handleAdd = async () => {
		if(!this.checkNewAttributeField())
			return;

		const { newAttributeName } = this.state;
		if(newAttributeName.trim() === '' ) {
			this.setState({addError: "Имя признака не может быть пустым"});
			return;
		}

		try {
			const response = await axios.post('/api/attributes', {
				name: newAttributeName
			});

			const newAttribute = response.data;
			newAttribute.id = newAttribute._id;
			this.props.setProps(prevProps => ({
				attributes: [...prevProps.attributes, newAttribute],
			}));
			this.setState({
				newAttributeName: "",
			});
		} catch (error) {
			console.error('Error adding attribute:', error);
		}
	};

	handleDelete = async (id) => {
		try {
			await axios.delete(`/api/attributes/${id}`);

			this.props.setProps(prevProps => ({
				attributes: prevProps.attributes.filter(c => c.id !== id),
				classes: prevProps.classes.map(c => ({
					...c,
					attributes: c.attributes.filter(a => a.id !== id)
				})),
			}));
		} catch (error) {
			console.error('Error deleting attribute:', error);
		}
	};

	handleEdit = (id) => {
		const { attributes } = this.props;
		this.setState({
			editingId: id,
			newName: attributes.find(c => c.id === id).name
		});
	};

	handleChange = (event) => {
		this.setState({ newName: event.target.value });
	};

	handleSave = async () => {
		try {
			const { editingId, newName } = this.state;
			await axios.put(`/api/attributes/${editingId}`, { name: newName });

			this.props.setProps(prevProps => ({
				attributes: prevProps.attributes.map(c => c.id === editingId ? { ...c, name: newName } : c),
			}));
			this.setState({
				editingId: null,
				newName: "",
			});
		} catch (error) {
			console.error('Error saving attribute:', error);
		}
	};

	handleCancel = () => {
		this.setState({
			editingId: null,
			newName: "",
		});
	};

	render() {
		const { newName, editingId, newAttributeName, addError } = this.state;
		const { attributes } = this.props;
		return (
			<>
				<header className="col-12">Список признаков</header>
				<div className="col-12">
				<table className="table table-hover">
					<thead className="table-light">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Название</th>
						<th scope="col"></th>
					</tr>
					</thead>
					<tbody className="table-group-divider">
					{attributes.map((c,index) => (
						<tr key={c.id}>
							<th scope="row">{index+1}</th>
							<td>{editingId === c.id ? <input type="text" value={newName} onChange={this.handleChange}/> : c.name}</td>
							<td className="text-center">
								{editingId === c.id ? (
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
										<button className="btn btn-primary btn-sm mx-1" onClick={() => this.handleEdit(c.id)}>
											<i className="bi bi-pencil-fill"/>
										</button>
										<button className="btn btn-danger btn-sm" onClick={() => this.handleDelete(c.id)}>
											<i className="bi bi-trash-fill"/>
										</button>
									</>
								)}
							</td>
						</tr>
					))}
					<tr>
						<th scope="row">.</th>
						<td>
							<input type="text" value={newAttributeName} onChange={this.handleNewAttributeNameChange}
										 placeholder="Название"/>
							{addError && <div className="alert alert-danger mt-2">{addError}</div> }
						</td>
						<td className="text-center">
							<button className="btn btn-success btn-sm" onClick={this.handleAdd}>
								<i className="bi bi-plus"/>
							</button>
						</td>
					</tr>
					</tbody>
				</table>
				</div>
			</>
		);
	}
}

export default AttributesList;
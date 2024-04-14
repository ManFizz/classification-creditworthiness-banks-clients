import React, { Component } from "react";
import axios from 'axios';

class ClassesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			newName: "",
			newClassName: "",
			addError: null,
		};
	}

	handleNewClassNameChange = (event) => {
		this.setState({
			newClassName: event.target.value,
		}, () => this.checkNewClassField());
	};

	checkNewClassField = () => {
		const { newClassName } = this.state;

		if(this.props.classes.some(c => c.name.localeCompare(newClassName.trim()) === 0)) {
			this.setState({addError: "Класс с таким наименованием уже существует"});
			return false;
		}

		this.setState({addError: null});
		return true;
	}

	handleAdd = async () => {
		if(!this.checkNewClassField())
			return;

		const { newClassName } = this.state;
		if(newClassName.trim() === '' ) {
			this.setState({addError: "Имя класса не может быть пустым"});
			return;
		}

		try {
			const response = await axios.post('/api/classes', {
				name: newClassName,
				attributes: [],
			});

			const newClass = response.data;

			this.props.setProps(prevProps => ({
				classes: [...prevProps.classes, newClass],
			}));
			this.setState({
				newClassName: "",
			});
		} catch (error) {
			console.error('Error adding class:', error);
		}
	};

	handleDelete = async (id) => {
		try {
			await axios.delete(`/api/classes/${id}`);
			this.props.setProps(prevProps => ({
				classes: prevProps.classes.filter(c => c.id !== id)
			}));
		} catch (error) {
			console.error('Error deleting class:', error);
		}
	};

	handleEdit = (id) => {
		this.setState({
			editingId: id,
			newName: this.props.classes.find(c => c.id === id).name
		});
	};

	handleChange = (event) => {
		this.setState({ newName: event.target.value });
	};

	handleSave = async () => {
		const { editingId, newName } = this.state;
		try {
			await axios.put(`/api/classes/${editingId}`, { name: newName });
			this.setState({
				editingId: null,
				newName: ""
			});
			this.props.setProps(prevProps => ({
				classes: prevProps.classes.map(c => c.id === editingId ? { ...c, name: newName } : c),
			}));
		} catch (error) {
			console.error('Error saving class:', error);
		}
	};

	handleCancel = () => {
		this.setState({ editingId: null, newName: "" });
	};

	render() {
		const { newName, editingId, newClassName, addError } = this.state;
		return (
			<>
				<header className="col-12">Список классов кредитоспособности</header>
				<div className="col-12">
				<table className="table table-hover">
					<thead className="table-light">
					<tr key="index">
						<th scope="col">#</th>
						<th scope="col">Название</th>
						<th scope="col"></th>
					</tr>
					</thead>
					<tbody className="table-group-divider">
					{this.props.classes.map( (c, index) => (
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
					<tr key="add-field">
						<th scope="row">.</th>
						<td>
							<input type="text" value={newClassName} onChange={this.handleNewClassNameChange}
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

export default ClassesList;
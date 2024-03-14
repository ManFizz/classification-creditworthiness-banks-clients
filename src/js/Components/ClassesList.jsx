import React, { Component } from "react";
import axios from 'axios';

class ClassesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classes: [],
			editingId: null,
			newName: "",
			newClassName: "",
		};
	}

	componentDidMount() {
		this.fetchClasses();
	}

	fetchClasses = async () => {
		try {
			const response = await axios.get('/api/classes');
			this.setState({ classes: response.data });
		} catch (error) {
			console.error('Error fetching classes:', error);
		}
	};

	handleNewClassNameChange = (event) => {
		this.setState({ newClassName: event.target.value });
	};

	handleAdd = async () => {
		const { newClassName } = this.state;

		try {
			const response = await axios.post('/api/classes', {
				name: newClassName
			});

			const newClass = response.data;

			this.setState(prevState => ({
				classes: [...prevState.classes, newClass],
				newClassName: "",
			}));
		} catch (error) {
			console.error('Error adding class:', error);
		}
	};

	handleDelete = async (id) => {
		try {
			await axios.delete(`/api/classes/${id}`);
			this.setState(prevState => ({
				classes: prevState.classes.filter(c => c.id !== id)
			}));
		} catch (error) {
			console.error('Error deleting class:', error);
		}
	};

	handleEdit = (id) => {
		const { classes } = this.state;
		this.setState({
			editingId: id,
			newName: classes.find(c => c.id === id).name
		});
	};

	handleChange = (event) => {
		this.setState({ newName: event.target.value });
	};

	handleSave = async () => {
		try {
			const { editingId, newName } = this.state;
			await axios.put(`/api/classes/${editingId}`, { name: newName });
			this.setState(prevState => ({
				classes: prevState.classes.map(c => c.id === editingId ? { ...c, name: newName } : c),
				editingId: null,
				newName: ""
			}));
		} catch (error) {
			console.error('Error saving class:', error);
		}
	};

	handleCancel = () => {
		this.setState({ editingId: null, newName: "" });
	};

	render() {
		const { classes, newName, editingId, newClassName } = this.state;
		return (
			<>
				<header className="col-12">Список классов кредитоспособности</header>
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
					{classes.map( (c, index) => (
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
							<input type="text" value={newClassName} onChange={this.handleNewClassNameChange}
										 placeholder="New class name"/>
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
import React, { Component } from "react";
import axios from "axios";

class AttributesList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attributes: [],
			editingId: null,
			newName: "",
			newAttributeName: "",
		};
	}

	componentDidMount() {
		this.fetchAttributes();
	}

	fetchAttributes = async () => {
		try {
			const response = await axios.get('/api/attributes');
			this.setState({ attributes: response.data });
		} catch (error) {
			console.error('Error fetching attributes:', error);
		}
	};

	handleNewAttributeNameChange = (event) => {
		this.setState({ newAttributeName: event.target.value });
	};

	handleAdd = async () => {
		const { newAttributeName } = this.state;

		try {
			const response = await axios.post('/api/attributes', {
				name: newAttributeName
			});

			const newAttribute = response.data;

			this.setState(prevState => ({
				attributes: [...prevState.attributes, newAttribute],
				newAttributeName: "",
			}));
		} catch (error) {
			console.error('Error adding attribute:', error);
		}
	};

	handleDelete = async (id) => {
		try {
			await axios.delete(`/api/attributes/${id}`);
			this.setState(prevState => ({
				attributes: prevState.attributes.filter(c => c.id !== id)
			}));
		} catch (error) {
			console.error('Error deleting attribute:', error);
		}
	};

	handleEdit = (id) => {
		const { attributes } = this.state;
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
			this.setState(prevState => ({
				attributes: prevState.attributes.map(c => c.id === editingId ? { ...c, name: newName } : c),
				editingId: null,
				newName: ""
			}));
		} catch (error) {
			console.error('Error saving attribute:', error);
		}
	};

	handleCancel = () => {
		this.setState({ editingId: null, newName: "" });
	};

	render() {
		const { attributes, newName, editingId, newAttributeName } = this.state;
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

export default AttributesList;
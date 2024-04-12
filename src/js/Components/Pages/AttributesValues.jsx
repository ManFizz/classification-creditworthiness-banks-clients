import React, { Component } from "react";
import axios from "axios";
import { ATTRIBUTE_TYPE_NAME } from "../../Definitions";
import AttributeTypeDropdown from "./AttributeValues/AttributeTypeDropdown";
import ValueFieldElastic from "./AttributeValues/ValueFieldElastic";

class AttributesValues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			newName: "",
			newType: undefined,
			value: undefined,
		};
	}

	handleDelete = async (id) => {
		try {
			await axios.delete(`/api/attributes/${id}`);
			this.props.setProps(prevProps => ({
				attributes: prevProps.attributes.filter(c => c.id !== id)
			}));
		} catch (error) {
			console.error('Error deleting attribute:', error);
		}
	};

	handleEdit = (id) => {
		const attribute = this.props.attributes.find(c => c.id === id);
		this.setState({
			editingId: id,
			newName: attribute.name,
			newType: attribute.type,
			value: attribute.value || [],
		});
	};

	handleNameChange = (event) => {
		this.setState({ newName: event.target.value });
	};

	handleTypeChange = (event) => {
		this.setState({ newType: event.target.selectedIndex-1 });
	};

	handleSave = async () => {
		try {
			const { editingId, newName, newType, value } = this.state;
			await axios.put(`/api/attributes/${editingId}`, {
				name: newName,
				type: newType,
				value: value
			});

			this.props.setProps(prevProps => ({
				attributes: prevProps.attributes.map(c => c.id === editingId ? {
					...c,
					name: newName,
					type: newType,
					value: value,
				} : c),
			}));
			this.setState({
				editingId: null,
				newName: "",
				newType: undefined,
				value: undefined,
			});

		} catch (error) {
			console.error('Error saving attribute:', error);
		}
	};

	handleCancel = () => {
		this.setState({ editingId: null, newName: "" });
	};

	render() {
		const { newName, editingId, newType, value } = this.state;
		return (
			<>
				<header className="col-12">Список возможных значений для признаков</header>
				<div className="col-12">
					<table className="table">
						<thead className="table-light">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Название</th>
							<th scope="col">Тип</th>
							<th scope="col">Возможные значения</th>
							<th scope="col"></th>
						</tr>
						</thead>
						<tbody className="table-group-divider">
						{this.props.attributes.map((c,index) => (
							<tr key={c.id} className={c.id === editingId ? "table-light": ""}>
								<th scope="row">{index+1}</th>
								<td>
									{ editingId === c.id ?
									<input type="text" value={newName} onChange={this.handleNameChange} className="form-control"/>
										: c.name
									}
								</td>
								<td>{editingId === c.id ?
									<AttributeTypeDropdown type={newType} onChange={this.handleTypeChange}/>
									: ATTRIBUTE_TYPE_NAME[c.type]}
								</td>
								<td style={{maxWidth: '500px'}}>
									<ValueFieldElastic isEdit={editingId === c.id} newType={newType} value={value} attribute={c}
																		 setProps={(data) => this.setState(data)}/>
								</td>
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
						</tbody>
					</table>
				</div>
			</>
		);
	}
}

export default AttributesValues;
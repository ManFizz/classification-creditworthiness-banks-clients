import React, { Component } from "react";
import axios from "axios";
import { ATTRIBUTE_TYPE, ATTRIBUTE_TYPE_NAME } from "../Definitions";
import AttributeTypeDropdown from "./AttributeTypeDropdown";
import StringArrayInput from "./StringArrayInput";

function displayValue(attribute) {
	const fixed = <span className="badge text-bg-secondary">Фиксировано</span>;
	const warn = <span className="badge text-bg-warning">Не задано</span>;
	switch (attribute.type) {
		case ATTRIBUTE_TYPE.DOUBLE :
		case ATTRIBUTE_TYPE.INT : {
			if (attribute.minValue === undefined || attribute.maxValue === undefined)
				return warn;
			return <span>от {attribute.minValue} до {attribute.maxValue}</span>;
		}
		case ATTRIBUTE_TYPE.STRING : {
			if (attribute.value.length === 0)
				return warn;
			return `${attribute.value.join(", ")}`;
		}
		case ATTRIBUTE_TYPE.BOOLEAN: {
			return fixed;
		}
		default:
			return null;
	}
}

class AttributesValues extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editingId: null,
			newName: "",
			newType: undefined,
			minValue: undefined,
			maxValue: undefined,
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
			minValue: attribute.minValue,
			maxValue: attribute.maxValue,
			value: attribute.value,
		});
	};

	handleNameChange = (event) => {
		this.setState({ newName: event.target.value });
	};

	handleTypeChange = (event) => {
		this.setState({ newType: event.target.selectedIndex-1 });
	};

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

	displayInput = (type) => {
		const { minValue, maxValue, value} = this.state;
		switch (type) {
			case ATTRIBUTE_TYPE.INT: {
				return <>
					<label>от</label>
					<input type="number" value={minValue} onChange={this.handleMinChangeInteger}/>
					<label>до</label>
					<input type="number" value={maxValue} onChange={this.handleMaxChangeInteger}/>
				</>;
			}
			case ATTRIBUTE_TYPE.DOUBLE: {
				return <>
					<label>от</label>
					<input type="number" step="any" value={minValue} onChange={this.handleMinChangeDouble}/>
					<label>до</label>
					<input type="number" step="any" value={maxValue} onChange={this.handleMaxChangeDouble}/>
				</>;
			}
			case ATTRIBUTE_TYPE.STRING: {
				return <StringArrayInput value={value} onChange={(v) => {
					this.setState({value: v});
				}} />;
			}
			default : {
				return null;
			}
		}
	}

	handleSave = async () => {
		try {
			const { editingId, newName, newType, minValue, maxValue, value } = this.state;
			await axios.put(`/api/attributes/${editingId}`, {
				name: newName,
				type: newType,
				minValue: minValue,
				maxValue: maxValue,
				value: value
			});

			this.props.setProps(prevProps => ({
				attributes: prevProps.attributes.map(c => c.id === editingId ? {
					...c,
					name: newName,
					type: newType,
					minValue: minValue,
					maxValue: maxValue,
					value: value,
				} : c),
			}));
			this.setState(prevState => ({
				editingId: null,
				newName: "",
				newType: undefined,
				minValue: undefined,
				maxValue: undefined,
				value: undefined,
			}));

		} catch (error) {
			console.error('Error saving attribute:', error);
		}
	};

	handleCancel = () => {
		this.setState({ editingId: null, newName: "" });
	};

	render() {
		const { newName, editingId, newType } = this.state;
		return (
			<>
				<header className="col-12">Список возможных значений для признаков</header>
				<div className="col-12">
					<table className="table table-hover">
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
							<tr key={c.id}>
								<th scope="row">{index+1}</th>
								<td>
									{ editingId === c.id ?
									<input type="text" value={newName} onChange={this.handleNameChange}/>
										: c.name
									}
								</td>
								<td>{editingId === c.id ?
									<AttributeTypeDropdown type={newType} onChange={this.handleTypeChange}/>
									: ATTRIBUTE_TYPE_NAME[c.type]}
								</td>
								<td style={{maxWidth: '500px'}}>
									{editingId === c.id ? this.displayInput(newType) : displayValue(c)}
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
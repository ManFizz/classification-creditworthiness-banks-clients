import React, { Component } from "react";
import { ATTRIBUTE_TYPE, ATTRIBUTE_TYPE_NAME } from "../Definitions";
import BooleanRadioInput from "./BooleanRadioInput";
import StringRadioInput from "./StringRadioInput";
import isEqual from 'lodash/isEqual';

const LOG_TYPES = {
	SUCCESS: 'success',
	WARNING: 'warning',
	INFO: 'info',
	NO_SUCCESS: 'no success',
};

class DeterminingClass extends Component {
	constructor(props) {
		super(props);
		this.state = {
			attrValues: {},
			result: null,
			logs: null,
		};
	}

	componentDidMount() {
		this.setState({
			attrValues: this.props.attributes.map(a => (
				{
					attr: a,
					value: null,
				}
			)),
		})
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (!isEqual(prevProps.attributes, this.props.attributes)) {
			const attrValues = {};
			this.props.attributes.forEach(a => {
				const prevAttr = prevState.attrValues[a.name] || {};
				attrValues[a.name] = {
					attr: a,
					value: prevAttr.value !== undefined ? prevAttr.value : null,
				}
			});
			this.setState({ attrValues });
		}
	}

	displayInput = (atrValue) => {
		switch (atrValue.attr.type) {
			case ATTRIBUTE_TYPE.INT: {
				return <input
					type="number"
					value={atrValue.minValue}
					min={atrValue.attr.minValue}
					max={atrValue.attr.maxValue}
					onChange={(e) => this.handleChangeNumber(e, atrValue, parseInt)}
				/>;
			}
			case ATTRIBUTE_TYPE.DOUBLE: {
				return <input
					type="number"
					step="any"
					value={atrValue.minValue}
					min={atrValue.attr.minValue}
					max={atrValue.attr.maxValue}
					onChange={(e) => this.handleChangeNumber(e, atrValue, parseFloat)}
				/>;
			}
			case ATTRIBUTE_TYPE.STRING: {
				return <StringRadioInput selectedValue={atrValue.value} allValues={atrValue.attr.value} onChange={(value) => {
					this.updateState(atrValue, value);
				}}/>;
			}
			case ATTRIBUTE_TYPE.BOOLEAN: {
				return <BooleanRadioInput selectedValue={atrValue.value} onChange={(newValue) => {
					this.updateState(atrValue, newValue);
				}}/>
			}
			default : {
				return null;
			}
		}
	}

	handleChangeNumber = (event, atrValue, parseFunc) => {
		const parsedValue = parseFunc(event.target.value);
		if (!isNaN(parsedValue)) {
			if(parsedValue <= atrValue.attr.maxValue && parsedValue >= atrValue.attr.minValue)
				this.updateState(atrValue, parsedValue);
			//else not change
		} else if("" === event.target.value) {
			this.updateState(atrValue, null);
		}
	};

	updateState = (atrValue, newValue) => {
		this.setState(prevState => ({
			attrValues: {
				...prevState.attrValues,
				[atrValue.attr.name]: {
					...prevState.attrValues[atrValue.attr.name],
					value: newValue,
				}
			}
		}));
	}

	handleClick = () => {
		let logs = [];
		const score = {};
		this.props.classes.forEach(cls => {
			score[cls.name] = {
				value: 0,
			};
		});

		Object.values(this.state.attrValues).forEach(e => {
			if (e.value === null) {
				logs.push({ type: LOG_TYPES.INFO, message: `Атрибут "${e.attr.name}" не введен` });
				return;
			}

			this.props.classes.forEach(cls => {
				const name = cls.name;

				const found = cls.attributes.find(a => a.id === e.attr.id);
				if (!found) {
					logs.push({ type: LOG_TYPES.WARNING, message: `Атрибут "${e.attr.name}" у класса кредитоспособности "${name}" не задан` });
					return;
				}

				switch (found.attr.type) {
					case ATTRIBUTE_TYPE.INT:
					case ATTRIBUTE_TYPE.DOUBLE: {
						if (e.value <= found.maxValue && e.value >= found.minValue) {
							score[name].value = score[name].value + 1;
							logs.push({ type: LOG_TYPES.SUCCESS, message: `Атрибут "${e.attr.name}" у класса кредитоспособности "${name}" соответствует` });
						} else {
							logs.push({ type: LOG_TYPES.NO_SUCCESS, message: `Атрибут "${e.attr.name}" у класса кредитоспособности "${name}" не соответствует` });
						}
						break;
					}
					case ATTRIBUTE_TYPE.STRING:
					case ATTRIBUTE_TYPE.BOOLEAN: {
						if (found.value.includes(e.value)) {
							score[name].value = score[name].value + 1;
							logs.push({ type: LOG_TYPES.SUCCESS, message: `Атрибут "${e.attr.name}" у класса кредитоспособности "${name}" соответствует` });
						} else {
							logs.push({ type: LOG_TYPES.NO_SUCCESS, message: `Атрибут "${e.attr.name}" у класса кредитоспособности "${name}" не соответствует` });
						}
						break;
					}
				}
			});
		});

		if(score.length === 0)
			return;

		const scoreArray = Object.entries(score);
		scoreArray.sort((a, b) => b[1].value - a[1].value);
		const [maxName] = scoreArray[0];
		this.setState({
			result: maxName,
			logs: logs,
		});
	}

	getLogColor(type) {
		switch (type) {
			case LOG_TYPES.NO_SUCCESS:
				return 'warning';
			case LOG_TYPES.SUCCESS:
				return 'success';
			case LOG_TYPES.WARNING:
				return 'danger';
			case LOG_TYPES.INFO:
				return 'info';
			default:
				return 'secondary';
		}
	}

	render() {
		return (
			<>
				<header className="col-12">
					<h3>Определение класса кредитоспособности</h3>
					<button className="btn btn-sm mb-2 btn-success" type="button" onClick={this.handleClick}>Определить</button>
				</header>
				<div className="col-12">
					{this.state.result && <h4>{this.state.result}</h4>}
				</div>
				<div className="col-12">
					{this.state.logs &&
						<details>
							<summary>Подробнее</summary>
							{this.state.logs.map((log, index) => (
								<div key={index} className={`alert alert-${this.getLogColor(log.type)}`} role="alert">
									{log.message}
								</div>
							))}
						</details>
					}
				</div>
				<div className="col-12">
					<table className="table">
						<thead className="table-light">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Название</th>
							<th scope="col">Тип</th>
							<th scope="col">Известные значения</th>
						</tr>
						</thead>
						<tbody className="table-group-divider">
						{Object.values(this.state.attrValues).map((a, index) => (
							<tr key={a.attr.name}>
								<th scope="row">{index + 1}</th>
								<td>{a.attr.name}</td>
								<td>{ATTRIBUTE_TYPE_NAME[a.attr.type]}</td>
								<td>{this.displayInput(a)}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</>
		)
	}
}

export default DeterminingClass;
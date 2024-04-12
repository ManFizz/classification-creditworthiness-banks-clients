import React, { Component } from "react";
import { ATTRIBUTE_TYPE, ATTRIBUTE_TYPE_NAME, SECTION } from "../../Definitions";
import BooleanRadioInput from "./DeterminingClass/BooleanRadioInput";
import StringRadioInput from "./DeterminingClass/StringRadioInput";
import isEqual from 'lodash/isEqual';
import TestObjects from "../../TestObjects";

const LOG_TYPES = {
	SUCCESS: 'success',
	WARNING: 'warning',
	INFO: 'info',
	NO_SUCCESS: 'no success',
};

class DeterminingClass extends Component {
	constructor(props) {
		super(props);
		//App already loaded
		const attrValues = {};
		this.props.attributes.forEach(a => {
			attrValues[a.name] = {
				attr: a,
				value: null,
			}
		});
		this.state = {
			attrValues: attrValues,
			result: null,
			logs: [],
			error: false,
		};
	}

	//App in load
	componentDidUpdate(prevProps, prevState, snapshot) {
		if(this.props.attributes.some( atr => {
			const f = prevProps.attributes.find( a => a.id === atr.id);
			return f === null || !isEqual(f, atr);
		}))
		{
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
			case ATTRIBUTE_TYPE.INT:
			case ATTRIBUTE_TYPE.DOUBLE: {
				const step = atrValue.attr.type === ATTRIBUTE_TYPE.DOUBLE ? "any" : 1;
				const parseFunc = atrValue.attr.type === ATTRIBUTE_TYPE.DOUBLE ? parseFloat : parseInt;

				return <div>
						{atrValue.attr.value.map((value, index) => (
							<span key={index} className="mx-2 mb-1 badge text-bg-light">от {value.minValue} до {value.maxValue}</span>
						))}
					<input
						type="number"
						step={step}
						value={atrValue.value}
						min={atrValue.attr.minValue}
						max={atrValue.attr.maxValue}
						onChange={(e) => this.handleChangeNumber(e, atrValue, parseFunc)}
						className="form-control"
					/>
				</div>;
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
				this.updateState(atrValue, parsedValue);
		} else if("" === event.target.value) {
			this.updateState(atrValue, null);
		}
	};

	updateState = (atrValue, newValue) => {
		const newAtrValues = {
			...this.state.attrValues,
			[atrValue.attr.name]: {
				attr: atrValue.attr,
				value: newValue,
			}
		};
		this.setState(prevState => ({
			attrValues: newAtrValues}
		));
	}

	handleClick = () => {
		console.log(this.state.attrValues);
		const error = Object.values(this.state.attrValues).some(atrVal => {
			if(atrVal.value === null)
				return false;

			if(atrVal.attr.type !== ATTRIBUTE_TYPE.INT || atrVal.attr.type !== ATTRIBUTE_TYPE.DOUBLE)
				return false;

			console.log(atrVal.attr.value,atrVal.value );
			return !atrVal.attr.value.some(val => atrVal.value <= val.maxValue && atrVal.value >= val.minValue);
		});

		if(error) {
			this.setState({error: true});
			return;
		}
		this.setState({error: false});

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
						if (found.value.some(val => e.value <= val.maxValue && e.value >= val.minValue)) {
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

	TestCase = (n) => {
		if (n >= 1 && n <= 5) {
			const index = n - 1;
			this.setState({ attrValues: TestObjects[index] }, this.handleClick);
		}
	}

	render() {
		return (
			<>
				<header className="col-12">
					<h3>Определение класса кредитоспособности</h3>
					<div className="btn-group">
						<button className="btn btn-sm mb-2 btn-outline-success" type="button" onClick={this.handleClick}>Определить</button>
						<button className="btn btn-sm mb-2 btn-outline-primary" type="button" onClick={() => this.props.setSection(SECTION.CLASSES_LIST)}>Просмотр базы знаний</button>
					</div>
				</header>
				{this.state.error && (
					<div className="alert alert-danger" role="alert">
						Ошибка! Проверьте правильность введеных данных!
					</div>
				)}
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
					<div className="btn-group">
						{[...Array(5).keys()].map(i => (
							<div key={i} className="btn btn-outline-secondary" onClick={() => this.TestCase(i + 1)}>
								Test case #{i + 1}
							</div>
						))}
					</div>
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
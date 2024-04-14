import React, { Component } from "react";
import { ATTRIBUTE_TYPE, ATTRIBUTE_TYPE_NAME, SECTION } from "../../Definitions";
import BooleanRadioInput from "./DeterminingClass/BooleanRadioInput";
import StringRadioInput from "./DeterminingClass/StringRadioInput";
import isEqual from 'lodash/isEqual';
import TestObjects from "../../TestObjects";

const valueInRanges = (value, ranges) => {
	return ranges.some(range => value <= range.maxValue && value >= range.minValue);
}

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
			error: null,
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

	checkMinMax = () => {
		return Object.values(this.state.attrValues).some(atrVal => {
			if (atrVal.value === null) return false;
			if (atrVal.attr.type !== ATTRIBUTE_TYPE.INT && atrVal.attr.type !== ATTRIBUTE_TYPE.DOUBLE) return false;
			return !atrVal.attr.value.some(val => atrVal.value <= val.maxValue && atrVal.value >= val.minValue);
		});
	}

	checkFillInputs = () => {
		return Object.values(this.state.attrValues).some(e => e.value === null);
	}

	checkCompleteness = () => {
		return Object.values(this.state.attrValues).some(e => {
			return this.props.classes.some(cls => !cls.attributes.find(a => a.id === e.attr.id));
		});
	}

	hasErrors = () => {
		this.setState({
			result: null,
			logs: []
		});

		/*if (this.checkFillInputs()) {
			this.setState({ error: "Не все поля заполненны!" });
			return true;
		}*/
		if (this.checkMinMax()) {
			this.setState({ error: "Проверьте правильность введеных данных!" });
			return true;
		}
		/*if (this.checkCompleteness()) {
			this.setState({ error: "Знания не полны!" });
			return true;
		}*/

		this.setState({ error: null });
		return false;
	}

	validateAttribute = (e, found) => {
		if (found.attr.type === ATTRIBUTE_TYPE.INT || found.attr.type === ATTRIBUTE_TYPE.DOUBLE) {
			return !valueInRanges(e.value, found.value);
		} else {
			return !found.value.includes(e.value);
		}
	}

	errorTemplate = (val, name) => {
		if (val === false) val = 'Нет';
		else if (val === true) val = 'Да';
		else if (val === null) val = 'Не задано';
		return `значение «${val}» признака «${name}» не соответствует описанию класса кредитоспособности`;
	}

	handleClick = () => {
		if (this.hasErrors()) return;

		const logs = {};
		Object.values(this.state.attrValues).forEach(e => {
			this.props.classes.forEach(cls => {
				const found = cls.attributes.find(a => a.id === e.attr.id);
				if (!found) return;
				const clsName = cls.name;

				if (!logs[clsName]) {
					logs[clsName] = { errors: [] };
				}

				if (this.validateAttribute(e, found)) {
					const error = this.errorTemplate(e.value, e.attr.name);
					logs[clsName].errors.push(error);
				}
			});
		});

		this.updateResult(logs);
	}
	updateResult = (logs) => {
		const objectArray = Object.entries(logs)
			.filter(log => log[1].errors.length === 0)
			.map(log => log[0]);

		const result = objectArray.length === 0
			? 'Класс кредитоспособности не определён.\nЗнания об этом классе кредитоспособных клиентов не занесены в систему. Обратитесь к эксперту для разрешения проблемы. Все классы кредитоспособностей опровергнуты по следующим причинам:'
			: 'Подходящие классы кредитоспособности: ' + objectArray.join(', ') + '.\nДругие классы кредитоспособности опровергнуты по следующим причинам:';

		this.setState({
			result: result,
			logs: Object.entries(logs),
		});
	}

	TestCase = (n) => {
		if (n >= 1 && n <= 5) {
			const { attrValues } = this.state;
			const testObject = TestObjects[n - 1];

			Object.keys(testObject).forEach(key => {
				if (attrValues[key]) {
					attrValues[key].value = testObject[key].value;
				} else {
					console.error(`Атрибут "${key}" не найден в attrValues`);
				}
			});

			this.setState({ attrValues: attrValues }, this.handleClick);
		}
	}

	render() {
		return (
			<>
				<header className="col-12">
					<h3>Определение класса кредитоспособности</h3>
				</header>
				<div className="col-12 mb-2">
					<div className="row" >
						<div className="btn-group col-4">
							<button className="btn btn-outline-success" type="button"
											onClick={this.handleClick}>Определить
							</button>
							<button className="btn btn-outline-primary" type="button"
											onClick={() => this.props.setSection(SECTION.CLASSES_LIST)}>Просмотр базы знаний
							</button>
						</div>
						<div className="btn-group col-8">
							{[...Array(5).keys()].map(i => (
								<div key={i} className="btn btn-outline-secondary" onClick={() => this.TestCase(i + 1)}>
									Test case #{i + 1}
								</div>
							))}
						</div>
					</div>
				</div>
				{this.state.error !== null && (
					<div className="alert alert-danger" role="alert">{this.state.error}</div>
				)}
				<div className="col-12">
					{this.state.result !== null && <h4>{this.state.result}</h4>}
				</div>
				<div className="col-12">
					{this.state.logs.length > 0 &&
						<details>
							<summary>Подробнее</summary>
							{this.state.logs.map((log, index1) =>
									log[1].errors.length > 0 && (
										<div key={index1} className={`alert alert-warning`} role="alert">
											<span>Класс кредитоспособности «{log[0]}» опровергнут, так как:</span><br/>
											{log[1].errors.join('; \n')}
										</div>
									)
							)}
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
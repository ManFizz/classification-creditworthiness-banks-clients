import React, { Component } from "react";
import { ATTRIBUTE_TYPE } from "../../../Definitions";
import StringArrayInput from "./StringArrayInput";

const isBad = (obj) => obj === null || obj === undefined;

function displayValue(attribute) {
	const warn = <span className="badge text-bg-warning">Не задано</span>;
	if(isBad(attribute.value)) {
		return warn;
	}

	switch (attribute.type) {
		case ATTRIBUTE_TYPE.DOUBLE :
		case ATTRIBUTE_TYPE.INT : {
			return attribute.value.map((value, index) => {
				if (isBad(value.minValue) || isBad(value.maxValue))
					return warn;

				const valueText = `от ${value.minValue} до ${value.maxValue}`;
				return <span key={index} className="mx-1">{index > 0 ? ', ' : ''}{valueText}</span>;
			});
		}
		case ATTRIBUTE_TYPE.STRING : {
			if(attribute.value === undefined)
				attribute.value = [];

			if (attribute.value.length === 0)
				return warn;

			return `${attribute.value.join(", ")}`;
		}
		case ATTRIBUTE_TYPE.BOOLEAN: {
			return <span className="badge text-bg-secondary">Фиксировано</span>;
		}
		default:
			return null;
	}
}

class ValueFieldElastic extends Component {
	handleChangeValue = (key, event, parseFunc, pos) => {
		let newSubValue = parseFunc(event.target.value);
		if(isNaN(newSubValue)) {
			if (event.target.value !== '')
				return;

			newSubValue = null;
		}

		let updatedValue = [...this.props.value];
		if(pos === null) {
			pos = updatedValue.length;
		}

		updatedValue[pos] = {
			...updatedValue[pos],
			[key]: newSubValue,
		};

		updatedValue = updatedValue.filter(val => !isBad(val.minValue) || !isBad(val.maxValue));
		this.props.setProps({
			value: updatedValue
		});
	};

	displayInput = (type, value) => {
		switch (type) {
			case ATTRIBUTE_TYPE.INT:
			case ATTRIBUTE_TYPE.DOUBLE: {
				const step = type === ATTRIBUTE_TYPE.DOUBLE ? "any" : 1;
				const parseFunc = type === ATTRIBUTE_TYPE.DOUBLE ? parseFloat : parseInt;

				const builder = (index, minValue, maxValue) => (
					<div key={index} className="d-flex align-items-center">
						<label className="mx-2">от</label>
						<input type="number" step={step} value={isBad(minValue) ? "" : minValue} onChange={(e) =>
							this.handleChangeValue('minValue', e, parseFunc, index)} className="form-control mr-2"/>
						<label className="mx-2">до</label>
						<input type="number" step={step} value={isBad(maxValue) ? "" : maxValue} onChange={(e) =>
							this.handleChangeValue('maxValue', e, parseFunc, index)} className="form-control"/>
					</div>
				);

				const display = value.map((val, index) => builder(index, val.minValue, val.maxValue));
				display.push(<div>Добавить</div>);
				display.push(builder(value.length, "", ""));
				return display;
			}
			case ATTRIBUTE_TYPE.STRING: {
				return <StringArrayInput value={value} onChange={(v) => {
					this.setState({value: v});
				}} />;
			}
			case ATTRIBUTE_TYPE.BOOLEAN: {
				return <span className="badge text-bg-secondary">Фиксировано</span>;
			}
			default : {
				return null;
			}
		}
	}

	render() {
		const { isEdit, newType, value, attribute } = this.props;
		return isEdit ? this.displayInput(newType, value) : displayValue(attribute);
	}
}

export default ValueFieldElastic;
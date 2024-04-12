import React, { Component } from "react";
import { ATTRIBUTE_TYPE } from "../../../Definitions";
import StringSelectInput from "./StringSelectInput";

const isBad = (obj) => obj === null || obj === undefined;

function isTrue(attribute) {
	return attribute.value.includes(true) || attribute.value.includes('true');
}

function isFalse(attribute) {
	return attribute.value.includes(false) || attribute.value.includes('false');
}

function displayValue(attribute) {
	const warn = <span className="badge text-bg-warning">Не задано</span>;
	switch (attribute.attr.type) {
		case ATTRIBUTE_TYPE.DOUBLE :
		case ATTRIBUTE_TYPE.INT : {
			if(isBad(attribute.value) || attribute.value.length === 0)
				return warn;

			return attribute.value.map((value, index) => {
				if (isBad(value.minValue) || isBad(value.maxValue))
					return warn;

				const valueText = `от ${value.minValue} до ${value.maxValue}`;
				return <span key={index} className="mx-1">{index > 0 ? ', ' : ''}{valueText}</span>;
			});
		}
		case ATTRIBUTE_TYPE.STRING : {
			if(isBad(attribute.value))
				attribute.value = [];

			if (attribute.value.length === 0)
				return warn;

			return `${attribute.value.join(", ")}`;
		}
		case ATTRIBUTE_TYPE.BOOLEAN: {
			if(attribute.value === undefined)
				attribute.value = [];

			if(isTrue(attribute)) {
				if(isFalse(attribute))
					return <span>Да/Нет</span>;
				return <span>Да</span>;
			}

			if(isFalse(attribute))
				return <span>Нет</span>;

			return warn;
		}
		default:
			return null;
	}
}

class ValueFieldStatic extends Component {
	handleChangeValue = (key, event, parseFunc, id) => {
		let newSubValue = parseFunc(event.target.value);
		if(isNaN(newSubValue)) {
			if (event.target.value !== '')
				return;

			newSubValue = null;
		}
		let updatedValue = this.props.value;
		if(updatedValue.some(val => val.id === id)) {
			updatedValue = updatedValue.map(val => val.id === id ? {
				...val,
				[key]: newSubValue,
			} : val);
		} else {
			updatedValue.push({
				id: id,
				[key]: newSubValue,
			});
		}

		updatedValue = updatedValue.filter(val => !isBad(val.minValue) || !isBad(val.maxValue));
		this.props.setProps({
			value: updatedValue
		});
	};

	displayInput = (a, value) => {
		switch (a.attr.type) {
			case ATTRIBUTE_TYPE.INT:
			case ATTRIBUTE_TYPE.DOUBLE: {
				const step = a.attr.type === ATTRIBUTE_TYPE.DOUBLE ? "any" : 1;
				const parseFunc = a.attr.type === ATTRIBUTE_TYPE.DOUBLE ? parseFloat : parseInt;

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

				const display = a.attr.value.map((val, index) => (
						<span key={"badge-"+index} className="mx-2 mb-1 badge text-bg-primary">от {val.minValue} до {val.maxValue}</span>
					));
				display.push(value.map((val) => builder(val.id, val.minValue, val.maxValue)));
				display.push(<div>Добавить</div>);
				display.push(builder('_' + Math.random().toString(16).slice(2), "", ""));
				return display;
			}
			case ATTRIBUTE_TYPE.STRING: {
				return <StringSelectInput selectedValues={value} allValues={a.attr.value} onChange={(v) => { this.props.setProps({value: v}); }} />;
			}
			case ATTRIBUTE_TYPE.BOOLEAN: {
				let selectedValues = [];
				if(value.includes(true))
					selectedValues.push('Да');
				if(value.includes(false))
					selectedValues.push('Нет');
				return <StringSelectInput selectedValues={selectedValues} allValues={['Да','Нет']} onChange={(v) => {
					let newVal = [];
					if(v.includes('Да'))
						newVal.push(true);
					if(v.includes('Нет'))
						newVal.push(false);
					this.props.setProps({value: newVal});
				}} />;
			}
			default : {
				return null;
			}
		}
	}

	render() {
		const {isEdit, attribute, value} = this.props;
		return isEdit ? this.displayInput(attribute, value) : displayValue(attribute);
	}
}

export default ValueFieldStatic;
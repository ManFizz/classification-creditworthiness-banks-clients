import React, { Component } from "react";
import { ATTRIBUTE_TYPE, ATTRIBUTE_TYPE_NAME } from "../Definitions";

class AttributeTypeDropdown extends Component {
	render() {
		const { type, onChange } = this.props;
		return (
			<select value={type !== undefined ? ATTRIBUTE_TYPE_NAME[type] : "-"} onChange={onChange}>
				<option disabled hidden value="-">-</option>
				{ATTRIBUTE_TYPE_NAME.map((typeName, index) => (
					<option key={index} value={ATTRIBUTE_TYPE[index]}>
						{typeName}
					</option>
				))}
			</select>
		);
	}
}

export default AttributeTypeDropdown;

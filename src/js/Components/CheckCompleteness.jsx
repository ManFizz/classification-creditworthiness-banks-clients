import React, { Component } from "react";
import { ATTRIBUTE_TYPE } from "../Definitions";

function isBad(obj) {
	return obj === null || obj === undefined || obj.length === 0;
}

class CheckCompleteness extends Component {
	constructor(props) {
		super(props);
		const arr = [];
		props.classes.forEach(cls => {
			props.attributes.forEach(attr => {
				const found = cls.attributes.find(a => a.attr.name === attr.name);
				if(!found) {
					arr.push({
						className: cls.name,
						attributeName: attr.name,
					});
					return;
				}
				if (attr.type === ATTRIBUTE_TYPE.INT || attr.type === ATTRIBUTE_TYPE.DOUBLE) {
					if (isBad(found.minValue) || isBad(found.maxValue)) {
						arr.push({
							className: cls.name,
							attributeName: attr.name,
						});
					}
					return;
				}

				if (isBad(found.value)) {
					arr.push({
						className: cls.name,
						attributeName: attr.name,
					});
				}
			});
		});
		this.arr = arr.sort((a, b) => a.className.localeCompare(b.className));
	}


	render() {
		return (
			<>
				<header className="col-12">Список неполноты</header>
				<div className="col-12">
					{this.arr.length > 0 ? (
					<table className="table table-hover">
						<thead className="table-light">
						<tr>
							<th scope="col">#</th>
							<th scope="col">Название класса</th>
							<th scope="col">Название признака</th>
						</tr>
						</thead>
						<tbody className="table-group-divider">
						{this.arr.map((e, index) => (
							<tr key={e.index}>
								<th scope="row">{index + 1}</th>
								<td>{e.className}</td>
								<td>{e.attributeName}</td>
							</tr>
						))}
						</tbody>
					</table>) : <h1>Знания полны</h1>}
				</div>
			</>
		)
	}
}

export default CheckCompleteness;
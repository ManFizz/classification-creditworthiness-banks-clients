export const SECTION = {
	CLASSES_LIST: 0,
	ATTRIBUTES: 1,
	ATTRIBUTES_VALUES: 2,
	CLASSES_DESCRIPTION: 3,
	CLASSES_VALUES: 4,
	CHECK_COMPLETENESS_KNOWLEDGE: 5,
	DETERMINING_THE_CREDITWORTHINESS_CLASS: 6,
};

export const ATTRIBUTE_TYPE = {
	INT: 0,
	STRING: 1,
	BOOLEAN: 2,
	DOUBLE: 3,
};

export const Attributes = [
	{
		id: 0,
		name: "Ежемесячный доход клиента",
		type: ATTRIBUTE_TYPE.INT,
		minValue: 0,
		maxValue: 1000000,
	},
	{
		id: 1,
		name: "История кредитования",
		type: ATTRIBUTE_TYPE.DOUBLE,
		minValue: 0,
		maxValue: 10,
	},
	{
		id: 2,
		name: "Семейное положение",
		type: ATTRIBUTE_TYPE.STRING,
		value: [
			"В браке",
			"Не в браке",
			"Разведен(а)"
		],
	},
	{
		id: 3,
		name: "Возраст клиента",
		type: ATTRIBUTE_TYPE.INT,
		minValue: 0,
		maxValue: 100,
	},
	{
		id: 4,
		name: "Наличие недвижимости или автомобиля",
		type: ATTRIBUTE_TYPE.BOOLEAN,
	},
	{
		id: 5,
		name: "Платежеспособность",
		type: ATTRIBUTE_TYPE.DOUBLE,
		minValue: 0,
		maxValue: 1,
	},
	{
		id: 6,
		name: "Кредитная нагрузка",
		type: ATTRIBUTE_TYPE.DOUBLE,
		minValue: 0,
		maxValue: 2,
	},
	{
		id: 7,
		name: "Источник дохода",
		type: ATTRIBUTE_TYPE.STRING,
		value: [
			"Заработная плата",
			"Бизнес",
			"Инвестиции",
			"Нет",
			"Иные источники",
		],
	},
	{
		id: 8,
		name: "Личные рекомендации или поручительства",
		type: ATTRIBUTE_TYPE.BOOLEAN,
	},
	{
		id: 9,
		name: "Трудовой стаж",
		type: ATTRIBUTE_TYPE.INT,
		minValue: 0,
		maxValue: 86,
	},
	{
		id: 10,
		name: "Стабильность занятости",
		type: ATTRIBUTE_TYPE.DOUBLE,
		minValue: 0,
		maxValue: 1,
	},
	{
		id: 11,
		name: "Цель кредита",
		type: ATTRIBUTE_TYPE.STRING,
		value: [
			"Недвижимость",
			"Образование",
			"Автомобиль",
			"Ремонт жилья",
			"Путешествие",
			"Оплата медицинских расходов",
			"Погашение других кредитов",
			"Оплата налогов",
			"Развлечения и хобби",
			"Иные нужды",
		],
	},
	{
		id: 12,
		name: "Срок кредита",
		type: ATTRIBUTE_TYPE.INT,
		minValue: 0,
		maxValue: 1020,
	},
];

export const Classes = [
	{
		id: 0,
		name: 'Невозможная',
		attributes: [
			{
				id: 0,
				minValue: 0,
				maxValue: 15000,
			},
			{
				id: 1,
				minValue: 0,
				maxValue: 2,
			},
			{
				id: 2,
				value: ['В браке', 'Не в браке', 'Разведен(а)'],
			},
			{
				id: 3,
				minValue: 0,
				maxValue: 100,
			},
			{
				id: 4,
				value: [ true, false ],
			},
			{
				id: 5,
				minValue: 0,
				maxValue: 0.2,
			},
			{
				id: 6,
				minValue: 0.75,
				maxValue: 2,
			},
			{
				id: 7,
				value: [
					"Заработная плата",
					"Бизнес",
					"Инвестиции",
					"Нет",
					"Иные источники",
				],
			},
			{
				id: 8,
				value: [ false ],
			},
			{
				id: 9,
				minValue: 0,
				maxValue: 5,
			},
			{
				id: 10,
				minValue: 0,
				maxValue: 0.3,
			},
			{
				id: 11,
				value: [
					"Недвижимость",
					"Образование",
					"Автомобиль",
					"Ремонт жилья",
					"Путешествие",
					"Оплата медицинских расходов",
					"Погашение других кредитов",
					"Оплата налогов",
					"Развлечения и хобби",
					"Иные нужды",
				],
			},
			{
				id: 12,
				minValue: 0,
				maxValue: 1020,
			},
		],
	},
	{
		id: 1,
		name: 'Низкая',
		attributes: [],
	},
	{
		id: 2,
		name: 'Средняя',
		attributes: [],
	},
	{
		id: 3,
		name: 'Высокая',
		attributes: [],
	},
];
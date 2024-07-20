const SPECIAL_CASES: { [teamNum: number]: number[][][] } = {
	4: [
		[
			[0, 2],
			[1, 3]
		],
		[
			[0, 3],
			[1, 2]
		]
	],
	5: [
		[
			[0, 3, 4],
			[1, 2]
		],
		[
			[1, 2, 3],
			[0, 4]
		]
	],
	6: [
		[
			[0, 2, 5],
			[1, 3, 4]
		],
		[
			[0, 1, 4],
			[2, 3, 5]
		]
	],
	7: [
		[
			[2, 4, 6],
			[0, 3],
			[1, 5]
		],
		[
			[1, 3, 5],
			[0, 4],
			[2, 6]
		]
	],
	10: [
		[
			[0, 3, 6],
			[5, 7, 8],
			[2, 9],
			[1, 4]
		],
		[
			[1, 6, 9],
			[2, 4, 7],
			[0, 5],
			[3, 8]
		]
	],
	11: [
		[
			[0, 3, 6],
			[4, 8, 9],
			[2, 5, 10],
			[1, 7]
		],
		[
			[0, 4, 7],
			[2, 8],
			[5, 6, 9],
			[1, 3, 10]
		]
	],
	12: [
		[
			[0, 3, 6],
			[4, 8, 9],
			[2, 5, 10],
			[1, 7, 11]
		],
		[
			[0, 4, 7],
			[2, 8, 11],
			[5, 6, 9],
			[1, 3, 10]
		]
	],
	13: [
		[
			[0, 3, 10],
			[1, 9, 11],
			[4, 7, 12],
			[5, 8],
			[2, 6]
		],
		[
			[0, 8, 11],
			[2, 6, 9],
			[5, 10, 12],
			[1, 3],
			[3, 7]
		]
	]
};

export const handleSpecialCase = (
	length: number,
	teams: string[],
	threeRooms?: boolean
): string[][][] => {
	return (
		threeRooms && length === 6
			? [
					[
						[0, 5],
						[1, 2],
						[3, 4]
					],
					[
						[0, 3],
						[2, 5],
						[1, 4]
					]
			  ]
			: SPECIAL_CASES[length]
	).map((round: number[][]) =>
		round.map((room: number[]) => room.map((team: number) => teams[team]))
	);
};

export const isSpecialCase = (length: number): boolean => {
	return !!SPECIAL_CASES[length];
};

import Deconflicter, { TeamEntry, swapTeams } from "./Deconflicter";

describe("Deconflicter", () => {
	describe("deconflictRound", () => {
		let deconflicter: Deconflicter;
		beforeEach(() => {
			deconflicter = new Deconflicter([
				[
					[{ team: "A" }, { team: "B" }, { team: "C" }],
					[{ team: "D" }, { team: "E" }, { team: "F" }],
					[{ team: "G" }, { team: "H" }]
				]
			]);
		});

		test("should do nothing if there are no conflicts", () => {
			let unconflictedRound: TeamEntry[][] = [
				[
					{ team: "A", rank: 1 },
					{ team: "D", rank: 2 },
					{ team: "G", rank: 3 }
				],
				[
					{ team: "B", rank: 4 },
					{ team: "E", rank: 5 },
					{ team: "H", rank: 6 }
				],
				[
					{ team: "C", rank: 7 },
					{ team: "F", rank: 8 }
				]
			];
			expect(deconflicter.deconflictRound(unconflictedRound)).toEqual(
				unconflictedRound.map(room => room.map(team => team.team))
			);
		});
	});

	describe("swapTeams", () => {
		test("should return a new round with the teams swapped", () => {
			const teams: TeamEntry[][] = [
				[
					{ team: "A", rank: 1 },
					{ team: "B", rank: 2 },
					{ team: "C", rank: 3 }
				],
				[
					{ team: "D", rank: 4 },
					{ team: "E", rank: 5 },
					{ team: "F", rank: 6 }
				],
				[
					{ team: "G", rank: 7 },
					{ team: "H", rank: 8 }
				]
			];

			expect(
				swapTeams(teams, { roomIdx: 1, teamIdx: 0 }, { roomIdx: 0, teamIdx: 2 })
			).toEqual([
				expect.arrayContaining([
					{ team: "A", rank: 1 },
					{ team: "B", rank: 2 },
					{ team: "D", rank: 4 }
				]),
				expect.arrayContaining([
					{ team: "C", rank: 3 },
					{ team: "E", rank: 5 },
					{ team: "F", rank: 6 }
				]),
				expect.arrayContaining([
					{ team: "G", rank: 7 },
					{ team: "H", rank: 8 }
				])
			]);

			expect(teams).toEqual([
				[
					{ team: "A", rank: 1 },
					{ team: "B", rank: 2 },
					{ team: "C", rank: 3 }
				],
				[
					{ team: "D", rank: 4 },
					{ team: "E", rank: 5 },
					{ team: "F", rank: 6 }
				],
				[
					{ team: "G", rank: 7 },
					{ team: "H", rank: 8 }
				]
			]);
		});

		test("should throw an error if one of the teams does not exist", () => {
			const teams: TeamEntry[][] = [
				[
					{ team: "A", rank: 1 },
					{ team: "B", rank: 2 },
					{ team: "C", rank: 3 }
				],
				[
					{ team: "D", rank: 4 },
					{ team: "E", rank: 5 }
				]
			];

			expect(() =>
				swapTeams(teams, { roomIdx: 2, teamIdx: 0 }, { roomIdx: 0, teamIdx: 2 })
			).toThrow(new Error("Invalid team"));
		});
	});
});

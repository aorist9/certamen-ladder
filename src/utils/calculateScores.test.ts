import calculateScores, { sortScores, ScoreRow } from "./calculateScores";
import { Ladder, LadderTypeV2 } from "../types/LadderType";
import { DrawType, LadderStyle } from "../constants";

const BASIC_LADDER: LadderTypeV2 = {
	id: "1",
	name: "Ladder",
	drawType: DrawType.TRADITIONAL,
	ladderType: LadderStyle.TRADITIONAL,
	numRounds: 3
};

describe("calculateScores", () => {
	it("should return an empty array if the division does not exist", () => {
		const ladder = new Ladder({
			...BASIC_LADDER,
			divisions: []
		});

		const result = calculateScores(ladder, 0);
		expect(result).toEqual([]);
	});

	it("should calculate scores for a non-Swiss ladder", () => {
		const ladder = new Ladder({
			...BASIC_LADDER,
			divisions: [
				{
					teams: { A: "Team A", B: "Team B" },
					matches: [
						[
							{
								teams: [
									{ team: "Team A", score: 10 },
									{ team: "Team B", score: 5 }
								]
							}
						]
					]
				}
			]
		});

		const result = calculateScores(ladder, 0);
		expect(result).toEqual([
			{ team: "Team A", roundScores: [10], total: 10 },
			{ team: "Team B", roundScores: [5], total: 5 }
		]);
	});

	it("should calculate scores for a Swiss ladder", () => {
		const ladder = new Ladder({
			...BASIC_LADDER,
			ladderType: LadderStyle.SWISS,
			divisions: [
				{
					teams: { A: "Team A", B: "Team B" },
					matches: [
						[
							{
								teams: [
									{ team: "Team A", score: 10, swissPoints: 3 },
									{ team: "Team B", score: 5, swissPoints: 1 }
								]
							}
						]
					]
				}
			]
		});

		const result = calculateScores(ladder, 0);
		expect(result).toEqual([
			{
				team: "Team A",
				roundScores: [10],
				roundSwiss: [3],
				total: 10,
				swissTotal: 3,
				sos: 1
			},
			{
				team: "Team B",
				roundScores: [5],
				roundSwiss: [1],
				total: 5,
				swissTotal: 1,
				sos: 3
			}
		]);
	});
});

describe("sortScores", () => {
	it("should sort by swissTotal if available", () => {
		const scores: ScoreRow[] = [
			{ team: "Team A", roundScores: [], total: 10, swissTotal: 5 },
			{ team: "Team B", roundScores: [], total: 15, swissTotal: 10 }
		];

		const result = scores.sort(sortScores);
		expect(result[0].team).toBe("Team B");
		expect(result[1].team).toBe("Team A");
	});

	it("should sort by sos if swissTotal is equal", () => {
		const scores: ScoreRow[] = [
			{ team: "Team A", roundScores: [], total: 10, swissTotal: 5, sos: 3 },
			{ team: "Team B", roundScores: [], total: 15, swissTotal: 5, sos: 5 }
		];

		const result = scores.sort(sortScores);
		expect(result[0].team).toBe("Team B");
		expect(result[1].team).toBe("Team A");
	});

	it("should sort by total if swissTotal and sos are equal", () => {
		const scores: ScoreRow[] = [
			{ team: "Team A", roundScores: [], total: 10 },
			{ team: "Team B", roundScores: [], total: 15 }
		];

		const result = scores.sort(sortScores);
		expect(result[0].team).toBe("Team B");
		expect(result[1].team).toBe("Team A");
	});
});

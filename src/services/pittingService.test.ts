import LadderType from "../types/LadderType";
import pittingService from "./pittingService";

const BASE_LADDER: LadderType = {
	id: "123",
	draw: 0,
	name: "Ladder",
	rounds: 3,
	type: 0
};

describe("Pitting Service", () => {
	describe("generateInitialPittings", () => {
		test("should return an empty array when there is not enough information", () => {
			expect(pittingService.generateInitialPittings(undefined)).toEqual([]);
			expect(pittingService.generateInitialPittings(BASE_LADDER)).toEqual([]);
			expect(
				pittingService.generateInitialPittings({
					...BASE_LADDER,
					teams: { A: "Alaska" }
				})
			).toEqual([]);
		});

		describe("Traditional Draw", () => {
			test("should properly seed a 24 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K",
							L: "L",
							M: "M",
							N: "N",
							O: "O",
							P: "P",
							Q: "Q",
							R: "R",
							S: "S",
							T: "T",
							U: "U",
							V: "V",
							W: "W",
							X: "X"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K", "L"],
						["M", "N", "O"],
						["P", "Q", "R"],
						["S", "T", "U"],
						["V", "W", "X"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["D", "B", "X"]),
						expect.arrayContaining(["G", "E", "C"]),
						expect.arrayContaining(["J", "H", "F"]),
						expect.arrayContaining(["M", "K", "I"]),
						expect.arrayContaining(["P", "N", "L"]),
						expect.arrayContaining(["S", "Q", "O"]),
						expect.arrayContaining(["V", "T", "R"]),
						expect.arrayContaining(["A", "W", "U"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["G", "B", "U"]),
						expect.arrayContaining(["J", "E", "X"]),
						expect.arrayContaining(["M", "H", "C"]),
						expect.arrayContaining(["P", "K", "F"]),
						expect.arrayContaining(["S", "N", "I"]),
						expect.arrayContaining(["V", "Q", "L"]),
						expect.arrayContaining(["A", "T", "O"]),
						expect.arrayContaining(["D", "W", "R"])
					])
				]);
			});

			test("should properly seed a 21 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K",
							L: "L",
							M: "M",
							N: "N",
							O: "O",
							P: "P",
							Q: "Q",
							R: "R",
							S: "S",
							T: "T",
							U: "U"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K", "L"],
						["M", "N", "O"],
						["P", "Q", "R"],
						["S", "T", "U"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["D", "B", "U"]),
						expect.arrayContaining(["G", "E", "C"]),
						expect.arrayContaining(["J", "H", "F"]),
						expect.arrayContaining(["M", "K", "I"]),
						expect.arrayContaining(["P", "N", "L"]),
						expect.arrayContaining(["S", "Q", "O"]),
						expect.arrayContaining(["A", "T", "R"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["G", "B", "R"]),
						expect.arrayContaining(["J", "E", "U"]),
						expect.arrayContaining(["M", "H", "C"]),
						expect.arrayContaining(["P", "K", "F"]),
						expect.arrayContaining(["S", "N", "I"]),
						expect.arrayContaining(["A", "Q", "L"]),
						expect.arrayContaining(["D", "T", "O"])
					])
				]);
			});

			test("should properly seed a 12 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K",
							L: "L"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K", "L"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "D", "G"]),
						expect.arrayContaining(["E", "I", "J"]),
						expect.arrayContaining(["C", "F", "K"]),
						expect.arrayContaining(["B", "H", "L"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["A", "E", "H"]),
						expect.arrayContaining(["C", "I", "L"]),
						expect.arrayContaining(["F", "G", "J"]),
						expect.arrayContaining(["B", "D", "K"])
					])
				]);
			});

			test("should properly seed an 11 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "D", "G"]),
						expect.arrayContaining(["E", "I", "J"]),
						expect.arrayContaining(["C", "F", "K"]),
						expect.arrayContaining(["B", "H"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["A", "E", "H"]),
						expect.arrayContaining(["C", "I"]),
						expect.arrayContaining(["F", "G", "J"]),
						expect.arrayContaining(["B", "D", "K"])
					])
				]);
			});

			test("should properly seed a 16 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K",
							L: "L",
							M: "M",
							N: "N",
							O: "O",
							P: "P"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K", "L"],
						["M", "N"],
						["O", "P"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["D", "B"]),
						expect.arrayContaining(["G", "E", "C"]),
						expect.arrayContaining(["J", "H", "F"]),
						expect.arrayContaining(["K", "I"]),
						expect.arrayContaining(["O", "M", "L"]),
						expect.arrayContaining(["A", "P", "N"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["G", "B", "N"]),
						expect.arrayContaining(["J", "E"]),
						expect.arrayContaining(["H", "C"]),
						expect.arrayContaining(["O", "K", "F"]),
						expect.arrayContaining(["A", "M", "I"]),
						expect.arrayContaining(["D", "P", "L"])
					])
				]);
			});

			test("should properly seed a 4 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D"
						}
					})
				).toEqual([
					[
						["A", "B"],
						["C", "D"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "C"]),
						expect.arrayContaining(["B", "D"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["A", "D"]),
						expect.arrayContaining(["B", "C"])
					])
				]);
			});

			test("should properly seed a 5 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "D", "E"]),
						expect.arrayContaining(["B", "C"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["B", "D", "E"]),
						expect.arrayContaining(["A", "C"])
					])
				]);
			});

			test("should properly seed a 6 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F"
						}
					})
				).toEqual([
					[
						["A", "B"],
						["C", "D"],
						["E", "F"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "F"]),
						expect.arrayContaining(["B", "C"]),
						expect.arrayContaining(["D", "E"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["A", "D"]),
						expect.arrayContaining(["C", "F"]),
						expect.arrayContaining(["B", "E"])
					])
				]);
			});

			test("should properly seed a 7 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E"],
						["F", "G"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["C", "E", "G"]),
						expect.arrayContaining(["A", "D"]),
						expect.arrayContaining(["B", "F"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["B", "D", "F"]),
						expect.arrayContaining(["A", "E"]),
						expect.arrayContaining(["C", "G"])
					])
				]);
			});

			test("should properly seed a 10 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H"],
						["I", "J"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "D", "G"]),
						expect.arrayContaining(["F", "H", "I"]),
						expect.arrayContaining(["C", "J"]),
						expect.arrayContaining(["B", "E"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["B", "G", "J"]),
						expect.arrayContaining(["C", "E", "H"]),
						expect.arrayContaining(["A", "F"]),
						expect.arrayContaining(["D", "I"])
					])
				]);
			});

			test("should properly seed a 13 team bracket", () => {
				expect(
					pittingService.generateInitialPittings({
						...BASE_LADDER,
						teams: {
							A: "A",
							B: "B",
							C: "C",
							D: "D",
							E: "E",
							F: "F",
							G: "G",
							H: "H",
							I: "I",
							J: "J",
							K: "K",
							L: "L",
							M: "M"
						}
					})
				).toEqual([
					[
						["A", "B", "C"],
						["D", "E", "F"],
						["G", "H", "I"],
						["J", "K"],
						["L", "M"]
					],
					expect.arrayContaining([
						expect.arrayContaining(["A", "D", "K"]),
						expect.arrayContaining(["B", "J", "L"]),
						expect.arrayContaining(["E", "H", "M"]),
						expect.arrayContaining(["F", "I"]),
						expect.arrayContaining(["C", "G"])
					]),
					expect.arrayContaining([
						expect.arrayContaining(["A", "I", "L"]),
						expect.arrayContaining(["C", "G", "J"]),
						expect.arrayContaining(["F", "K", "M"]),
						expect.arrayContaining(["B", "D"]),
						expect.arrayContaining(["D", "H"])
					])
				]);
			});
		});
	});
});

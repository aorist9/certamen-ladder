import ladderService, { useLadder, BACKEND_URL } from "./ladderService";
import { renderHook, act } from "@testing-library/react";
import { Ladder, LadderTypeV2 } from "../types/LadderType";
import { DrawType, LadderStyle } from "../constants";

jest.mock("./scoreSheetService", () => ({
	getScoreSheet: jest.fn(),
	updateScoreSheet: jest.fn()
}));

const BASIC_LADDER: LadderTypeV2 = {
	id: "1",
	name: "Test Ladder",
	drawType: DrawType.CLICK,
	ladderType: LadderStyle.TRADITIONAL,
	numRounds: 3,
	divisions: []
};

describe("ladderService", () => {
	describe("ladderService", () => {
		beforeEach(() => {
			jest.spyOn(window.localStorage.__proto__, "getItem").mockClear();
			jest.spyOn(window.localStorage.__proto__, "setItem").mockClear();
			jest.spyOn(window.localStorage.__proto__, "removeItem").mockClear();
		});

		describe("getLadders", () => {
			it("should return ladders from localStorage", () => {
				const ladders = [BASIC_LADDER];
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(JSON.stringify(ladders));

				const result = ladderService.getLadders();

				expect(localStorage.getItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders"
				);
				expect(result).toEqual(
					expect.arrayContaining([expect.objectContaining(BASIC_LADDER)])
				);
			});

			it("should return an empty array if no ladders are stored", () => {
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(null);

				const result = ladderService.getLadders();

				expect(localStorage.getItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders"
				);
				expect(result).toEqual([]);
			});
		});

		describe("addLadder", () => {
			it("should add a ladder to localStorage", () => {
				const ladders = [new Ladder(BASIC_LADDER)];
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(JSON.stringify(ladders));
				jest.spyOn(window.localStorage.__proto__, "setItem");

				const newLadder = new Ladder({ ...BASIC_LADDER, id: "2" });
				ladderService.addLadder(newLadder);

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders",
					JSON.stringify([newLadder, ...ladders])
				);
			});
		});

		describe("editLadder", () => {
			it("should update an existing ladder in localStorage", () => {
				const ladders = [new Ladder(BASIC_LADDER)];
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(JSON.stringify(ladders));
				jest.spyOn(window.localStorage.__proto__, "setItem");

				const updatedLadder = new Ladder({
					...BASIC_LADDER,
					name: "Updated Ladder"
				});
				ladderService.editLadder(updatedLadder);

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders",
					JSON.stringify([updatedLadder])
				);
			});

			it("should add a ladder if it does not exist", () => {
				const ladders = [new Ladder(BASIC_LADDER)];
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(JSON.stringify(ladders));
				jest.spyOn(window.localStorage.__proto__, "setItem");

				const newLadder = new Ladder({ ...BASIC_LADDER, id: "2" });
				ladderService.editLadder(newLadder);

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders",
					JSON.stringify([newLadder, ...ladders])
				);
			});
		});

		describe("deleteLadder", () => {
			it("should remove a ladder from localStorage", () => {
				const ladders = [BASIC_LADDER];
				jest
					.spyOn(window.localStorage.__proto__, "getItem")
					.mockReturnValue(JSON.stringify(ladders));
				jest.spyOn(window.localStorage.__proto__, "setItem");

				ladderService.deleteLadder(BASIC_LADDER.id);

				expect(localStorage.setItem).toHaveBeenCalledWith(
					"certamen-ladder.ladders",
					JSON.stringify([])
				);
			});
		});

		describe("publishLadder", () => {
			it("should publish a ladder and update it with a publicId", async () => {
				const mockResponse = { id: "public-id" };
				jest.spyOn(window, "fetch").mockResolvedValue({
					json: jest.fn().mockResolvedValue(mockResponse)
				} as any);
				jest.spyOn(ladderService, "editLadder");

				const result = await ladderService.publishLadder(
					new Ladder(BASIC_LADDER)
				);

				expect(window.fetch).toHaveBeenCalledWith(
					`${BACKEND_URL}/api/certamen/ladders.php`,
					{
						method: "POST",
						headers: { "content-type": "application/json" },
						body: expect.stringContaining(`"id":"${BASIC_LADDER.id}"`)
					}
				);
				expect(result.publicId).toBe(mockResponse.id);
			});
		});

		describe("useLadder", () => {
			it("should fetch and update ladder state", async () => {
				const { result } = renderHook(() =>
					useLadder({ ladderId: BASIC_LADDER.id })
				);

				act(() => {
					jest
						.spyOn(localStorage.__proto__, "getItem")
						.mockReturnValue(JSON.stringify([BASIC_LADDER]));
					result.current.updateLadder();
				});

				expect(result.current.ladder).toEqual(
					expect.objectContaining(BASIC_LADDER)
				);
			});
		});
	});
});

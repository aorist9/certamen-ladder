import { Question } from "./types/Round";

export const drawTypes: string[] = [
	"I wanna use scraps of paper like my ancestors did",
	"Have teams click a button to draw a letter",
	"Just assign teams a letter randomly"
];

export enum DrawType {
	TRADITIONAL = "I wanna use scraps of paper like my ancestors did",
	CLICK = "Have teams click a button to draw a letter",
	RANDOM = "Just assign teams a letter randomly"
}

export const ladderTypes: string[] = [
	"Traditional",
	"Swiss",
	"Swiss by Points",
	"Other"
];

export enum LadderStyle {
	TRADITIONAL = "Traditional",
	SWISS = "Swiss",
	SWISS_BY_POINTS = "Swiss by Points",
	OTHER = "Other"
}

export const letters: string[] = [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"H",
	"I",
	"J",
	"K",
	"L",
	"M",
	"N",
	"O",
	"P",
	"Q",
	"R",
	"S",
	"T",
	"U",
	"V",
	"W",
	"X",
	"Y",
	"Z",
	"\u03b1",
	"\u03b2",
	"\u03b3",
	"\u03b4",
	"\u03b5",
	"\u03b6",
	"\u03b7",
	"\u03b8",
	"\u03b9",
	"\u03ba",
	"\u03bb",
	"\u03bc",
	"\u03bd",
	"\u03be",
	"\u03bf",
	"\u03c0"
];

export const EMPTY_QUESTIONS: Question[] = Array(20).fill({
	buzzes: [],
	boni: []
});

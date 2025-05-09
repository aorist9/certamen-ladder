export interface Player {
	name: string;
	isCaptain?: boolean;
}

export interface Team {
	name: string;
	players: Player[];
}

export interface Question {
	buzzes: { team: string; player: number }[];
	correctTeam?: string;
	boni: boolean[];
	comments?: string;
}

export const LETTERS: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

export default class Round {
	public id: string;
	private _questions: Question[] = [];
	private _teams: Record<string, Team> = {};
	private _teamOrder: string[] = [];
	private _password?: string;

	constructor(
		id: string,
		teams: Team[],
		questions: Question[],
		password?: string
	) {
		this.id = id;
		this._questions = questions;
		this._teams = teams.reduce(
			(acc, team) => ({ ...acc, [team.name]: team }),
			{}
		);
		this._teamOrder = teams.map(team => team.name);
		this._password = password;
	}

	public set teamOrder(value: string[]) {
		this._teamOrder = value;
	}

	get questions() {
		return this._questions;
	}

	set questions(questions: Question[]) {
		this._questions = questions;
	}

	get scores(): number[] {
		return this._teamOrder.map(team =>
			this._questions.reduce((acc, question) => {
				if (question.correctTeam === team) {
					return (
						acc +
						10 +
						question.boni.reduce(
							(boniAcc, bonus) => boniAcc + (bonus ? 5 : 0),
							0
						)
					);
				} else {
					return acc;
				}
			}, 0)
		);
	}

	get teams(): Team[] {
		return this._teamOrder.map(team => this._teams[team]);
	}

	set teams(teams: Team[]) {
		this._teams = teams.reduce(
			(acc, team) => ({ ...acc, [team.name]: team }),
			{}
		);
		this._teamOrder = teams.map(team => team.name);
	}

	get password(): string | undefined {
		return this._password;
	}

	public toOutputObject(): RoundOutput {
		return {
			id: this.id,
			questions: this._questions,
			teams: this.teams,
			password: this._password
		};
	}
}

export interface RoundOutput {
	id: string;
	questions: Question[];
	teams: Team[];
	password?: string;
}

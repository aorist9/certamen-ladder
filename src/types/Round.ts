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
}

export default class Round {
	private _questions: Question[] = [];
	private _teams: Record<string, Team> = {};
	private _teamOrder: string[] = [];

	constructor(teams: Team[], questions: Question[]) {
		this.questions = questions;
		this.teams = teams;
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
}

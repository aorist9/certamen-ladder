export interface MatchTeam {
    team: string;
    score?: number;
    swissPoints?: number
}

type Matches = MatchTeam[][][];

export default Matches;

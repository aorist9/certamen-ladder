import React from 'react';
import ChooseDraw from '../components/Draw/ChooseDraw';
import ladderService from '../services/ladderService';
import OldFashionedDraw from '../components/Draw/OldFashionedDraw';
import RandomDraw from '../components/Draw/RandomDraw';
import LadderType from '../types/LadderType';
import './Draw.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

export type DrawProps = {
	addTeams: (teams: { [letter: string]: string }) => void;
};

const Draw = () => {
	const [query] = useSearchParams();
	const navigate = useNavigate();
	const ladder: LadderType | undefined = ladderService.getLadder(
		query.get('ladder') || ''
	);

	if (!ladder) {
		return (
			<section className="App-page draw">
				You may have reached this page in error
			</section>
		);
	}

	const addTeams = (teams: { [letter: string]: string }) => {
		ladderService.editLadder({ ...ladder, teams });
		navigate(`/ladder?ladder=${query.get('ladder')}`);
	};

	switch (ladder?.draw) {
		case 0: // old fashioned
			return <OldFashionedDraw addTeams={addTeams} />;
		case 1: // virtual choose
			return <ChooseDraw addTeams={addTeams} />;
		case 2: // random assignment
			return <RandomDraw addTeams={addTeams} />;
		default:
			return (
				<section className="App-page draw">
					You may have reached this page in error
				</section>
			);
	}
};

export default Draw;

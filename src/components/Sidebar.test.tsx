import React from 'react';
import { render, screen } from '@testing-library/react';
import Sidebar from './Sidebar';
import { BrowserRouter } from 'react-router-dom';

const renderSidebar = () => {
	render(
		<BrowserRouter>
			<Sidebar />
		</BrowserRouter>
	);
};

describe('Sidebar', () => {
	test('should include a link to create a new ladder', () => {
		renderSidebar();
		expect(screen.getByText(/create a new ladder/i)).toBeInTheDocument();
	});

	test('should include a link to view existing ladders', () => {
		renderSidebar();
		expect(screen.getByText(/existing ladders/i)).toBeInTheDocument();
	});
});

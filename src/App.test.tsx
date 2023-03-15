import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
	test('renders header', () => {
		render(<App />);
		const linkElement = screen.getByText(/Certamen Ladder/i);
		expect(linkElement).toBeInTheDocument();
	});

	test('includes sidebar', () => {
		render(<App />);
		expect(screen.getByText(/create a new ladder/i)).toBeInTheDocument();
	});
});

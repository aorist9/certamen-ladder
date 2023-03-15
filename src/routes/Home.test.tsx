import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';

describe('Home', () => {
	test('should show static text', () => {
		render(<Home />);
		expect(screen.getByText(/Home/i)).toBeInTheDocument();
	});
});

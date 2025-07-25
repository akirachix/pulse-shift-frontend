/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserProfile from '.';


describe('UserProfile', () => {
    test('renders profile image and admin label', () => {
        render(<UserProfile />);
        const img = screen.getByAltText('Admin Avatar');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', '/images/profile.png');
        expect(screen.getByText('Admin')).toBeInTheDocument();
    });
    test('dropdown menu is not visible initially', () => {
        render(<UserProfile />);
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
    test('shows menu when profile is clicked', () => {
        render(<UserProfile />);
        fireEvent.click(screen.getByTestId('profile-toggle'));
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
    test('hides menu when profile is clicked twice', () => {
        render(<UserProfile />);
        fireEvent.click(screen.getByTestId('profile-toggle')); // open
        fireEvent.click(screen.getByTestId('profile-toggle')); // close
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });
    test('dropdown links point to correct hrefs', () => {
        render(<UserProfile />);
        fireEvent.click(screen.getByTestId('profile-toggle'));
        expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/profile');
        expect(screen.getByText('Settings').closest('a')).toHaveAttribute('href', '/settings');
        expect(screen.getByText('Logout').closest('a')).toHaveAttribute('href', '/logout');
    });
});
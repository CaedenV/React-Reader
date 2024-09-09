import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import Single from './Single';
import { toBeInTheDocument } from '@testing-library/jest-dom';

// Mock useParams to return a specific bookId
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
}));

// Mock axios for API requests
jest.mock('axios');

// Mock moment for date formatting
jest.mock('moment', () => {
    return () => ({
        format: jest.fn(() => '2021-09-01'),
    });
});

describe('Single Page', () => {
    const mockBookData = {
        id: '9781250217325',
        title: 'Mock Book Title',
        author: 'Mock Author',
        desc: 'Mock Description',
        genre: 'Mock Genre',
        avgRating: 4.5,
        rateCount: 10,
        pubDate: '2022-01-01T00:00:00.000Z',
        cover: 'cover-url',
    };
    const mockFriendsData = {
        friends: [
            { friendUsersId: 1, userId: 1, friendId: 2 },
            { friendUsersId: 2, userId: 1, friendId: 3 },
        ],
    };

    beforeEach(() => {
        useParams.mockReturnValue({ bookId: '9781509866694' });

        // Mock API calls
        axios.get.mockImplementation((url) => {
            if (url.includes('getById')) {
                return Promise.resolve({ data: { book: mockBookData } });
            }
            if (url.includes('getUser')) {
                return Promise.resolve({ data: mockFriendsData });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    it('renders book info correctly -- NO USER', async () => {
        render(<Single />);

        // Check if the loading information appears (e.g., placeholders)
        // This would depend on how you handle loading states in the real component

        // Check if book information is rendered after API call
        await waitFor(() => expect(screen.getByText('Mock Book Title')).toBeInTheDocument());
        expect(screen.getByText('Mock Author')).toBeInTheDocument();
        expect(screen.getByText('Mock Genre')).toBeInTheDocument();
        expect(screen.getByText('2021-09-01')).toBeInTheDocument();
        expect(screen.getByText('Mock Description')).toBeInTheDocument();
        expect(screen.getByText(/4\.5\/5/)).toBeInTheDocument();
        expect(screen.getByText('10 review(s)')).toBeInTheDocument();
    });

    // it('renders friend list (to recommend) when user has friends', async () => {
    //     render(<Single userId={1} />);

    //     // Wait for the friends to be loaded and displayed
    //     await waitFor(() => expect(screen.getByText('Friend 1')).toBeInTheDocument());
    //     expect(screen.getByText('Friend 2')).toBeInTheDocument();
    // });

    // it('handles no friends gracefully', async () => {
    //     // Mock no friends data
    //     axios.get.mockImplementation((url) => {
    //         if (url.includes('getUser')) {
    //             return Promise.resolve({ data: { friends: [] } });
    //         }
    //         return Promise.reject(new Error('not found'));
    //     });

    //     render(<Single userId={1} />);

    //     await waitFor(() => expect(screen.getByText('Add more friends to share books with!')).toBeInTheDocument());
    // });

    // it('fetches and renders user library information when userId is provided', async () => {
    //     render(<Single userId={1} />);

    //     // Wait for the library data to be fetched and rendered.
    //     await waitFor(() => expect(screen.getByText(/ownedBooks/i)).toBeInTheDocument());

    //     // Since LibWrap component is rendered with the fetched library data,
    //     // you should verify that it displays the expected library information.
    //     // For example, you could check if the component displays a book from the library.

    //     expect(screen.getByText('ownedBooks')).toBeInTheDocument();
    //     expect(screen.queryByText('bookId1')).not.toBeInTheDocument(); // Depending on how the component renders the data

    //     // Check if any specific elements related to the library are displayed
    //     // or verify with a mock component like <LibWrap>.
    // });
});
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Sidebar } from '../Sidebar';
import '@testing-library/jest-dom';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

// Mock next/navigation
jest.mock('next/navigation', () => ({
    usePathname: () => '/merchant',
    useRouter: () => ({ push: jest.fn() }),
}));

// Mock Lucide icons to avoid rendering issues in test env
jest.mock('lucide-react', () => ({
    LayoutDashboard: () => <span data-testid="icon-home" />,
    Settings: () => <span data-testid="icon-settings" />,
    CreditCard: () => <span data-testid="icon-billing" />,
    FileText: () => <span data-testid="icon-logs" />,
    LogOut: () => <span data-testid="icon-logout" />,
    Coins: () => <span data-testid="icon-coins" />,
    ShieldCheck: () => <span data-testid="icon-shield" />
}));

// Mock Supabase Client
const mockSupabase = {
    auth: {
        signOut: jest.fn(),
    },
    from: jest.fn()
};

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => mockSupabase
}));

// Mock UI components that might be problematic or heavy
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className }: any) => (
        <button onClick={onClick} className={className}>{children}</button>
    )
}));
jest.mock('@/components/ui/avatar', () => ({
    Avatar: ({ children }: any) => <div>{children}</div>,
    AvatarImage: ({ src }: any) => <img src={src} alt="avatar" />,
    AvatarFallback: ({ children }: any) => <div>{children}</div>
}));
jest.mock('@/components/ui/badge', () => ({
    Badge: ({ children }: any) => <span>{children}</span>
}));


describe('Sidebar Component', () => {
    const defaultUser = {
        id: 'user_123',
        email: 'test@example.com',
        user_metadata: {
            full_name: 'Test User'
        }
    };
    const defaultCredits = 100;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders basic user info and navigation', () => {
        // Mock "not admin" response
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: null, error: null })
                })
            })
        });

        render(<Sidebar user={defaultUser} credits={defaultCredits} />);

        // Check User Info
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('100 credits')).toBeInTheDocument();

        // Check Standard Links
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Integrations')).toBeInTheDocument();
        expect(screen.getByText('Billing')).toBeInTheDocument();
        expect(screen.getByText('Call Logs')).toBeInTheDocument();

        // Check Sign Out
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('does NOT render admin link for regular user', async () => {
        // Mock "not admin" response (data: null)
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({ data: null })
                })
            })
        });

        render(<Sidebar user={defaultUser} credits={defaultCredits} />);

        // Wait for effect to run
        await waitFor(() => {
            const adminText = screen.queryByText('Super Admin Console');
            expect(adminText).not.toBeInTheDocument();
        });
    });

    it('renders admin link for admin user', async () => {
        // Mock "is admin" response (data: { id: ... })
        const mockHelpers = {
            single: jest.fn().mockResolvedValue({ data: { id: 'user_123' } }),
            eq: jest.fn(),
            select: jest.fn()
        };

        // Chain mocking: select -> eq -> single
        mockHelpers.select.mockReturnValue(mockHelpers);
        mockHelpers.eq.mockReturnValue(mockHelpers);

        mockSupabase.from.mockReturnValue(mockHelpers);

        render(<Sidebar user={defaultUser} credits={defaultCredits} />);

        // Ensure the chain was called correctly
        // We verify the appearance of the link
        await waitFor(() => {
            expect(screen.getByText('Super Admin Console')).toBeInTheDocument();
        });
    });
});

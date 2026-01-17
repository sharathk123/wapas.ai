import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SuperAdminView from '../SuperAdminView';
import '@testing-library/jest-dom';

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    MoreHorizontal: () => <span data-testid="icon-more" />,
    CheckCircle: () => <span data-testid="icon-check" />,
    XCircle: () => <span data-testid="icon-x" />,
    Ban: () => <span data-testid="icon-ban" />,
    Coins: () => <span data-testid="icon-coins" />,
    Loader2: () => <span data-testid="icon-loader" />,
    RefreshCw: () => <span data-testid="icon-refresh" />,
    Users: () => <span data-testid="icon-users" />,
    Phone: () => <span data-testid="icon-phone" />,
    Clock: () => <span data-testid="icon-clock" />
}));

// Mock Supabase Client
const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(), // For updates if needed
    update: jest.fn().mockReturnThis(), // For actions
};

jest.mock('@/lib/supabase/client', () => ({
    createClient: () => mockSupabase
}));

// Mock simple UI components to avoid Radix complexity
jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, className, disabled, ...props }: { children: React.ReactNode, onClick?: () => void, className?: string, disabled?: boolean }) => (
        <button onClick={onClick} className={className} disabled={disabled} {...props}>{children}</button>
    )
}));
jest.mock('@/components/ui/badge', () => ({
    Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}));
jest.mock('@/components/ui/card', () => ({
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));
jest.mock('@/components/ui/switch', () => ({
    Switch: ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
        <label>
            <input type="checkbox" checked={checked} onChange={() => onCheckedChange(!checked)} />
            Switch
        </label>
    )
}));

// Mock Dropdown for easier testing of actions
// We render the content immediately for testing purposes, or use a simple toggle
jest.mock('@/components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dropdown-content">{children}</div>,
    DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => <div onClick={onClick} role="menuitem">{children}</div>,
    DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DropdownMenuSeparator: () => <hr />,
}));
jest.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open }: { children: React.ReactNode, open: boolean }) => open ? <div>{children}</div> : null,
    DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SuperAdminView', () => {
    const mockMerchants = [
        {
            id: 'm1',
            store_name: 'Test Store 1',
            approval_status: 'pending',
            credits_balance: 50,
            shopify_domain: 'test1.myshopify.com',
            is_active: true,
            created_at: '2023-01-01'
        }
    ];

    const mockLogs = [
        {
            id: 'l1',
            status: 'sent',
            created_at: '2023-01-01',
            cart_value: 100,
            customer_phone: '1234567890',
            currency: 'INR'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup success response for fetchMerchants and fetchLogs
        mockSupabase.select.mockImplementation(() => {
            // Need to differentiate between merchants and logs somehow, or just return both mock types depending on the call
            // But since they are parallel, we can use simple mocking logic or `mockResolvedValueOnce`
            return {
                order: jest.fn().mockImplementation(() => {
                    return {
                        // This handles merchants
                        then: (callback: (args: { data: typeof mockMerchants, error: null }) => void) => callback({ data: mockMerchants, error: null }),
                        // This handles logs (since logs has .limit)
                        limit: jest.fn().mockResolvedValue({ data: mockLogs, error: null })
                    }
                })
            }
        });
    });

    it('renders the console dashboard properly', async () => {
        render(<SuperAdminView />);

        // Header
        expect(screen.getByText('Super Admin Console')).toBeInTheDocument();

        // Wait for data load
        await waitFor(() => {
            expect(screen.getByText('Test Store 1')).toBeInTheDocument();
        });

        // Check Stats
        expect(screen.getByText('Total Merchants')).toBeInTheDocument();
        expect(screen.getByText('Active Recoveries')).toBeInTheDocument();
    });

    it('does NOT show Approve/Reject buttons in dropdown', async () => {
        render(<SuperAdminView />);

        await waitFor(() => {
            expect(screen.getByText('Test Store 1')).toBeInTheDocument();
        });

        // Use the mocked dropdown content which is always rendered in our mock
        screen.getByTestId('dropdown-content');

        // Assertions for presence
        expect(screen.getByText('Suspend')).toBeInTheDocument();
        expect(screen.getByText('Add 50 Credits')).toBeInTheDocument();

        // Assertions for ABSENCE using queryByText which returns null if not found
        expect(screen.queryByText('Approve')).not.toBeInTheDocument();
        expect(screen.queryByText('Reject')).not.toBeInTheDocument();
    });

    it('shows Add Credits option', async () => {
        render(<SuperAdminView />);

        await waitFor(() => {
            expect(screen.getByText('Test Store 1')).toBeInTheDocument();
        });

        expect(screen.getByText('Add 50 Credits')).toBeInTheDocument();
    });
});

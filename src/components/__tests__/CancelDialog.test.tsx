import { render, screen, fireEvent } from '@testing-library/react';
import CancelDialog from '../CancelDialog';

describe('CancelDialog', () => {
  const mockConfirmCancelBooking = jest.fn();
  const mockSetShowCancelDialog = jest.fn();
  const mockSetBookingToCancel = jest.fn();

  beforeEach(() => {
    mockConfirmCancelBooking.mockClear();
    mockSetShowCancelDialog.mockClear();
    mockSetBookingToCancel.mockClear();
  });

  it('renders cancel dialog', () => {
    render(
      <CancelDialog
        showCancelDialog={true}
        confirmCancelBooking={mockConfirmCancelBooking}
        setShowCancelDialog={mockSetShowCancelDialog}
        setBookingToCancel={mockSetBookingToCancel}
      />
    );
    expect(screen.getByText('確認取消預約')).toBeInTheDocument();
    expect(screen.getByText('您確定要取消這個預約嗎？此操作無法復原。')).toBeInTheDocument();
  });

  it('does not render when showCancelDialog is false', () => {
    const { container } = render(
      <CancelDialog
        showCancelDialog={false}
        confirmCancelBooking={mockConfirmCancelBooking}
        setShowCancelDialog={mockSetShowCancelDialog}
        setBookingToCancel={mockSetBookingToCancel}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls confirmCancelBooking when confirm button is clicked', () => {
    render(
      <CancelDialog
        showCancelDialog={true}
        confirmCancelBooking={mockConfirmCancelBooking}
        setShowCancelDialog={mockSetShowCancelDialog}
        setBookingToCancel={mockSetBookingToCancel}
      />
    );
    const confirmButton = screen.getByText('確認取消');
    fireEvent.click(confirmButton);
    expect(mockConfirmCancelBooking).toHaveBeenCalled();
  });

  it('closes dialog when keep button is clicked', () => {
    render(
      <CancelDialog
        showCancelDialog={true}
        confirmCancelBooking={mockConfirmCancelBooking}
        setShowCancelDialog={mockSetShowCancelDialog}
        setBookingToCancel={mockSetBookingToCancel}
      />
    );
    const keepButton = screen.getByText('保留預約');
    fireEvent.click(keepButton);
    expect(mockSetShowCancelDialog).toHaveBeenCalledWith(false);
    expect(mockSetBookingToCancel).toHaveBeenCalledWith(null);
  });
});

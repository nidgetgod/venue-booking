import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookingDialog from '@/components/BookingDialog';

describe('BookingDialog', () => {
  const mockSetShowDialog = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when showDialog is false', () => {
    render(
      <BookingDialog
        showDialog={false}
        dialogType="success"
        dialogMessage="測試訊息"
        setShowDialog={mockSetShowDialog}
      />
    );
    expect(screen.queryByText('測試訊息')).not.toBeInTheDocument();
  });

  it('renders success dialog with correct content', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="success"
        dialogMessage="預約成功"
        setShowDialog={mockSetShowDialog}
      />
    );
    expect(screen.getByRole('heading', { name: 'success' })).toBeInTheDocument();
    expect(screen.getByText('預約成功')).toBeInTheDocument();
  });

  it('renders error dialog with correct content', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="error"
        dialogMessage="請填寫必填欄位"
        setShowDialog={mockSetShowDialog}
      />
    );
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.getByText('請填寫必填欄位')).toBeInTheDocument();
  });

  it('shows cancel success title when message includes 取消', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="success"
        dialogMessage="預約已成功取消"
        setShowDialog={mockSetShowDialog}
      />
    );
    expect(screen.getByText('cancelSuccess')).toBeInTheDocument();
  });

  it('calls setShowDialog when confirm button clicked', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="success"
        dialogMessage="測試訊息"
        setShowDialog={mockSetShowDialog}
      />
    );
    const confirmButton = screen.getByText('confirm');
    fireEvent.click(confirmButton);
    expect(mockSetShowDialog).toHaveBeenCalledWith(false);
  });

  it('applies correct styling for success dialog', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="success"
        dialogMessage="測試"
        setShowDialog={mockSetShowDialog}
      />
    );
    const confirmButton = screen.getByText('confirm');
    expect(confirmButton).toHaveClass('bg-green-600');
  });

  it('applies correct styling for error dialog', () => {
    render(
      <BookingDialog
        showDialog={true}
        dialogType="error"
        dialogMessage="測試"
        setShowDialog={mockSetShowDialog}
      />
    );
    const confirmButton = screen.getByText('confirm');
    expect(confirmButton).toHaveClass('bg-red-600');
  });
});

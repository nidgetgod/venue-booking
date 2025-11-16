import { render, screen, fireEvent } from '@testing-library/react';
import NavigationHeader from '../NavigationHeader';

describe('NavigationHeader', () => {
  const mockSetCurrentView = jest.fn();

  beforeEach(() => {
    mockSetCurrentView.mockClear();
  });

  it('renders header with title', () => {
    render(
      <NavigationHeader
        currentView="booking"
        setCurrentView={mockSetCurrentView}
      />
    );
    expect(screen.getByText('場地租借系統')).toBeInTheDocument();
  });

  it('highlights booking button when booking view is active', () => {
    render(
      <NavigationHeader
        currentView="booking"
        setCurrentView={mockSetCurrentView}
      />
    );
    const bookingButton = screen.getByText('預約租借');
    expect(bookingButton).toHaveClass('bg-blue-600');
  });

  it('highlights calendar button when calendar view is active', () => {
    render(
      <NavigationHeader
        currentView="calendar"
        setCurrentView={mockSetCurrentView}
      />
    );
    const calendarButton = screen.getByText('預約記錄');
    expect(calendarButton).toHaveClass('bg-blue-600');
  });

  it('calls setCurrentView with booking when booking button is clicked', () => {
    render(
      <NavigationHeader
        currentView="calendar"
        setCurrentView={mockSetCurrentView}
      />
    );
    const bookingButton = screen.getByText('預約租借');
    fireEvent.click(bookingButton);
    expect(mockSetCurrentView).toHaveBeenCalledWith('booking');
  });

  it('calls setCurrentView with calendar when calendar button is clicked', () => {
    render(
      <NavigationHeader
        currentView="booking"
        setCurrentView={mockSetCurrentView}
      />
    );
    const calendarButton = screen.getByText('預約記錄');
    fireEvent.click(calendarButton);
    expect(mockSetCurrentView).toHaveBeenCalledWith('calendar');
  });
});

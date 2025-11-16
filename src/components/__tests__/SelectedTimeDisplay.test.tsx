import React from 'react';
import { render, screen } from '@testing-library/react';
import SelectedTimeDisplay from '@/components/SelectedTimeDisplay';

describe('SelectedTimeDisplay', () => {
  it('does not render when no date selected', () => {
    render(<SelectedTimeDisplay selectedDate="" selectedTime="10:00-11:00" />);
    expect(screen.queryByText('已選擇時段')).not.toBeInTheDocument();
  });

  it('does not render when no time selected', () => {
    render(<SelectedTimeDisplay selectedDate="2025-11-16" selectedTime="" />);
    expect(screen.queryByText('已選擇時段')).not.toBeInTheDocument();
  });

  it('renders when both date and time are selected', () => {
    render(<SelectedTimeDisplay selectedDate="2025-11-16" selectedTime="10:00-11:00" />);
    expect(screen.getByText('已選擇時段')).toBeInTheDocument();
  });

  it('displays selected time', () => {
    render(<SelectedTimeDisplay selectedDate="2025-11-16" selectedTime="10:00-11:00" />);
    expect(screen.getByText('10:00-11:00')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(
      <SelectedTimeDisplay selectedDate="2025-11-16" selectedTime="10:00-11:00" />
    );
    const displayContainer = container.firstChild;
    expect(displayContainer).toHaveClass('bg-blue-50');
  });
});

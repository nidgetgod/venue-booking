import React from 'react';
import { render, screen } from '@testing-library/react';
import VenuePricing from '@/components/VenuePricing';

describe('VenuePricing', () => {
  it('renders the pricing title', () => {
    render(<VenuePricing />);
    expect(screen.getByText('💰 場地費用')).toBeInTheDocument();
  });

  it('renders morning charity period pricing', () => {
    render(<VenuePricing />);
    expect(screen.getByText('🌅 公益時段 (6:00-8:00)')).toBeInTheDocument();
    expect(screen.getByText('NT$ 50 / 場地 / 小時')).toBeInTheDocument();
    const nt100Elements = screen.getAllByText('NT$ 100 / 場地 / 小時');
    expect(nt100Elements.length).toBeGreaterThan(0);
  });

  it('renders weekday daytime pricing', () => {
    render(<VenuePricing />);
    expect(screen.getByText('🌞 平日日間 (8:00-18:00)')).toBeInTheDocument();
  });

  it('renders prime time pricing', () => {
    render(<VenuePricing />);
    expect(screen.getByText('🌙 黃金時段')).toBeInTheDocument();
    expect(screen.getByText('平日18:00-21:00 及 假日全天')).toBeInTheDocument();
    expect(screen.getByText('NT$ 200 / 場地 / 小時')).toBeInTheDocument();
  });

  it('renders payment notice', () => {
    render(<VenuePricing />);
    expect(screen.getByText('💡 所有費用以單個場地計算，請於現場付款')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<VenuePricing />);
    const pricingContainer = container.firstChild;
    expect(pricingContainer).toHaveClass('bg-green-50');
  });
});

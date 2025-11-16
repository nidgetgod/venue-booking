import React from 'react';
import { render, screen } from '@testing-library/react';
import VenueRules from '@/components/VenueRules';

describe('VenueRules', () => {
  it('renders the rules title', () => {
    render(<VenueRules />);
    expect(screen.getByText('📋 場地使用規則')).toBeInTheDocument();
  });

  it('renders all venue rules', () => {
    render(<VenueRules />);
    expect(screen.getByText('• 務必穿著室內羽球鞋')).toBeInTheDocument();
    expect(screen.getByText('• 地板污漬請順手清理再離場')).toBeInTheDocument();
    expect(screen.getByText('• 除水和運動飲料，禁止攜帶食物飲料進入場館')).toBeInTheDocument();
    expect(screen.getByText('• 垃圾請帶離場館，請勿將垃圾投放在廁所')).toBeInTheDocument();
    expect(screen.getByText('• 提醒年幼孩童注意安全')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<VenueRules />);
    const rulesContainer = container.firstChild;
    expect(rulesContainer).toHaveClass('bg-orange-50');
  });
});

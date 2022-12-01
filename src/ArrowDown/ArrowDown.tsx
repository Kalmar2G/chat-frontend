import React from 'react';
import './ArrowDown.css';

export const ArrowDown = ({ onClick }: {onClick: () => void}) => (
  <button className="Button" type="button" onClick={onClick}>
    <div className="ArrowDown">↓</div>
  </button>
);

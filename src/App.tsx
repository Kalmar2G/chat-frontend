import React, { useEffect } from 'react';
import md5 from 'md5';
import './App.css';
import { ChatContainer } from './ChatConainer';

export const App = () => {
  useEffect(() => {
    const id = md5(Math.random().toString(15).substring(10, 20));
    if (!sessionStorage.getItem('id')) {
      sessionStorage.setItem('id', id);
    }
  }, []);
  return (
    <div className="App">
      <ChatContainer />
    </div>
  );
};

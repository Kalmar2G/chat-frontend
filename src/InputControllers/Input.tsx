import React from 'react';
import { ArrowDown } from '../ArrowDown';
import './Input.css';

interface InputProps {
    sendMessage: () => void,
    setInputValue: (value: string) => void,
    arrowDownClick: () => void,
    arrowVisible: boolean,
    inputValue: string
}
export const Input = ({
  sendMessage, inputValue, setInputValue, arrowVisible, arrowDownClick
}: InputProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };
  return (
    <>
      <div className="InputContainer">
        {arrowVisible && (<ArrowDown onClick={arrowDownClick} />)}
        <form
          onSubmit={handleSubmit}
          className="Form"
        >
          <input
            className="Input"
            value={inputValue}
            onChange={((event) => setInputValue(event.target.value))}
          />
          <button className="SubmitButton" type="submit">➜</button>
        </form>
      </div>
    </>
  );
};

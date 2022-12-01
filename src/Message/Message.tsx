import React, { FC } from 'react';
import './Message.css';
import { convertToTimeDate } from '../utils';
import { IMessage } from '../types';

interface MessageProps extends IMessage{
    index?: number,
    isLastMessage: boolean,
    isFirstMessage?: boolean,
    isShowUsername: Boolean,
    lastElementRefFn: (node: any) => void,
    firstElementRefFn: (node: any) => void,
}

export const Message: FC<MessageProps> = ({
  color, isShowTime, username, date, text,
  isLastMessage, isShowUsername, lastElementRefFn, firstElementRefFn, isFirstMessage
}: MessageProps) => {
  const getRef = () => {
    if (isLastMessage) {
      return lastElementRefFn;
    }
    if (isFirstMessage) {
      return firstElementRefFn;
    }
    return undefined;
  };
  return (
    <div
      className="MessageContainer"
      ref={getRef()}
    >
      <>
        <div className="Message">
          <span>
            {isShowUsername ? (
              <span className="Username" style={{ color: `${color}` }}>{username}</span>)
              : (
                <span>{text}</span>)}
          </span>
          <span>
            {(isShowUsername || isShowTime)
              ? convertToTimeDate(date) : null}
          </span>
        </div>
        {isShowUsername && (
        <span>{text}</span>)}
      </>
    </div>
  );
};

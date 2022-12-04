import React, {
  useCallback, useEffect, useReducer, useRef, useState
} from 'react';
import get from 'lodash/get';
import { Message } from '../Message';
import { Input } from '../InputControllers';
import { useWebSocket } from '../hooks';
import { scrollToBottom } from '../utils';
import './ChatContainer.css';
import { IMessage } from '../types';
import { Loader } from '../Loader';

let firstRenderArrowDownDisable = true;
const msgArr: IMessage[] = [];

export const ChatContainer = () => {
  const [arrowVisible, setArrowVisible] = useState(false);
  const [page, addPage] = useReducer((i) => i + 1, 0);
  const totalPages = useRef(10000);
  const [messages, setMessages] = useState(msgArr);
  const [inputValue, setInputValue] = useState('');
  const isLoading = useRef(false);
  const botObserverRef: React.MutableRefObject<IntersectionObserver | null> = useRef(null);
  const topObserverRef: React.MutableRefObject<IntersectionObserver | null> = useRef(null);
  const firstMessageDivRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const firstMessageDivRefPrev: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const lastMessageDivRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);
  const chatContainerRef: React.MutableRefObject<HTMLDivElement | null> = useRef(null);

  const pageScroll = () => {
    scrollToBottom(chatContainerRef.current);
  };

  const socket = useWebSocket();

  const sendMessage = async () => {
    if (inputValue) {
      const message = {
        event: 'message',
        text: inputValue,
        username: sessionStorage.getItem('id')
      };
      await socket.send(JSON.stringify(message));
      setInputValue('');
      pageScroll();
    }
  };

  socket.onmessage = ({ data }) => {
    const newMsg = JSON.parse(data);
    setMessages((prev) => [...prev, newMsg]);
    if (!arrowVisible) {
      pageScroll();
    }
  };
  const fetchMessages = useCallback(async () => {
    if (isLoading.current) {
      return;
    }
    firstMessageDivRefPrev.current = firstMessageDivRef.current;
    isLoading.current = true;
    await fetch('https://chat-backend-8qnf.onrender.com/api/allMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        page
      })
    }).then(async (res) => {
      const data = await res.json();
      setMessages((prev) => [...data?.messages, ...prev]);
      totalPages.current = Math.floor(data?.totalCount / 200);
      addPage();
      if (firstRenderArrowDownDisable) {
        pageScroll();
      }
      setTimeout(() => {
        isLoading.current = false;
      }, 1000);
    }).catch(() => {
      throw new Error('fetch failed');
    });
  }, [page]);

  useEffect(() => {
    (async () => { await fetchMessages(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastMessageRef = useCallback((node: HTMLDivElement) => {
    if (!node) {
      return;
    }
    if (lastMessageDivRef.current) {
      botObserverRef.current?.unobserve(lastMessageDivRef.current);
    }
    botObserverRef.current = new IntersectionObserver(([entry]) => {
      if (firstRenderArrowDownDisable) {
        firstRenderArrowDownDisable = false;
        return;
      }
      setArrowVisible(!entry?.isIntersecting);
    }, {
      root: chatContainerRef.current,
      rootMargin: '500px',
      threshold: 1.0
    });
    botObserverRef.current.observe(node);
    lastMessageDivRef.current = node;
  }, []);

  const firstMessageRef = useCallback((node: HTMLDivElement) => {
    if (!node) {
      return;
    }
    if (firstMessageDivRef.current) {
      topObserverRef.current?.unobserve(firstMessageDivRef.current);
    }
    topObserverRef.current = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting && !firstRenderArrowDownDisable && page <= totalPages.current) {
        await fetchMessages();
        firstMessageDivRefPrev.current?.scrollIntoView(true);
      }
    }, {
      root: chatContainerRef.current,
      rootMargin: '5px',
      threshold: 1.0
    });
    topObserverRef.current.observe(node);
    firstMessageDivRef.current = node;
  }, [fetchMessages, page]);

  return (
    <div
      className="ChatContainer"
      ref={chatContainerRef}
    >
      {messages?.length ? (
        <div className="MessagesContainer">
          {messages.map((msg, index) => {
            const {
              id, color, isShowTime, username, date, text,
            } = msg;
            const isShowUsername = get(messages, `[${index - 1}].username`) !== username;
            return (
              <Message
                key={id}
                text={text}
                index={index}
                lastElementRefFn={lastMessageRef}
                isFirstMessage={index === 0}
                firstElementRefFn={firstMessageRef}
                isShowUsername={isShowUsername}
                username={username}
                color={color}
                isShowTime={isShowTime}
                isLastMessage={messages.length - 1 === index}
                date={date}
              />
            );
          })}
        </div>
      ) : (<Loader />)}
      <Input
        sendMessage={sendMessage}
        setInputValue={setInputValue}
        arrowDownClick={pageScroll}
        arrowVisible={arrowVisible}
        inputValue={inputValue}
      />
    </div>
  );
};

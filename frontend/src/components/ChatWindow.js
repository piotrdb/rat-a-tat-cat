import React from 'react';

import Message from './Message';

const ChatWindow = (props) => {
    const chat = props.chat.slice(-12)
        .map(m => <Message 
            key={Date.now() * Math.random()}
            user={m.user}
            message={m.message}/>);

    return(
        <div className="chat-element">
            {chat}
        </div>
    )
};

export default ChatWindow;
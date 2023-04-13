import SendMessageForm from "./SendMessageForm";
import MessageContainer from "./MessageContainer";

const Chat = ({ sendMessage, messages }) => {
  return (
      <div className="chat">
        <MessageContainer messages={messages} />
        <SendMessageForm sendMessage={sendMessage} />
      </div>
  );
};
export default Chat;

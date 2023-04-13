import { Form, Button, FormControl, InputGroup } from "react-bootstrap";
import { useState } from "react";

const SendMessageForm = ({ sendMessage }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="send-message-box">
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message);
          setMessage("");
        }}
      >
        <InputGroup>
          <FormControl
            type="user"
            placeholder="Napisz wiadomość..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <InputGroup>
            <Button
              className="message-send-button"
              variant="primary"
              type="submit"
              disabled={!message}
            >
              Wyślij
            </Button>
          </InputGroup>
        </InputGroup>
      </Form>
    </div>
  );
};

export default SendMessageForm;

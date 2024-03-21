import { memo, useEffect, useState } from "react"
import "./Chat.css"
import Message from "./Message";
import { formatRequest } from "../../../utils";

const Chat = memo(function Chat() {

  const [ currentMessage, setCurrentMessage ] = useState("");
  const [ thread, setThread ] = useState([]);
  const [ responding, setResponding ] = useState(false);
  
  const onChange = e => {
      setCurrentMessage(e.target.value);
      e.target.style.height = "52px";
      const scrollHeight = Math.max(52, e.target.scrollHeight)
      e.target.style.height = `${scrollHeight}px`;
  }

  const onSubmit = e => {
    e.preventDefault();
  }

  const chatCompletion = async () => {
    setResponding(true);
    const request = formatRequest("POST", thread, {}, true);
    const res = await fetch("http://localhost:8000/saviors/threads", request);
    const reader = res.body.getReader();
    let { value, done } = await reader.read();
    const decode = (value) => new TextDecoder().decode(value.buffer)
    setThread(prev => [...prev, {role: "assistant", content: decode(value)}])
    while (!done) {
      ({ value, done } = await reader.read());
      if (!done) {
        setThread(prev => {
          const lastMessage = prev.at(-1);
          return [
            ...prev.slice(0, prev.length - 1), {
              ...lastMessage,
              content: lastMessage.content.concat(" ", decode(value))
            }
          ];
        });
      }
    }
    setResponding(false);
  }

  const onKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentMessage) {
        setThread(prev => [...prev, {role: "user", content: currentMessage}]);
        setCurrentMessage("");
        chatCompletion();
      }
      e.target.style.height = "52px";
    };
  }

  useEffect(() => {console.log(thread)}, [thread]);

  return (
    <div className="chat-room">
      <div className="messages">
        {thread.length > 0 && thread.map((message, i) => (
          <Message role={message.role} content={message.content} key={i}/>
        ))}
      </div>
      <div className="chat-box">
        <div className="suggestions"></div>
        <div className="send">
          <form onSubmit={e => onSubmit(e)}>
            <textarea 
              placeholder="chat here" 
              name="text"
              style={{ height: 52, overflowY: "hidden" }}
              onChange={e => onChange(e)}
              value={currentMessage}
              disabled={responding}
              onKeyDown={e => onKeyDown(e)}
            />
          </form>
        </div>
      </div>
    </div>
  )
})

export default Chat
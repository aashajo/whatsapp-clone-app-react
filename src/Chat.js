import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined, AttachFile, MoreVert } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{user}, dispatch] = useStateValue();

  //useEffect runs given code when component load
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000)); //Whenever sidebar chats loads, it set random avatar icons everytime
  }, []);

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

        db.collection("rooms").doc(roomId).collection("messages").orderBy("timestamp", "asc").onSnapshot((snapshot) => 
        setMessages(snapshot.docs.map((doc)=>doc.data())))
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("you typed--", input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    setInput(""); //Removes the input from textbox once sent
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat_header_info">
          <h3>{roomName}</h3>
          <p>Last seen{""}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}
          </p>
        </div>

        <div className="chat_header_right">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat_body">
        {messages.map(message => (
            <p className={`chat_message ${message.name === user.displayName && "chat_reciever"}`}>
            <span className="chat_name">{message.name}</span>
        {message.message}<span className="chat_timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
          </p>
        ))}
        
      </div>

      <div className="chat_footer">
        <InsertEmoticonIcon />
        <form>
          <input
            type="text"
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;

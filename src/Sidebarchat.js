import React, { useState, useEffect } from "react";
import "./Sidebarchat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";

function Sidebarchat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  //useEffect runs given code when component load
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000)); //Whenever sidebar chats loads, it set random avatar icons everytime
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter a name for chat");

    if (roomName) {
      //user gives a name
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarchat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarchat_info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div className="sidebarchat" onClick={createChat}>
      <h2>Add new chat</h2>
    </div>
  );
}

export default Sidebarchat;

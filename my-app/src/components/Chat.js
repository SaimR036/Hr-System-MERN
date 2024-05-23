import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Updated import statement
import { useEffect, useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatList, setChatList] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [sender,setSender] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessages();
        }
    }, [selectedFriend]);

    const fetchFriends = async () => {
        try {
             const token = localStorage.getItem('token');
             const decodedToken = jwtDecode(token);
             const userId = decodedToken.userId;
            
            const response = await axios.get(`http://localhost:3001/getfriend/${userId}`);
            const friendIds = response.data;
            console.log('FRIEND',friendIds);
            const friendsDetails = await Promise.all(friendIds.map(async (friendId) => {
                const userResponse = await axios.get(`http://localhost:3001/user/${friendId}`);
                const user = userResponse.data;
                setSelectedFriend(user);
                console.log('selectedfriend', user);
              
                return { id: user._id, name: `${user.firstName} ${user.lastName}` };
            }));
            setChatList(friendsDetails);
           // console.log(friendsDetails);

        } catch (error) {
            console.error('Fetch Friends Error:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            // const token = localStorage.getItem('token');
            // const decodedToken = jwtDecode(token);
            // const userId = decodedToken.userId;
            const token = localStorage.getItem('token');
             const decodedToken = jwtDecode(token);
             const userId = decodedToken.userId;
            console.log('selected',selectedFriend)
            const response =  await axios.post('http://localhost:3001/messages', {
                userId: userId,
                friendId: selectedFriend
            });
            const messages = response.data;
            console.log(messages)

            const messagesWithUsernames = await Promise.all(messages.map(async (message) => {
                
                const senderResponse = await axios.get(`http://localhost:3001/users/${message.sender_id}`);
                const sender = senderResponse.data;
                console.log('sender');
                console.log('sender',sender);
                return { ...message, sender_username: sender.username }; 
            }));
            setMessages(messagesWithUsernames);
            
        } catch (error) {
            console.error('Fetch Messages Error:', error);
        }
        console.log('here');
        // const messagesWithUsernames = await Promise.all(messages.map(async (message) => {
        //     console.log('mesg sender');
        //     const senderResponse = await axios.get(`http://localhost:3001/users/${message.sender_id}`);
        //     const sender = senderResponse.data;
        //     console.log('sender');
        //     console.log('sender',sender);
        //     return { ...message, sender_username: 'Unknown' }; 
        // }));
        // setMessages(messagesWithUsernames);
    };

    const handleFriendClick = (friendId) => {
        setSelectedFriend(friendId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            // const token = localStorage.getItem('token');
            // const decodedToken = jwtDecode(token);
            // const senderId = decodedToken.userId;
            const token = localStorage.getItem('token');
             const decodedToken = jwtDecode(token);
             const senderId = decodedToken.userId;

            await axios.post('http://localhost:3001/send-message', {
                
                sender_id: senderId,
                receiver_id: selectedFriend,
                message: newMessage
            });
            //console.log('senderr',sender.username);
            await fetchMessages();

            setNewMessage('');
        } catch (error) {
            console.error('Send Message Error:', error);
        }
    };

    return (

        <>
   

        <div className="mt-20 container-fluid d-flex flex-column min-vh-80">
            <div className="d-flex" style={{ height: 'calc(100vh - 20px)' }}>
                <div className="d-flex flex-column" style={{ width: '25%', height: '100vh', backgroundColor: '#f0f0f0' }}>
                    <div className="container-fluid">
                        <h2>Chats</h2>
                        
                        <div className="list-group">
                            {chatList.map((chat) => (
                                <div key={chat.id} className="list-group-item">
                                    <div className="row">
                                        <div className="col-12">
                                            <button className="btn btn-light btn-block mt-2 border border-black" style={{ width: '100%' }} onClick={() => handleFriendClick(chat.id)}>
                                                {chat.name}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow-1"></div>
                </div>
                <div className="vertical-line"></div>
                <div className="flex-column" style={{ width: '75%', height: '100%', wordWrap: 'break-word', marginLeft: '10px', marginRight: '10px', position: 'relative' }}>
                    <div className="overflow-auto" style={{ height: 'calc(100% - 50px)', paddingBottom: '70px' }}>
                        {messages.map((message) => (
                            <div key={message._id} className={`alert ${message.sender_id === 'User' ? 'alert-primary' : 'alert-secondary'}`}>
                                <strong>{message.sender_username}:</strong> {message.message}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="position-absolute" style={{ bottom: '0', left: '0', right: '0', padding: '15px', borderTop: '1px solid #dee2e6', background: '#f8f9fa' }}>
                        <div className="input-group">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="form-control"
                            />
                            <button type="submit" className="btn btn-primary">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default Chat;

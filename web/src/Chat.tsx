import './Chat.css'

interface Message {
    id: string,
    message: string,
    time: string
}

const Chat : React.FC<Message> = ({id, message, time}) => {
    return (
        <div className="Chat" id={id}>
            <div className="Message-Box">
                <p className="Message-Content">
                    {message}
                </p>
                <p className="Message-Time">
                    {time}
                </p>
            </div>
        </div>
    )
}

export default Chat;
import React from 'react';
import MessageCard from "./MessageCard";

export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedSnap: undefined
        }
    }
    
    componentDidMount() {
        this.props.messagesRef.on("value", snap => {
            this.setState({feedSnap: snap});
        });
    }

    componentWillUnmount() {
        this.props.messagesRef.off();
    }

    componentWillReceiveProps(nextProps) {
        nextProps.messagesRef.on("value", snap => {
            this.setState({feedSnap: snap});
        });
    }
    
    render() {
        let messages = [];
        if (this.state.feedSnap) {
            this.state.feedSnap.forEach(m => {
                messages.push(
                    <MessageCard key={m.key} snap={m} />
                );
            });
        }
        return (
            <div className="container">
                <div className="list-group">
                    {messages}
                </div>
            </div>
        );
    }
}
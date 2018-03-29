import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default class MessageCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            snap: this.props.snap,
            message: this.props.snap.val(),
            editing: false,
            editedMessage: "",
            currentUser: firebase.auth().currentUser
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({snap: nextProps.snap, message: nextProps.snap.val()});
    }

    handleEdit(evt) {
        evt.preventDefault();
        let newMessage = this.state.editedMessage ? 
            this.state.editedMessage : this.state.message.body;
        this.props.snap.ref.update({body: newMessage})
            .then(() => this.setState({editing: false, editedMessage: ""}));
    }

    render() {
        return (
            <div className="container border border-light pt-3">
                <div className="row">
                    <div className="col-1">
                        <img className="rounded img-fluid" src={this.state.message.author.photoURL}
                                        alt={this.state.message.author.displayName}/>
                    </div>
                    <div className="row col-11 ml-2">
                        <div>
                            <h4>{this.state.message.author.displayName}</h4>
                            {
                                this.state.editing ?
                                    <form onSubmit={evt => this.handleEdit(evt)}>
                                        <input className="form-control"
                                            type="text"
                                            defaultValue={this.state.message.body}
                                            onInput={evt => this.setState({
                                                editedMessage: evt.target.value
                                            })}/>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-info">Finish</button>
                                        </div>
                                    </form> :
                                    <div className="container">
                                        <span>{new Date(this.state.message.createdAt).toLocaleString()}</span>
                                        <p>{this.state.message.body}</p>
                                    </div>
                            }
                        </div>
                        <div>
                        {
                            this.state.message.author.uid === this.state.currentUser.uid ?
                                <div className="btn-group">
                                    <div className="btn btn-info" aria-label="edit" 
                                        onClick={() => this.setState({editing: true})}>
                                        Edit Post
                                    </div>
                                    <div className="btn btn-danger" aria-label="close" 
                                        onClick={() => this.state.snap.ref.remove()}>
                                        Delete
                                    </div>
                                </div> :
                                ""
                        }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
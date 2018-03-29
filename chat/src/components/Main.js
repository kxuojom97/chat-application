import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {ROUTES} from "./constants";
import {Link} from "react-router-dom";
import Feed from "./Feed";

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ref: firebase.database().ref("messages/" + this.props.match.params.chanName),
            message: "",
            currentUser: undefined
        }
    }

    componentDidMount() {
        this.authUnListen = firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                this.props.history.push(ROUTES.signIn);
            } else {
                this.setState({currentUser: user.displayName});
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ref: firebase.database().ref("messages/" + nextProps.match.params.chanName),
            message: ""
        })
    }
    componentWillUnmount() {
        this.authUnListen();
    }

    handleSignOut() {
        firebase.auth().signOut()
            .then(() => this.props.history.push(ROUTES.signIn))
            .catch(err => this.setState({fberror: err}));
    }

    handleNewMsg(evt) {
        evt.preventDefault();
        let user = firebase.auth().currentUser;
        this.state.ref.push({
            body: this.state.message,
            author: {
                uid: user.uid,
                displayName: user.displayName,
                photoURL: user.photoURL,
            },
            createdAt: firebase.database.ServerValue.TIMESTAMP
        });
        this.setState({message: ""});
    }

    render() {
        const linkStyle = {
            color: "white",
            textDecoration: "none"
        }
        return (
            <div>
                <header className="bg-secondary text-white">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1 className="col">#{this.props.match.params.chanName}</h1>
                            </div>
                            <div className="col-auto">
                                <div className="btn bg-danger" onClick={evt => 
                                    this.handleSignOut()}>Sign Out {this.state.currentUser}</div>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <div className="btn-group">
                        {
                            this.props.match.params.chanName !== "general" ? 
                            <div className="btn btn-primary mt-3 mb-3">
                                <Link to={ROUTES.general} style={linkStyle}>To general channel</Link> 
                            </div> :
                            ""
                        }
                        {
                            this.props.match.params.chanName !== "random" ? 
                            <div className="btn btn-primary mt-3 mb-3">
                                <Link to={ROUTES.random} style={linkStyle}>To random channel</Link> 
                            </div> :
                            ""
                        }
                    </div>
                </div>
                <div className="container">
                    <form onSubmit={evt => this.handleNewMsg(evt)}>
                        <label>New Message</label>
                        <input className="form-control"
                            type="text"
                            value={this.state.message}
                            placeholder="Enter your message here"
                            onInput={evt => this.setState({
                                message: evt.target.value
                            })}/>
                        <div className="form-group mt-2">
                            <button type="submit" className="btn btn-info">Post</button>
                        </div>
                    </form>
                </div>
                <Feed messagesRef={this.state.ref.limitToLast(500)} />
            </div>
        );
    }
}
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {ROUTES} from "./constants";
import {Link} from "react-router-dom";

export default class SignInView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            currentUser: undefined
        }
    }

    componentDidMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.history.push(ROUTES.general);
            } else {
                this.setState({currentUser: user});
            }
        });
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    handleSignIn(evt) {
        evt.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => this.props.history.push(ROUTES.general))
            .catch(err => this.setState({fberror: err.message}));
    }

    render() {
        return (
            <div>
                <header className="jumbotron jumbotron-fluid bg-info text-white">
                    <div className="container">
                        <h1>Sign Up</h1>
                    </div>
                </header>
                <div className="container">
                    {
                        this.state.fberror ?
                            <div className="alert alert-danger mt-3">
                                {this.state.fberror}
                            </div> :
                            undefined
                    }
                    <form onSubmit={evt => this.handleSignIn(evt)}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="text"
                                id="email"
                                className="form-control"
                                placeholder="your email address"
                                onInput={evt => this.setState({email: evt.target.value})} required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                id="password"
                                className="form-control"
                                placeholder="your password"
                                onInput={evt => this.setState({password: evt.target.value})} required/>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-info">Sign In</button>
                        </div>
                    </form>
                    <p>Don't have an account yet?<Link to={ROUTES.signUp}> Sign Up!</Link></p>
                </div>
            </div>
        );
    }
}
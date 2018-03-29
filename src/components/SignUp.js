import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {ROUTES} from "./constants";
import {Link} from "react-router-dom";
import md5 from "blueimp-md5";

export default class SignUpView extends React.Component {
    constructor(props) {
        super(props);
        this.state =  {
            email: "",
            password: "",
            confirmPassword: "",
            currentUser: ""
        };
    }

    componentDidMount() {
        this.authUnsub = firebase.auth().onAuthStateChanged(user => 
            this.setState({currentUser: user}));
    }
    
    componentWillUnmount() {
        this.authUnsub();
    }

    handleSignUp(evt) {
        evt.preventDefault();
        if (this.state.password.length < 6) {
            this.setState({fberror: "Password needs to be at least 6 characters", password: "",
                confirmPassword: ""});
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({fberror: "Passwords don't match", password: "",
                confirmPassword: ""});
        } else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                    let email = this.state.email;
                    email = md5(email.trim().toLowerCase());
                    user.updateProfile({
                        displayName: this.state.currentUser,
                        photoURL: "https://www.gravatar.com/avatar/" + email
                    });
                }
            )
            .then(() => this.props.history.push(ROUTES.general))
            .catch(err => this.setState({fberror: err.message}))
        }
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
                    <form onSubmit={evt => this.handleSignUp(evt)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text"
                                className="form-control"
                                placeholder="your username"
                                onInput={evt => this.setState({currentUser: evt.target.value})} required/>
                        </div>
                        <div className="form-group"> 
                            <label>Email Address</label>
                            <input type="text"
                                className="form-control"
                                placeholder="your email address"
                                onInput={evt => this.setState({email: evt.target.value})} required/>   
                        </div>
                        <div className="form-group"> 
                            <label>Password</label>
                            <input type="password"
                                className="form-control"
                                placeholder="your password"
                                onInput={evt => this.setState({password: evt.target.value})} required/> 
                        </div>
                        <div className="form-group"> 
                            <label>Confirm Password</label>
                            <input type="password"
                                className="form-control"
                                placeholder="your password"
                                onInput={evt => this.setState({confirmPassword: evt.target.value})} required/> 
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-info">Sign Up</button>
                        </div>
                    </form>
                    <p>Already have an account?<Link to={ROUTES.signIn}> Sign In!</Link></p>
                </div>
            </div>
        );
    }
}
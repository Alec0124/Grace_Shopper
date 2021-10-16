import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { fetchRegister, respError, fetchUsers, fetchLogin } from '../api/index.js';
import { FormError } from './index.js';
// module.imports = {
//     fetchRegister
// };

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));



const Auth = ({ user, setUser }) => {
    //need to make it to where clicking register takes you to a /register route
    //OR make the element changed to have fields needed to register

    //Constants
    const [authDisplay, setAuthDisplay] = useState('not-logged-in');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const classes = useStyles();

    //Functions

    const displayError = (errorName) => {
        // console.log("errorMessge: ", errorMessage);
        if (!!errorMessage && !!errorMessage[errorName]) {
            return <div className="error">
                {errorMessage[errorName]}
            </div>
        } else {
            return <>

            </>
        }
    };

    // const displayError = () => {
    //     console.log("errorMessge: ", errorMessage);
    //     if ( !!errorMessage && !!errorMessage[errorName] ) {
    //         return <div className="error">
    //                 ERROR
    //         </div>
    //     } else {
    //         return <>

    //         </>
    //     }
    // };
    const displayLogin = () => {
        setAuthDisplay('login');
    }
    const displayRegister = () => {
        setAuthDisplay('register');
    }
    const displayBase = () => {
        setErrorMessage(null);
        setAuthDisplay('not-logged-in');
    }
    const usernameOnChange = (e) => {
        setUsername(e.target.value);
    }
    const passwordOnChange = (e) => {
        setPassword(e.target.value);
    }
    const confirmPasswordOnChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    const updateErrorMessage = async (error) => {
        console.log('updating error message: ', error)
        setErrorMessage(error)
    };

    const registerOnClick = async () => {
        try {
            console.log('running onClick register...');
            //run tests first
            if (username === '') {
                await updateErrorMessage('must enter username');
                throw await respError("USERNAME_MISSING", "must enter username");
            }
            //good place to insert further username requirements
            if (password.length < 8) {
                await updateErrorMessage('password must be at least 8 characters long');
                throw await respError("PASSWORD_SHORT", "password must be at least 8 characters long");
            }
            //good place to insert further password requirements
            if (confirmPassword === '') {
                await updateErrorMessage('must confirm password');
                throw await respError("PW-CONFIRM_MISING", "must confirm password");
            }
            if (password !== confirmPassword) {
                await updateErrorMessage('password and confirm password do not match');
                throw await respError("PW_MISMATCH", "password and confirm password do not match");
            }

            //checking if username already exists
            const usernamesObjects = await fetchUsers();
            console.log("usernamesObjects");
            console.log(usernamesObjects);
            const listUsernames = Object.values(usernamesObjects);
            // console.log('listUsers: ', listUsers);
            if (listUsernames.includes(username)) {
                await updateErrorMessage('username already exist');
                throw await respError("USER_DUPLICATE", "username already exist");
            }
            // console.log('username:', username);
            // console.log('password:', password);


            //this is where we're actually sending register request to server
            const resp = await fetchRegister(username, password);
            // console.log('fetchRegister response: ', resp);
            try {
                if (!!resp.error) {
                    // console.log('resp.error exists')
                    await updateErrorMessage(resp.error);
                    // console.log('after update')
                    throw resp.error;
                } else {
                    //so now we want to store a user object and also save a cookie.
                    const resultUser = { ...resp.user };
                    resultUser.token = resp.token;
                    setUser(resultUser);
                    localStorage.setItem('user', JSON.stringify(resultUser));
                    setAuthDisplay('logged-in');
                }
            }
            catch (error) {
                throw error;
            }

        }
        catch (error) {
            throw error;
        }
    }

    const loginOnClick = async () => {

        try {
            console.log('running login protocol')
            //tests fields first
            if (username === '') {
                await updateErrorMessage('must enter username');
                throw await respError("USERNAME_MISSING", "must enter username");
            }
            //good place to insert further username requirements
            if (password.length < 8) {
                await updateErrorMessage('password must be at least 8 characters long');
                throw await respError("PASSWORD_SHORT", "password must be at least 8 characters long");
            }
            // console.log('username, password: ', username, password)

            //sending login attempt to server
            const resp = await fetchLogin(username, password);
            // console.log('login attempt result: ', resp);
            if (!!resp.error) {
                throw resp.error;
            }
            const resultUser = { ...resp.user };
            resultUser.token = resp.token;
            setUser(resultUser);
            localStorage.setItem('user', JSON.stringify(resultUser));
            setAuthDisplay('logged-in');
        }
        catch (error) {
            throw error;
        }

    }
    const logoutOnClick = () => {

        displayBase();
        setUser(null);
        localStorage.removeItem('user');
        localStorage.clear();
    }


    if (!user) {

        //login form
        if (authDisplay === 'login') {
            return <div className={classes.root}>
                <div className='auth-row'>
                    <div>
                        Username:
                    </div>
                    <input type='text' onChange={usernameOnChange} />
                </div>
                <div className='auth-row'>
                    <div>
                        Password:
                    </div>
                    <input type='password' onChange={passwordOnChange} />
                </div>
                <div className='auth-row'>
                    <Button onClick={loginOnClick} variant="contained">
                        Login
                    </Button>
                    <Button onClick={displayBase} variant="contained">
                        Cancel
                    </Button>
                </div>
                <div className='auth-row'>
                    <div style={{ color: 'red' }}>
                        {errorMessage}
                    </div>
                </div>
            </div>
        }
        if (authDisplay === 'register') {
            //register form
            return <div className={classes.root}>
                <div className='auth-row'>
                    <div>
                        Username:
                    </div>
                    <input type='text' onChange={usernameOnChange} />
                </div>
                <div className='auth-row'>
                    <div>
                        Password:
                    </div>
                    <input type='password' onChange={passwordOnChange} />
                    {/* {displayError(password)} */}
                </div>
                <div className='auth-row'>
                    <div>
                        Confirm Password:
                    </div>
                    <input type='password' onChange={confirmPasswordOnChange} />
                </div>
                <FormError errorMessage={errorMessage} />
                <div className='auth-row'>
                    <Button onClick={registerOnClick} variant="contained">
                        Register
                    </Button>
                    <Button onClick={displayBase} variant="contained">
                        Cancel
                    </Button>
                </div>
            </div>
        }
        //base form, user not logged in
        return <div className={classes.root}>
            <Button onClick={displayRegister} variant="contained">Register</Button>
            <Button onClick={displayLogin} variant="contained">Login</Button>
        </div>
    }
    //User is logged in
    return <div className={classes.root}>
        <div className='auth-row'>
            <div>
                <span className="user">{user.username}</span> is logged in.
        </div>
        </div>
        <div className='auth-row'>
            <Button onClick={logoutOnClick} variant="contained">Logout</Button>
        </div>
    </div>

}

export default Auth;
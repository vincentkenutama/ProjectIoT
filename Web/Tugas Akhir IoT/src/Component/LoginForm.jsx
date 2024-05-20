import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'
import Notify from './Notify'
import '../Styles/loginstyle.css'



export default function LoginForm()
{
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisibility, setPasswordVisibility] = useState(false)
    const [validity, setValidity] = useState(true)

    const navigate = useNavigate()

    // const bacaData = async () => {
    //     let result = await axios.get(`https://api.thingspeak.com/channels/2474055/fields/1.json?api_key=E1H1VFO1ALP4CFP7&results=100`)
    //     let data = result.data.feeds
    //     for(let i = 0; i < data.length; i++)
    //     {
    //         console.log(data[i].field1)
    //     }
    
        
    // }

    useEffect(() => {
        console.log('test')
    }, [validity]) 

    const validUser = {
        validUserUsername : 'vincentkenutama',
        validUserPassword : 'abcd',
        false : 'visible',
        true : 'hidden'

    }

    const validUserMessage = {
        true : '',
        false : 'Username or password is wrong',
    }

    const validUserType = {
        true : 'ok',
        false : 'danger'
    }



    const passwordToggle = {
        false : 'Show',
        true : 'Hide'
    }

    const passwordField = {
        Show : 'password',
        Hide : 'text'
    }

    const handleChange = (data, func) => {
        func(data)
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if(username == validUser['validUserUsername'] && password == validUser['validUserPassword']){
            navigate('/home')
            setValidity(true);
        }
        else{
            setValidity(false);
        }
    }


    return(
        <div className='login-form-background'>

            <Notify message={validUserMessage[validity]} visibility={validUser[validity]} type={validUserType[validity]}/>

            <div className='login-form-container'>
                <span className='login-text'>Login</span>
                <form action="" className='login-form'>
                    <label htmlFor="username-input">Username</label>
                    <input  type="text" 
                            id='username-input'
                            onChange={(e) => {handleChange(e.target.value, setUsername)}}/>

                    <label  htmlFor="password-input">Password</label>
                    <div className='password-container'>
                        <input  type={passwordField[passwordToggle[passwordVisibility]]} 
                                id='password-input'
                                onChange={(e) => {handleChange(e.target.value, setPassword)}}/>

                        <span   className='password-show-toggle'
                                onClick={(e) => handleChange(!passwordVisibility, setPasswordVisibility)}
                                >{passwordToggle[passwordVisibility]}
                                
                        </span>
                    </div>
                    

                    <button className='login-btn' onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    )
};
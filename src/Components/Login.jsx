import React, { useState } from 'react'
import './Signup.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const location = useNavigate()

    const login = async (e) => {
        e.preventDefault()

        const body = {
            email,
            password
        }

        const result = await axios.post('http://localhost:3050/login', body)
        console.log(result);

        localStorage.setItem("name", result.data.name)
        localStorage.setItem("id", result.data.id)
        localStorage.setItem("profile", result.data.profile)


        alert(result.data.message)

        let id =localStorage.getItem("id")
        if ( id==result.data.id) {

            location('/')
        }else{
            alert("please login")
        }

    }

    return (
        <div>
            <div className='row'>
                <div className="col-md-6">

                </div>
                <div className='col-md-6'>
                    <h1 className='mt-5'>Login</h1>

                    <div className="text-center mt-3  rounded col-md-5  p-3">

                        <Form style={{ marginLeft: '-100px' }}>
                            <Form.Group className="mb-3" controlId="forEmail">
                                <Form.Control type="text" placeholder="Enter Email"
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="forPassword">
                                <Form.Control type="text" placeholder="Enter Password"
                                    onChange={(e) => { setPassword(e.target.value) }}
                                />
                            </Form.Group>


                            <Button style={{marginLeft:'-70px'}} onClick={(e) => login(e)} variant="primary" type="submit">
                                Login
                            </Button><br />
                            <a style={{ marginRight: '-100px' }} href="/signup">Dont have Account?Signup Here</a>

                        </Form>

                    </div>

                </div >
            </div >    </div >
    )
}

export default Login

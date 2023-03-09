import React, { useState } from 'react'
import './Signup.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [mobile, setMobile] = useState(0)
    const [profilePictureUrl, setProfile] = useState('')
    const [image, setimage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png')

    const location = useNavigate()

    const key = '2459d4d3f54b054db2fbc122b4c2da39'
    async function handleChange(e) {
        setimage(e.target.files[0])

    }


    const Signup = async (e) => {
        console.log('hello');
        e.preventDefault()

        const formData = new FormData()
        formData.append('image', image)
        console.log(formData);
        const { data } = await axios.post('https://api.imgbb.com/1/upload', formData, { params: { key } })
        console.log(data.data.url);
        let profile=data.data.url

        console.log(profile);
        const body = {
            name,
            email,
            password,
            mobile,
            profilePictureUrl:profile
        }

        const result = await axios.post('http://localhost:3050/signup', body)
        console.log(result);




        location('/login')





    }

    return (
        <div className='row'>
            <div className="col-md-6">

            </div>
            <div className='col-md-6'>
                <h1 className='mt-5'>Signup</h1>

                <div className="text-center mt-3 border rounded col-md-5  p-3">
                    <Form style={{ marginLeft: '-100px' }}>
                        <Form.Group className="mb-3" controlId="forName">
                            <Form.Control type="text" placeholder="Enter Name"
                                onChange={(e) => { setName(e.target.value) }}
                            />

                        </Form.Group>

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
                        <Form.Group className="mb-3" controlId="forMobile">
                            <Form.Control type="text" placeholder="Enter Mobile"
                                onChange={(e) => { setMobile(e.target.value) }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="forprofile">
                            <Form.Control type="file" placeholder="profile"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button style={{ marginLeft: '-59px' }} onClick={(e) => Signup(e)} variant="primary" type="submit">
                            Signup
                        </Button>
                        <br />
                        <a style={{ marginLeft: '59px' }} href="/login"> already have Account?Login</a>

                    </Form>

                </div>

            </div >
        </div >
    )
}

export default Signup

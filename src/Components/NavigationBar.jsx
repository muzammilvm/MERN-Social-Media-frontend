import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './NavigationBar.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';
import Offcanvas from 'react-bootstrap/Offcanvas';

function NavigationBar() {

    const [notification, setNotification] = useState('')
    const [notLength, setNotLength] = useState(0)
    const [search, setSearch] = useState('')
    const [user, setUser] = useState([])
    const [offCanvas, setOffCanvas] = useState(false);
    const [friends, setFriends] = useState([])
    const [chat, setChat] = useState(false)
    const [chatDetails, setChatDetails] = useState({})
    const [messages, setMessages] = useState([])
    const [sendmessage, setSendmessage] = useState('')

    const userId = localStorage.getItem('id')

    const showMessage = async (toId) => {
        let fromId = localStorage.getItem('id')
        setChat(true)


        const chatUser = await axios.get('http://localhost:3050/get-user-details/' + toId)
        setChatDetails(chatUser.data.user);

        let body = {
            fromId,
            toId
        }

        const { data } = await axios.post('http://localhost:3050/get-message', body)
        console.log(data);
        setMessages(data.messages.messages)
    }
    const offClose = () => setOffCanvas(false);
    const chatClose = () => {
        setChat(false);
        setMessages('')
    }

    const offShow = () => {
        fetchFriends()
        setOffCanvas(true);
    }

    const location = useNavigate()

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem('id')
        localStorage.removeItem('name')
        localStorage.removeItem('profile')

        location('/login')
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-notification/' + userId)
        console.log(data.notifications);
        setNotification(data.notifications)

        setShow(true);
        setNotLength(data.notifications.length)

    }

    const home = () => {
        location('/')
    }
    const fetchUser = async () => {
        const { data } = await axios.get('http://localhost:3050/get-all-users')
        console.log(data);
        setUser(data.users)
    }

    const userPage = (id) => {
        location(`/visit-page/${id}`)
        setSearch('')
        window.location.reload()
    }

    const fetchFriends = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-friend-list/' + userId)
        console.log(data);
        setFriends(data.friends)
    }

    const messageSend = async(toId) => {
        console.log(sendmessage);
        let fromId = localStorage.getItem('id')
        
        const body={
            fromId,
            toId,
            message:sendmessage
        }
        const { data } = await axios.post('http://localhost:3050/send-message', body)
        console.log(data);

        showMessage(toId)
    }

    console.log(sendmessage);

    useEffect(() => {
        fetchUser()

    }, [])
    console.log(user);
    return (
        <div>
            <div className='navbar'>
                <div className='left_content'>
                    <h4 className='home' onClick={home}>Social Media</h4>
                    <div className='search'>
                        <input onChange={(e) => setSearch(e.target.value)} className='form-control' type="text" placeholder='search user' /> <i class="fa-solid fa-magnifying-glass glass"></i>
                    </div >
                </div>

                <div className="center_content">
                    <i onClick={offShow} class="fa-solid fa-message btn text-white"></i>
                    <i onClick={handleShow} class="fa-solid fa-bell ms-4 text-white btn"><Badge bg="info">{notLength}</Badge></i>
                </div>

                <div className="right_content">
                    <div className='d-flex pt-1'>
                        <Link to={'/friends'}><h6 className='me-3 text-white btn'>Friends</h6></Link >
                        <h6 className='btn text-white'>My Profile</h6>
                    </div>
                    <div class="dropdown">
                        <button class="btn text-white dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        </button>
                        <div className="dropdown-menu drop-content" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Settings</a>
                            <a onClick={(e) => logout(e)} className="dropdown-item" href="#">Logout</a>
                        </div>
                    </div>
                </div>




                {/* model for notification */}
                <Modal show={show} onHide={handleClose} animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Notifications</Modal.Title>
                    </Modal.Header>
                    {
                        notification && notification.slice().reverse().map((item) => (
                            <Modal.Body>{item}</Modal.Body>
                        ))
                    }
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>

                    </Modal.Footer>
                </Modal>


                {/* off canvas for messages */}
                <>
                    <Offcanvas show={offCanvas} onHide={offClose}>
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Messages</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            {!chat &&
                                <div>
                                    {
                                        friends.map((friend) => (
                                            <div onClick={() => showMessage(friend._id)} className='border p-2 mb-2'>
                                                <div className="d-flex align-items-center">
                                                    <img className='rounded-circle' height={'40px'} width={'40px'} src={friend.profilePictureUrl} alt="" />
                                                    <h6 className='ms-3'>{friend.name}</h6>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {
                                chat &&
                                <div className='border w-100 h-75'>
                                    <div className='userDetails h-15 d-flex p-2 align-items-center border'>
                                        <img className='rounded-circle' height={'50px'} width={'50px'} src={chatDetails.profilePictureUrl} alt="" />
                                        <h6 className='ms-3'>{chatDetails.name}</h6>
                                        <p onClick={chatClose} style={{ marginLeft: 'auto' }} className='mt-2'><i class="fa-solid fa-xmark"></i></p>
                                    </div>
                                    <div className='w-100 h-75 p-3 chatBox'>
                                        {
                                            messages &&
                                            messages.slice().reverse().map((message) => (
                                                <div >
                                                    <p className={message.userId == userId ? 'text-end' : ''}>{message.message}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div style={{ height: '37px' }} className=' border d-flex align-items-center w-100 bottom float-bottom p-1'>

                                        <input onChange={(e) => setSendmessage(e.target.value)} className='w-75' type="text" />
                                        <button type='submit' onClick={() => messageSend(chatDetails._id)} className='btn btn-primary ms-3'>send</button>

                                    </div>

                                </div>
                            }
                        </Offcanvas.Body>
                    </Offcanvas>
                </>


            </div>

            <div className="row">
                <div className="col-md-2"></div>

                <div className="col-md-4 p-1 ms-4 " style={{ width: '380px' }}>
                    {search &&
                        user.filter((item) => {
                            return search.toLowerCase() === ''
                                ? item : item.name.toLowerCase().includes(search)
                        }).map((item) => (

                            <div onClick={() => userPage(item._id)} className='d-flex searchBar mt-2 bg-white'>
                                <img height={'50px'} width={'50px'} src={item.profilePictureUrl} alt="" />
                                <h6 className='ms-2'>{item.name}</h6>
                            </div>

                        ))}
                </div>

                <div className="col-md-4"></div>
            </div>
        </div >
    );
}

export default NavigationBar

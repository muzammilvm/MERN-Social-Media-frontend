import './Friends.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Friends() {
    const [posts, setPosts] = useState([])
    const [comment, setComment] = useState(false)
    const [comments, setcomments] = useState()
    const [name, setName] = useState('')
    const [photo, setPhoto] = useState('')
    const [id, setId] = useState('')
    const [addcomment, setAddComment] = useState('')
    const [friends, setFriends] = useState([])
    const [requests, setRequests] = useState([])

    const location = useNavigate()

    const fetchFriends = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-friend-list/' + userId)
        console.log(data);
        setFriends(data.friends)
    }

    const fetchReqs = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-friend-request/' + userId)
        console.log(data);
        setRequests(data.request)
    }

    const fetchData = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-friends-posts/' + userId)
        // console.log(data);
        setPosts(data.posts)
    }
    async function comme(postId) {
        setComment(!comment)
        console.log(comment);

        const comm = await axios.get(`http://localhost:3050/get-comments/${postId}`)
        setcomments(comm.data.comment);
    }

    function Like(postId, touserId) {
        let likedId = localStorage.getItem('id')
        let fromuserName = localStorage.getItem('name')
        console.log(postId, touserId);
        const body = {
            postId,
            touserId,
            likedId,
            fromuserName
        }
        console.log(likedId);
        axios.post('http://localhost:3050/like-post', body).then(() => {
            fetchData()

        })
    }

    const postComment = (e, postId, touserId) => {
        e.preventDefault()
        let commentedId = localStorage.getItem('id')

        const body = {
            postId,
            commentedId,
            touserId,
            comment: addcomment

        }

        axios.post('http://localhost:3050/comment-post', body).then(() => {
            fetchData()
        })
    }

    const visit = (userId) => {
        location('/visit-page/' + userId)
    }

    const unfriend = async (e, unfriendId) => {
        e.preventDefault()
        let currentId = localStorage.getItem('id')

        const body = {
            currentId,
            unfriendId
        }
        const result = await axios.post('http://localhost:3050/unfriend', body)
        console.log(result);
        fetchFriends()
    }

    const acceptReq = async (e, touserId, touserName) => {
        let fromuserId = localStorage.getItem('id')
        let fromuserName = localStorage.getItem('name')

        e.preventDefault()

        const body = {
            touserId,
            fromuserId,
            fromuserName,
            touserName
        }

        const result = await axios.post('http://localhost:3050/accept-friend-request', body)
        console.log(result);
        fetchFriends()
        fetchReqs()

    }

    const rejectReq = async (e, touserId, touserName) => {
        let fromId = localStorage.getItem('id')
        let fromuserName = localStorage.getItem('name')

        e.preventDefault()

        const body = {
            touserId,
            fromId,
            fromuserName,
            touserName
        }

        const result = await axios.post('http://localhost:3050/reject-req', body)
        console.log(result);
        fetchFriends()
        fetchReqs()

    }

    useEffect(() => {
        fetchData()
        fetchFriends()
        fetchReqs()
    }, [])

    return (
        <div className='container-fluid'>
            <div className="row mt-2">
                <div className="col-md-3 bg-white mb-3">
                    <h3>Friends List</h3>
                    {
                        friends && friends.map((friend) => (

                            <div className='mt-3 d-flex border p-2 mb-2'>
                                <img width={'50px'} height={'50px'} src={friend.profilePictureUrl} alt="" />
                                <h6 className='ms-2'>{friend.name}</h6>
                                <button onClick={() => visit(friend._id)} className='ms-auto btn bg-primary text-white' style={{ height: '30px', fontSize: '13px' }}>Vist</button>
                                <button onClick={(e) => unfriend(e, friend._id)} className='ms-1 btn bg-danger text-white' style={{ height: '30px', fontSize: '13px' }}>Unfriend</button>
                            </div>
                        ))
                    }
                </div>


                <div className="col-md-6 mb-3">
                    {posts.map((post) => (
                        < div className='bg-white border p-2 rounded-2'>
                            <div className='post_owner d-flex p-1'>
                                <img height={'40px'} width={'40px'} className='post_profile rounded-circle ms-2' src="https://i.insider.com/6329a1fe4f9291001883cafe?width=700" alt="" />
                                <h6 className='ms-4'>{post.userName}</h6>
                            </div>
                            <div className='date'>
                                <p>{post.date}</p>
                            </div>
                            <div className="post">
                                <div className='caption'>
                                    <p>{post.caption}</p>
                                </div>
                                <div className="photo rounded-2">
                                    <img className="rounded-2" height={'500px'} width={'500px'} src={post.imageUrl} alt="" />
                                </div>
                                <div className='likes d-flex w-75'>
                                    <p className='ms-2 like_text'>{post.likes.length} likes</p>
                                    <p className='like_text' style={{ marginLeft: 'auto' }}>{post.comments.length} Comments</p>
                                </div>
                                <div className='like_comment d-flex border-top border-bottom w-75'>
                                    <div className="col-md-3"><button onClick={() => Like(post._id, post.userId)} className='btn'><i class="fa-solid fa-thumbs-up me-2"></i>Like</button ></div>
                                    <div className="col-md-3 float-right"><button onClick={() => comme(post._id)} className='btn'><i class="fa-regular fa-message me-2"></i>Comment</button></div>
                                </div>
                                {
                                    comments && post.comments.map((com) => (

                                        comment &&

                                        <div className="comments w-75">
                                            <div className='comment d-flex'>
                                                <div className='comment_profile d-flex'>
                                                    <img height={'30px'} width={'30px'} className='rounded-circle' src="https://media.sot.com.al/sot.com.al/media3/-800-0-63352c8b31330.jpg" alt="" />
                                                </div>
                                                <div className='d-flex align-items-center ms-2 text'>
                                                    <a className='comment_profile_name me-3'>{com.commentedName}</a>
                                                    <a style={{ fontSize: '12px' }}>{com.comment}</a>
                                                </div>
                                            </div>
                                        </div>
                                    ))

                                }
                                <div className="addComment d-flex">
                                    <input className='form-control w-50 mb-2 mt-2' type="text" placeholder='Add comment'
                                        onChange={(e) => setAddComment(e.target.value)}
                                    /> <button onClick={(e) => postComment(e, post._id, post.userId)} style={{ width: '100px', height: '28px', marginTop: '10px', fontSize: '13px' }} type='submit' className=' ms-2 btn btn-primary d-flex align-items-center justify-content-center'><a>Post</a></button>
                                </div>
                            </div>
                            <div />

                        </div>
                    ))}
                </div>

                <div className="col-md-3 bg-white mb-3">
                    <h3>Friend Request</h3>
                    {
                        requests && requests.map((request) => (

                            <div className='mt-3 d-flex border p-2 mb-2'>
                                <img width={'50px'} height={'50px'} src={request.profilePictureUrl} alt="" />
                                <h6 className='ms-2'>{request.name}</h6>
                                <button onClick={(e)=>acceptReq(e,request._id,request.name)} className='ms-auto btn bg-primary text-white' style={{ height: '30px', fontSize: '13px' }}>Accept</button>
                                <button onClick={(e)=>rejectReq(e,request._id,request.name)} className='ms-1 btn bg-danger text-white' style={{ height: '30px', fontSize: '13px' }}>Reject</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Friends

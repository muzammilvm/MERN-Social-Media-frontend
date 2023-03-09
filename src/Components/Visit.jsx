import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './Visit.css'

function Visit() {

    const [friend, setFriend] = useState(false)
    const [req, setReq] = useState(false)
    const [posts, setPosts] = useState([])
    const [comment, setComment] = useState(false)
    const [comments, setcomments] = useState()
    const [name, setName] = useState('')
    const [photo, setPhoto] = useState('')
    const [id, setId] = useState('')
    const [addcomment, setAddComment] = useState('')
    const [user, setuser] = useState('')



    const params = useParams()

    const fetchUser = async () => {

        const { data } =await axios.get('http://localhost:3050/get-user-details/' + params.id)
        console.log(data);
        setuser(data.user)
    }

    const friendStat = async () => {
        let currentId = localStorage.getItem('id')
        const body = {
            currentId,
            checkId: params.id
        }
        const { data } = await axios.post('http://localhost:3050/check-friend', body)
        console.log(data);
        if (data.request) {
            setReq(true)
        } else if (data.friend) {
            setFriend(true)
        }

        if (data.friend == false) {
            setFriend(false)
        }
    }
    const fetchData = async () => {
        let userId = localStorage.getItem('id')
        const { data } = await axios.get('http://localhost:3050/get-user-posts/' + params.id)
        console.log(data);
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
    useEffect(() => {
        friendStat()
        fetchData()
        fetchUser()
        // console.log(friend);
    }, [])


    return (
        <div>
            <div className='row d-flex'>
                <div className="col-md-2">
                </div>
                <div className="my_profile border col-md-8 p-3">
                    <div className='d-flex p-'>
                        <img className='rounded-circle' height={'150px'} width={"150px"} src={user.profilePictureUrl} alt="profile picture" />
                        <div className='ms-3'>
                            <h5 className='mt-5'>{user.name} </h5>
                            <div className=' mt-4'>
                                {
                                    !req &&
                                    <div className='d-flex'>
                                        <p className='friend mt-3'>{friend ? 'Firend' : ''}</p>
                                        <button style={{ height: '30px', fontSize: '12px' }} className={friend ? 'btn btn-danger ms-3 mt-3' : 'btn btn-primary ms-3 mt-3'}>{friend ? 'Unfriend' : 'Add friend'}</button>
                                    </div>
                                }
                                {
                                    req &&
                                    <div>
                                        <button className='btn btn-primary'>Accept Request</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">

                </div>
            </div>


            <div className="row mt-3 mb-3">
                <div className="col-md-2"></div>

                <div className="col-md-7">
                    {
                        posts.map((post) => (
                            < div className='bg-white border p-2 rounded-2'>
                                <div className='post_owner d-flex p-1'>
                                    <img height={'40px'} width={'40px'} className='post_profile rounded-circle ms-2' src={user.profilePictureUrl} alt="" />
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
                                    <div className='likes d-flex' style={{ width: '64%' }}>
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
                    {
                        posts == 0 &&
                        <div>
                            <img height={'400px'} width={'500px'} src="https://img.republicworld.com/republic-prod/stories/promolarge/xhdpi/1kutzil5lj0nvfsf_1596544016.jpeg" alt="" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}


export default Visit

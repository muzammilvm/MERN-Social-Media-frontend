import './Home.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Home() {
    const [posts, setPosts] = useState([])
    const [comment, setComment] = useState(false)
    const [comments, setcomments] = useState()
    const [name, setName] = useState('')
    const [photo, setPhoto] = useState('')
    const [id, setId] = useState('')
    const [addcomment, setAddComment] = useState('')
    const [caption, setCaption] = useState('')
    const [addImage, setAddImage] = useState('')

    const location = useNavigate()

    async function comme(postId) {
        setComment(!comment)
        console.log(comment);

        const comm = await axios.get(`http://localhost:3050/get-comments/${postId}`)
        setcomments(comm.data.comment);
    }

    const fetchData = async () => {
        const { data } = await axios.get('http://localhost:3050/get-all-posts')
        console.log(data);
        setPosts(data.posts)
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

    console.log(addcomment);
    console.log(addImage);
    async function handleChange(e) {
        setAddImage(e.target.files[0])

    }
    const key = '2459d4d3f54b054db2fbc122b4c2da39'

    const addPost = async (e) => {
        console.log('hello');
        // e.preventDefault()
        let userId = localStorage.getItem('id')


        const formData = new FormData()
        formData.append('image', addImage)
        console.log(formData);
        const { data } = await axios.post('https://api.imgbb.com/1/upload', formData, { params: { key } })
        console.log(data.data.url);
        let image = data.data.url

        const body = {
            userId,
            imageUrl: image,
            caption
        }

        const result = await axios.post('http://localhost:3050/add-post', body)
        console.log(result);
        window.location.reload()

    }

    const userPage=(id)=>{
        location(`/visit-page/${id}`)
    }

    useEffect(() => {

        fetchData()
        posts.reverse()
        setName(localStorage.getItem('name'))
        setPhoto(localStorage.getItem('profile'))
        setId(localStorage.getItem('id'))


    }, [])

    return (
        <div>
            <div className='row d-flex'>
                <div className="col-md-2">
                </div>
                <div className="my_profile border col-md-8 p-3">
                    <div className='d-flex p-'>
                        <img height={'100px'} width={"100px"} src={photo} alt="profile picture" />
                        <div className='ms-3'>
                            <h5 className=''>Hello {name}</h5>
                            <p> welcome to social media website. <br /> you can share your thoughts and <br /> photos Here</p>
                        </div >
                    </div>

                    <div className="col-md-8 d-flex">
                        <input onChange={(e) => setCaption(e.target.value)} className='form-control' type="text" />
                        <input onChange={handleChange} type="file" />
                        <button type='submit' onClick={(e) => addPost(e)} className='btn btn-primary w-50'>Add post</button>
                    </div>
                    <div className='mt-2'>

                    </div>

                </div>
                <div className="col-md-2">

                </div>
            </div>

            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-7">

                </div>
            </div>



            <div className="row">
                <div className="col-md-2"></div>

                <div className="col-md-8 p-2 mt-5">
                    {

                        posts.slice().reverse().map((post) => (
                            < div className='bg-white border p-2 rounded-2'>
                                <div className='post_owner d-flex p-1'>
                                    <img height={'40px'} width={'40px'} className='post_profile rounded-circle ms-2' src={post.profileUrl} alt="" />
                                    <h6 onClick={()=>userPage(post.userId)} className='ms-4 postName'>{post.userName}</h6>
                                </div>
                                <div className='date'>
                                    <p>{post.date}</p>
                                </div>
                                <div className="post">
                                    <div className='caption'>
                                        <p>{post.caption}</p>
                                    </div>
                                    <div className="photo rounded-2">
                                        <img className="rounded-2" height={'500px'} width={'600px'} src={post.imageUrl} alt="" />
                                    </div>
                                    <div className='likes d-flex'>
                                        <p className='ms-2 like_text'>{post.likes.length} likes</p>
                                        <p className='like_text' style={{ marginLeft: 'auto' }}>{post.comments.length} Comments</p>
                                    </div>
                                    <div className='like_comment d-flex border-top border-bottom'>
                                        <div className="col-md-3"><button onClick={() => Like(post._id, post.userId)} className='btn'><i class="fa-solid fa-thumbs-up me-2"></i>Like</button ></div>
                                        <div className="col-md-3 float-right"><button onClick={() => comme(post._id)} className='btn'><i class="fa-regular fa-message me-2"></i>Comment</button></div>
                                    </div>
                                    {
                                        comments && post.comments.map((com) => (

                                            comment &&

                                            <div className="comments">
                                                <div className='comment d-flex'>
                                                    <div className='comment_profile d-flex'>
                                                        <img height={'30px'} width={'30px'} className='rounded-circle' src={com.commetedProfileUrl} alt="" />
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

                <div className="col-md-2"></div>
            </div >
        </div >
    )
}

export default Home

import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from '../../images/loading.gif'
import PostCard from '../../components/PostCard'


const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    const {  detailPost } = useSelector(state => state);
    const dispatch = useDispatch();
 
    useEffect(() => {
        
        dispatch(getPost({ detailPost, id  }));

    }, [detailPost, dispatch, id ]);

    useEffect(() => {
        if (detailPost.length > 0) {
            const newArr = detailPost.filter(p => p._id === id);
            if (newArr.length > 0) setPost(newArr[0]); // 🔹 Solo guarda el post si existe
        }
    }, [detailPost, id]);

    return (
        <div className="posts">
            { !post ? 
                <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                :
                <PostCard key={post._id} post={post} />
            }
        </div>
    );
};

export default Post

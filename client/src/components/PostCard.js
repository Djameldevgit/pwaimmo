import React from 'react'
import CardHeader from './home/post_card/CardHeader'
import CardBodyCarousel from './home/post_card/CardBodyCarousel'


import Comments from './home/Comments'
import InputComment from './home/InputComment'
import CardBodyTitle from './home/post_card/CardBodyTitle'

import { useLocation } from "react-router-dom";
import DescriptionPost from './home/post_card/DescriptionPost'
import InformationUserPost from './home/post_card/InformationUserPost'
import { useSelector } from 'react-redux';
import Map from './home/post_card/Map'

const PostCard = ({ post, theme }) => {
    const location = useLocation();
    const isPostDetailPage = location.pathname === `/post/${post._id}`;
    const { auth } = useSelector(state => state); // 🔹 Obtiene la autenticación desde Redux

    const isAuthenticated = auth.token ? true : false; // 🔹 Verifica si el usuario está autenticado

    return (
        <div className="card my-3">



            <CardHeader post={post} />
            <CardBodyTitle post={post} />
            <CardBodyCarousel post={post} theme={theme} />


            {isPostDetailPage && <DescriptionPost post={post} />}


            {isAuthenticated && isPostDetailPage && (
                <>

                    <Map post={post} />
                    <InformationUserPost post={post} />

                    {isPostDetailPage && <Comments post={post} />}
                    {isPostDetailPage && <InputComment post={post} />}
                </>
            )}

        </div>
    );
};

export default PostCard;


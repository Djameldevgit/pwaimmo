import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import Carousel from '../../Carousel';
import AuthModalAddLikesCommentsSave from '../../AuthModalAddLikesCommentsSave'; 
import CardFooterPost from './CardFooterPost';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config'

const CardBodyCarousel = ({ post }) => {
    const history = useHistory();
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();
    const [saved, setSaved] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isShare, setIsShare] = useState(false);

    // Likes
    useEffect(() => {
        if (post.likes.find(like => like._id === auth.user?._id)) {
            setIsLike(true);
        } else {
            setIsLike(false);
        }
    }, [post.likes, auth.user?._id]);

    const handleCommentClick = () => {
        if (!auth.token) {
            setShowAuthModal(true);
        } else {
            history.push(`/post/${post._id}`);
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (loadLike) return;
        setLoadLike(true);
        await dispatch(likePost({ post, auth, socket }));
        setLoadLike(false);
    };

    const handleUnLike = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (loadLike) return;
        setLoadLike(true);
        await dispatch(unLikePost({ post, auth, socket }));
        setLoadLike(false);
    };

    // Saved
    useEffect(() => {
        if (auth.user?.saved.find(id => id === post._id)) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [auth.user?.saved, post._id]);

    const handleSavePost = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (saveLoad) return;
        setSaveLoad(true);
        await dispatch(savePost({ post, auth }));
        setSaveLoad(false);
    };

    const handleUnSavePost = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (saveLoad) return;
        setSaveLoad(true);
        await dispatch(unSavePost({ post, auth }));
        setSaveLoad(false);
    };

    const redirectToLogin = () => {
        history.push('/login');
        setShowAuthModal(false);
    };

    const redirectToRegister = () => {
        history.push('/register');
        setShowAuthModal(false);
    };

    const closeModal = () => setShowAuthModal(false);

    return (
        <>
            <div className="card">
                <div className="card__image" onClick={() => history.push(`/post/${post._id}`)}>
                    <Carousel images={post.images} id={post._id} />
                </div>

                <div className="card__actions">
                    <div className="card__actions-left">
                        <LikeButton
                            isLike={isLike}
                            handleLike={handleLike}
                            handleUnLike={handleUnLike}
                        />
                        <span className="card__action-count">{post.likes.length}</span>

                        <i className="far fa-comment card__action-icon" onClick={handleCommentClick} />
                        <span className="card__action-count">{post.comments.length}</span>

                        <i className="fas fa-share card__action-icon" onClick={() => setIsShare(!isShare)} />
                    </div>

                    <div className="card__actions-right">
                        {saved
                            ? <i className="fas fa-bookmark card__action-icon" onClick={handleUnSavePost} />
                            : <i className="far fa-bookmark card__action-icon" onClick={handleSavePost} />
                        }
                        <span className="card__action-count">{post.saves || 0}</span>
                    </div>
                </div>

                {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`}  />}

                <CardFooterPost post={post} />
            </div>

            <AuthModalAddLikesCommentsSave
                showModal={showAuthModal}
                closeModal={closeModal}
                redirectToLogin={redirectToLogin}
                redirectToRegister={redirectToRegister}
            />
        </>
    );
};

export default CardBodyCarousel;
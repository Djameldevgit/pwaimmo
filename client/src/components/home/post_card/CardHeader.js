import React, { useState } from 'react';
import Avatar from '../../Avatar';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { deletePost } from '../../../redux/actions/postAction';
import { aprovarPostPendiente } from '../../../redux/actions/postAproveAction';
import Cardheadermodalreportpost from './Cardheadermodalreportpost';
 
const CardHeader = ({ post }) => {
    const { auth, socket } = useSelector(state => state);
    const [showReportModal, setShowReportModal] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    // Función para iniciar un chat con el dueño del post
    const handleChatWithOwner = () => {
      

            // Redirige a la página de chat con el dueño del post
            history.push('/messages');
    }
      
    const handleAprove = () => {
        if (window.confirm("¿Vous voulez aprouve ce post?")) {
            dispatch(aprovarPostPendiente(post, 'aprovado', auth));
            history.push("/administration/homepostspendientes");
        }
    };

    const handleEditPost = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: { ...post, onEdit: true } });
    };

    const handleDeletePost = () => {
        if (window.confirm("Are you sure want to delete this post?")) {
            dispatch(deletePost({ post, auth, socket }));
            history.push("/");
        }
    };

    const handleReportPost = async (reportData) => {
        try {
            console.log("Reporte enviado:", reportData);
            alert("Post reportado correctamente.");
        } catch (error) {
            console.error("Error al reportar el post:", error);
            alert("Error al reportar el post.");
        }
    };

    return (
        <div className="cardheaderpost">
            {auth.user?.role === "superuser" && (
                <div className="d-flex">
                    <Avatar src={post.user.avatar} size="big-avatar" />
                    <div className="card_name">
                        <h6 className="m-0">
                            <Link to={`/profile/${post.user._id}`} className="text-dark">
                                {post.user.username}
                            </Link>
                        </h6>
                        <small className="text-muted">{moment(post.createdAt).fromNow()}</small>
                    </div>
                </div>
            )}

            {auth.user && (
                <div className="nav-item dropdown">
                    <span className="material-icons dropdown-toggle" data-toggle="dropdown">
                        more_horiz
                    </span>

                    <div className="dropdown-menu">
                        {auth.user.role === "admin" && (
                            <>
                                <DropdownItem icon="check_circle" text="Approuver le post" onClick={handleAprove} />
                                <DropdownItem icon="create" text="Modifier le post" onClick={handleEditPost} />
                                <DropdownItem icon="delete_outline" text="Supprimer le post" onClick={handleDeletePost} />
                            </>
                        )}

                        {auth.user._id === post.user._id && (
                            <>
                                <DropdownItem icon="create" text="Modifier le post" onClick={handleEditPost} />
                                <DropdownItem icon="delete_outline" text="Supprimer le post" onClick={handleDeletePost} />
                            </>
                        )}

                        {/* Botón para chatear con el dueño del post */}
                        <DropdownItem
                            icon="chat"
                            text="Chat"
                            onClick={handleChatWithOwner}
                        />

                        {/* Botón para chatear con un administrador (opcional) */}
                        {/* <DropdownItem
                            icon="chat"
                            text="Chat with Admin"
                            onClick={handleChatWithAdmin}
                        /> */}

                        <DropdownItem icon="person_add" text="Suivre l'auteur" />
                        <DropdownItem icon="report" text="Signaler le post" onClick={() => setShowReportModal(true)} />
                        <DropdownItem icon="bookmark" text="Sauvegarder le post" />
                    </div>
                </div>
            )}

            {showReportModal && (
                <div className="modal-overlay">
                    <Cardheadermodalreportpost
                        post={post}
                        auth={auth}
                        onClose={() => setShowReportModal(false)}
                        onReport={handleReportPost}
                    />
                </div>
            )}
        </div>
    );
};

const DropdownItem = ({ icon, text, onClick }) => (
    <div className="dropdown-item" onClick={onClick}>
        <span className="material-icons">{icon}</span>
        <span>{text}</span>
    </div>
);

export default CardHeader;
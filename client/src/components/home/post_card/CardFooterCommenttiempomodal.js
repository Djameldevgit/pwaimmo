import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import 'moment/locale/fr'; // Importa el idioma francés

const CardFooterCommenttiempomodal = ({ post }) => {
    const history = useHistory();
    const location = useLocation();
    const isDetailPage = location.pathname === `/post/${post._id}`;
    const { t } = useTranslation();
    moment.locale('fr'); // Establece el idioma a francés

    const { auth, languageReducer } = useSelector((state) => state); // Obtiene auth y languageReducer del estado global
    const [showModal, setShowModal] = useState(false);

    const handleCommentClick = () => {
        if (!auth.token) {
            setShowModal(true);
        } else {
            history.push(`/post/${post._id}`);
        }
    };

    if (isDetailPage) return null;

    return (
        <>
            <div className="cardfootercomment">
                <div className="footercommentcontent">
                    
                    <div className="carddate">
                        <span className="mr-1"><i className='far fa-clock'></i>  </span>
                    
                    <small className="text-dat">
                        {moment(post.createdAt).fromNow()}
                    </small>
                </div>

                    
                    <h6 className="mt-0" style={{ cursor: "pointer" }} onClick={handleCommentClick}>
                  <span><i className='far fa-comment-alt'></i></span>    <span>commenter</span>  
                    </h6>
                </div>

                
            </div>

            {/* Modal de autenticación */}
            {showModal && (
                <div className="modalcontentcomment">
                    <div className="modalcontent">
                        <h4>{t("title", { lng: languageReducer.language })}</h4>
                        <p>{t("message", { lng: languageReducer.language })}</p>
                        <div className="modal-buttons">
                            <button onClick={() => history.push("/login")}>
                                {t("login", { lng: languageReducer.language })}
                            </button>
                            <button onClick={() => history.push("/register")}>
                                {t("register", { lng: languageReducer.language })}
                            </button>
                            <button onClick={() => setShowModal(false)}>
                                {t("close", { lng: languageReducer.language })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CardFooterCommenttiempomodal;
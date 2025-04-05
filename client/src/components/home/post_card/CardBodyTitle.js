import React from "react";
import { useLocation } from "react-router-dom";

const CardBodyTitle = ({ post }) => {
    const location = useLocation();
    const isDetailPage = location.pathname === `/post/${post._id}`;

    return (
        <div className="cardtitle">
            <div className="card-header">
                {!isDetailPage && (
                    <div>
                        <div className="title-post">
                            <div className="title0">{post.subCategory}</div>
                            <div className="title2">{post.title}</div>

                            {(post.title === "Appartement" || post.title === "Villa" || post.title === "Niveau de villa" || post.title === "Local") && (
                                <div className="title3"> F{post.attributes.piece}</div>
                            )}
                            {(post.title === "Terrain" || post.title === "Terrain Agricole" || post.title === "Usine") && (
                                <div className="title3">   {post.attributes.superficie} M²</div>
                            )}

                            {(post.subCategory === "Location_Vacances") && (
                                <div className="title3">     </div>
                            )}
                        </div>

                        <div className="titlelocation">
                            {(post.title === "Immeuble") && (
                                <div className="title3">{post.attributes.numerodeapartamientos} Appartements,   {post.attributes.superficie} M²</div>
                            )}
                        </div>
                    </div>
                )}


            </div>

            {!isDetailPage && (

                <div className="titlelocation">
 

                    <span> <i className="fas fa-map-marker-alt" ></i></span>
                    <div className="title4">{post.wilaya}</div>
                    <div className="title4">{post.commune},</div>
                    <div ><span className="ml-1 mr-1 text-danger">{post.price}</span> <span>{post.unidaddeprecio}</span> <span> </span></div>
                </div>
            )}

        </div>
    );
};

export default CardBodyTitle;





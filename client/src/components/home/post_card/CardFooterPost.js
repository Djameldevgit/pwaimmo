import React from 'react';
import moment from 'moment';
import 'moment/locale/fr'; // Importa el idioma francés
const CardFooterPost = ({ post }) => {
    moment.locale('fr'); // Establece el idioma a francés
    return (
        <div className="cardfooterpost">
            <small className="textmuted">
            <span className="mr-1"><i className='far fa-clock'></i>  </span>
                {moment(post.createdAt).fromNow()}  
            </small>
            
        </div>
    );
};

export default CardFooterPost;
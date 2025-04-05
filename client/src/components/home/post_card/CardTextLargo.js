import React, { useState } from 'react'
 

const CardTextLargo = ({post }) => {
    const [readMore, setReadMore] = useState(false)

    
    return (
        <div className="card_body">
            <div className="card_body-content"  >
                <span>
                    {
                        post.description.length < 60 
                        ? post.description 
                        : readMore ? post.description + ' ' : post.description.slice(0, 60) + '.....'
                    }
                </span>
                {
                    post.description.length > 60 &&
                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                        {readMore ? 'Hide content' : 'Read more'}
                    </span>
                }

            </div>
            
        </div>
    )
}

export default CardTextLargo

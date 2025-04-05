import React from 'react'
 

const UserCardCHAT = ({  user, border }) => {

   
  


    return (
        <div className={`d-flex p-2 align-items-center justify-content-between w-100 ${border}`}>
            <div>
                <div   className="d-flex align-items-center">
                    
                 

                    <div className="ml-1" style={{transform: 'translateY(-2px)'}}>
                        <span className="d-block">{user.username}</span>
                        
                       
                    </div>
                </div>
            </div>
      
        </div>
    )
}

export default UserCardCHAT

import { useSelector, useDispatch } from 'react-redux';
import UserCard from '../UserCard';
import {Rien, Telefono ,Camara,Telefonocamara, Images, Efecto1,Efecto2 } from '../../redux/actions/harramientasAction';
  
import { useState,useEffect } from 'react';

 

const Harramientas = () => {
  const { homeUsers, auth } = useSelector(state => state);
  const dispatch = useDispatch();
  const [selectedRoles, setSelectedRoles] = useState({});
  useEffect(() => {
    if (homeUsers?.users) {
      setUsersList(homeUsers.users);
    }
  }, [homeUsers]);
  // Estado para almacenar los roles seleccionados
 

  const handleChangeRole = async (user, selectedRole) => {
    switch (selectedRole) {
      case 'rien':
        await dispatch(Rien(user, auth));
        break;
      case 'telefono':
        await dispatch(Telefono(user, auth));
        break;
      case 'camara':
        await dispatch(Camara(user, auth));
        break;
      case 'telefonocamara':
        await dispatch(Telefonocamara(user, auth));
        break;
      case 'images':
        await dispatch(Images(user, auth));
        break;
        case 'efecto1':
          await dispatch(Efecto1(user, auth));
          break;
          case 'efecto2':
            await dispatch(Efecto2(user, auth));
            break;
      default:
        break;
    }
  };

  // Cambio de rol inmediato
  const [usersList, setUsersList] = useState(homeUsers?.users || []);


  const handleRoleChange = async (user, selectedRole) => {
    setSelectedRoles(prev => ({ ...prev, [user._id]: selectedRole }));
    await handleChangeRole(user, selectedRole);
  
    // Actualiza la lista local de usuarios con el nuevo rol
    setUsersList(prevUsers =>
      prevUsers.map(u => (u._id === user._id ? { ...u, harramienta: selectedRole } : u))
    );
  };
  
  return (
    <div className="modalcontentrole">
      <div className="modalheaderrole">
        <h5 className="modaltitlerole">Ajoute une outile</h5>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Utilizatuer</th>
              <th>util actuelle</th>
              <th>Assigne utile</th>
            </tr>
          </thead>
          <tbody>
  {usersList.map((user, index) => (
    <tr key={user._id || index}>
      <td>
        <UserCard user={user} />
      </td>
      <td>{user.harramienta}</td>
      <td>
        <select
          className="form-control-role"
          onChange={(e) => handleRoleChange(user, e.target.value)}
          value={selectedRoles[user._id] || user.harramienta}
        >
          <option value="rien">Aucun effect default Rien </option>
          <option value="telefono">Téléphone</option>
          <option value="telefonocamara">Téléphone camera</option>
          <option value="images">images</option>
          <option value="efecto1">Effect1</option>
          <option value="efecto2">Effect2</option>
        </select>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default Harramientas


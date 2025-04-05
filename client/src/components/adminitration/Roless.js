import { useSelector, useDispatch } from 'react-redux';
import UserCard from '../UserCard';
import { roleuserautenticado, rolemoderador,rolestory, rolesuperuser, roleadmin } from '../../redux/actions/roleAction';
import { useState,useEffect } from 'react';

const Roless = () => {
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
      case 'user':
        await dispatch(roleuserautenticado(user, auth));
        break;
      case 'Super-utilisateur':
        await dispatch(rolesuperuser(user, auth));
        break;
      case 'Moderateur':
        await dispatch(rolemoderador(user, auth));
        break;
      case 'admin':
        await dispatch(roleadmin(user, auth));
        break;
        case 'story':
          await dispatch(rolestory(user, auth));
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
      prevUsers.map(u => (u._id === user._id ? { ...u, role: selectedRole } : u))
    );
  };
  
  return (
    <div className="modalcontentrole">
      <div className="modalheaderrole">
        <h5 className="modaltitlerole">Asignar roles</h5>
      </div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol Actual</th>
              <th>Cambiar Rol</th>
            </tr>
          </thead>
          <tbody>
  {usersList.map((user, index) => (
    <tr key={user._id || index}>
      <td>
        <UserCard user={user} />
      </td>
      <td>{user.role}</td>
      <td>
        <select
          className="form-control-role"
          onChange={(e) => handleRoleChange(user, e.target.value)}
          value={selectedRoles[user._id] || user.role}
        >
          <option value="user">Utilisateur </option>
          <option value="Super-utilisateur">Super utilisateur</option>
          <option value="Moderateur">Moderateur</option>
          <option value="admin">Admin</option>
          <option value="story">Story</option>
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

export default Roless;



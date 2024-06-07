import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import Swal from 'sweetalert2';

export default function Clients() {
  const [clients, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUsers();
  }, [])

  const onDeleteClick = user => {
    Swal.fire({
      title: 'Tem certeza de que deseja excluir este Cliente?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, exclua!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient.delete(`/clients/${user.id}`)
          .then(() => {
            Swal.fire(
              'Excluído!',
              'Cliente foi excluído com sucesso.',
              'success'
            );
            getUsers();
          })
          .catch(error => {
            console.error('Erro ao excluir Cliente:', error);
            Swal.fire(
              'Erro!',
              'Ocorreu um erro ao excluir o Cliente.',
              'error'
            );
          });
      }
    })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/clients')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data || [])
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between"}}>
        <h4>Clientes</h4>
        <Link className="btn btn-success" to="/clients/new">Adicionar novo</Link>
      </div>
      <div className="card animated fadeInDown mt-2">
        <table>
          <thead>
            <tr>
              <th className="col-1">ID</th>
              <th className="col-4">Razão social</th>
              <th className="col-4">E-mail</th>
              <th className="col-2">CNPJ</th>
              <th className="col-1">Ações</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Carregando...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {clients.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.razao_social}</td>
                <td>{u.email}</td>
                <td>{u.cnpj}</td>
                <td>
                  <Link className="btn btn-primary" to={'/clients/' + u.id}>Editar</Link>
                  &nbsp;
                  <button className="btn btn-danger" onClick={ev => onDeleteClick(u)}>Excluir</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}

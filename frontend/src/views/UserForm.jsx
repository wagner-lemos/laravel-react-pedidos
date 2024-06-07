import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({data}) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('Usuário foi atualizado com sucesso')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/users', user)
        .then(() => {
          setNotification('Usuário foi criado com sucesso')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {user.id && <h4>Atualizar usuário: {user.name}</h4>}
      {!user.id && <h4>Novo usuário</h4>}
      <div className="card animated fadeInDown mt-2">
        {loading && (
          <div className="text-center">
            Carregando...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>

            <div className="row">
              <div className="col-12">
                <label className="form-label">Nome</label>
                <input type="text" className="form-control" value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label">E-mail</label>
                <input type="text" className="form-control" value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} />
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <label className="form-label">Senha</label>
                <input type="password" className="form-control" onChange={ev => setUser({...user, password: ev.target.value})} />
              </div>
              <div className="col-6">
                <label className="form-label">Confirme a Senha</label>
                <input type="password" className="form-control" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-2 ms-auto">
                <button type="submit" className="btn btn-primary w-100">Salvar</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

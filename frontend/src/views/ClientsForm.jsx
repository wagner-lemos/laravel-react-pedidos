import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function ClientsForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [cliente, setUser] = useState({
    id: null,
    razao_social: '',
    email: '',
    cnpj: ''
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/clients/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = ev => {
    ev.preventDefault();
    if (cliente.id) {
      axiosClient.put(`/clients/${cliente.id}`, cliente)
        .then(() => {
          setNotification('Cliente foi atualizado com sucesso');
          navigate('/clients');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/clients', cliente)
        .then(() => {
          setNotification('Cliente foi criado com sucesso');
          navigate('/clients');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const consultarCnpj = () => {
    const cnpj = cliente.cnpj.replace(/\D/g, ''); // Remove non-numeric characters
    setLoading(true);
    axiosClient.get(`https://publica.cnpj.ws/cnpj/${cnpj}`)
      .then(({ data }) => {
        setLoading(false);
        setUser({
          ...cliente,
          razao_social: data.razao_social,
          email: data.estabelecimento.email
        });
      })
      .catch(err => {
        setLoading(false);
        setErrors({ cnpj: ["Erro ao consultar CNPJ"] });
      });
  };

  return (
    <>
      {cliente.id ? <h4>Atualizar Cliente: {cliente.razao_social}</h4> : <h4>Novo Cliente</h4>}
      <div className="card animated fadeInDown mt-2">
        {loading && (
          <div className="text-center">
            Carregando...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <div className="row">
              <div className="col-10">
                <label className="mb-2">CNPJ</label>
                <input type="text" className="form-control" value={cliente.cnpj} onChange={ev => setUser({ ...cliente, cnpj: ev.target.value })} />
              </div>
              <div className="col-2">
                <label className="mb-2">&nbsp;</label>
                <button type="button" onClick={consultarCnpj} className="btn btn-primary w-100">Consultar</button>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label className="mb-2">Razão Social</label>
                <input type="text" className="form-control" value={cliente.razao_social} onChange={ev => setUser({ ...cliente, razao_social: ev.target.value })} />
              </div>
              <div className="col-md-12">
                <label className="mb-2">E-mail</label>
                <input type="email" className="form-control" value={cliente.email} onChange={ev => setUser({ ...cliente, email: ev.target.value })} />
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
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function RequestsForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [pedido, setPedido] = useState({
    id: null,
    client_id: '',
    produtos: []
  });

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/requests/${id}`)
        .then(({ data }) => {
          setPedido({
            id: data.id,
            client_id: data.client_id,
            produtos: data.product // Ajuste aqui para 'product'
          });
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }

    // Fetching clients
    axiosClient.get('/clients')
      .then(({ data }) => {
        setClientes(data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch clients:", err);
      });

    // Fetching products
    axiosClient.get('/products')
      .then(({ data }) => {
        setProdutos(data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, [id]);

  const onSubmit = ev => {
    ev.preventDefault();
    if (pedido.id) {
      axiosClient.put(`/requests/${pedido.id}`, pedido)
        .then(() => {
          setNotification('Pedido foi atualizado com sucesso');
          navigate('/requests');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/requests', pedido)
        .then(() => {
          setNotification('Pedido foi criado com sucesso');
          navigate('/requests');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  const handleAddProduto = () => {
    setPedido({
      ...pedido,
      produtos: [...pedido.produtos, { product_id: '', pivot: { qtd: '' } }]
    });
  };

  const handleRemoveProduto = (index) => {
    const newProdutos = pedido.produtos.filter((_, i) => i !== index);
    setPedido({ ...pedido, produtos: newProdutos });
  };

  const handleProdutoChange = (index, key, value) => {
    const newProdutos = pedido.produtos.map((produto, i) => {
      if (i === index) {
        return { ...produto, [key]: value };
      }
      return produto;
    });
    setPedido({ ...pedido, produtos: newProdutos });
  };

  return (
    <>
      {pedido.id ? <h4>Atualizar pedido: {pedido.client_id}</h4> : <h4>Novo Pedido</h4>}
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
            <div className="row mb-4">
              <div className="col-md-12">
                <label className="mb-2">Cliente</label>
                <select className="form-select" value={pedido.client_id} onChange={ev => setPedido({ ...pedido, client_id: ev.target.value })} >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.razao_social}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-12">
                <table>
                  <thead>
                    <tr>
                      <th className="col-9">Produto</th>
                      <th className="col-2">Quantidade</th>
                      <th className="col-1">Opções</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedido.produtos.map((produto, index) => (
                      <tr key={index}>
                        <td>
                          <select className="form-select" value={produto.id} onChange={ev => handleProdutoChange(index, 'id', ev.target.value)}>
                            <option value="">Selecione um produto</option>
                            {produtos.map(prod => (
                              <option key={prod.id} value={prod.id}>{prod.descricao}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-0">
                          <input type="text" className="form-control" value={produto.pivot.qtd} onChange={ev => handleProdutoChange(index, 'qtd', ev.target.value)} placeholder="Quantidade" style={{ marginTop: "15px" }} />
                        </td>
                        <td>
                          <button type="button" className="btn btn-danger" onClick={() => handleRemoveProduto(index)}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-2 ms-auto">
                <button type="button" className="btn btn-success w-100" onClick={handleAddProduto}>Adicionar produto</button>
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

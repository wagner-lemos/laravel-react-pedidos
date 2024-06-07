import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function ProductsForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [produto, setProduto] = useState({
    id: null,
    descricao: "",
    valor: "",
    estoque: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    if (id) {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProduto(data);
          setPreviewImages(data.images.map(img => `${apiUrl}/storage/${img.image_path}`));
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const onImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
    setProduto({ ...produto, imagens: files });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    formData.append("descricao", produto.descricao);
    formData.append("valor", produto.valor);
    formData.append("estoque", produto.estoque);

    //Adicionar cada imagem ao FormData
    (produto.imagens || []).forEach((imagem) => {
      formData.append("imagens[]", imagem);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (produto.id) {
      
      axiosClient
        .post(`/products/${produto.id}`, formData, config)
        .then((response) => { 
          setNotification("Produto foi atualizado com sucesso");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
        
    } else {
      axiosClient
        .post("/products", formData, config)
        .then((response) => {
          setNotification("Produto foi criado com sucesso");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
    
  };

  return (
    <>
      {produto.id && <h4>Atualizar Produto: {produto.descricao}</h4>}
      {!produto.id && <h4>Novo Produto</h4>}
      <div className="card animated fadeInDown mt-2">
        {loading && (
          <div className="text-center">
            Carregando...
          </div>
        )}
        
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
          <form onSubmit={onSubmit}>

            <div className="row">
              <div className="col-12">
                <label className="form-label">Descrição</label>
                <input className="form-control" value={produto.descricao} onChange={(ev) => setProduto({ ...produto, descricao: ev.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Valor</label>
                <input className="form-control" value={produto.valor} onChange={(ev) => setProduto({ ...produto, valor: ev.target.value })} />
              </div>
              <div className="col-6">
                <label className="form-label">Estoque</label>
                <input className="form-control" value={produto.estoque} onChange={(ev) => setProduto({ ...produto, estoque: ev.target.value })} />
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <label className="form-label">Adicione imagem do produto</label>
                <input type="file" className="form-control" id="formFileMultiple" multiple onChange={onImageChange} accept="image/*" />
              </div>
            </div>
            
            <div className="row">
              <div className="col-12">
                <div className="image-previews">
                  {previewImages.map((src, index) => (
                    <img key={index} src={src} alt="Thumbnail" style={{ width: "100px", height: "100px", objectFit: "cover", margin: "5px" }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-2 ms-auto">
                <button className="btn btn-primary w-100">Salvar</button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

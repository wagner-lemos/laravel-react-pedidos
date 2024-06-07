import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {createRef} from "react";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useState } from "react";

export default function Login() {
  const emailRef = createRef()
  const passwordRef = createRef()
  const { setUser, setToken } = useStateContext()
  const [message, setMessage] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h4 className="title">Excellent Sistemas</h4>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }
          <div className="row">
              <div className="col-12">
                <input ref={emailRef} type="email" className="form-control" placeholder="E-mail"/>
                <input ref={passwordRef} type="password" className="form-control" placeholder="Senha"/>
              </div>
          </div>

          <div className="row">
              <div className="col">
                <button className="btn btn-primary w-100">Entrar</button>
              </div>
          </div>

          <p className="message">Não está registrado? <Link to="/signup">Criar uma conta</Link></p>
        </form>
      </div>
    </div>
  )
}

import {Link} from "react-router-dom";
import {createRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Signup() {
  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()
  const {setUser, setToken} = useStateContext()
  const [errors, setErrors] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    axiosClient.post('/signup', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h4 className="title">Cadastro</h4>
          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }

          <div className="row">
              <div className="col-12">

                <input ref={nameRef} type="text" className="form-control" placeholder="Nome Completo"/>
                <input ref={emailRef} type="email" className="form-control" placeholder="Endereço de Email"/>
                <input ref={passwordRef} type="password" className="form-control" placeholder="Senha"/>
                <input ref={passwordConfirmationRef} type="password" className="form-control" placeholder="Repetir Senha"/>

              </div>
          </div>

          <div className="row">
              <div className="col">
                <button className="btn btn-primary w-100">Registrar-se</button>
              </div>
          </div>
          
          <p className="message">Já está registrado? <Link to="/login">Entrar</Link></p>
        </form>
      </div>
    </div>
  )
}

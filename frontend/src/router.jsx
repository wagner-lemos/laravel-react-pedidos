import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import Clients from "./views/Clients";
import Products from "./views/Products";
import Requests from "./views/Requests";
import RequestsForm from "./views/RequestsForm";
import UserForm from "./views/UserForm";
import ClientsForm from "./views/ClientsForm";
import ProductsForm from "./views/ProductsForm";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/users"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/users',
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/clients',
        element: <Clients/>
      },
      {
        path: '/clients/new',
        element: <ClientsForm key="userCreate" />
      },
      {
        path: '/clients/:id',
        element: <ClientsForm key="userUpdate" />
      },
      {
        path: '/products',
        element: <Products/>
      },
      {
        path: '/products/new',
        element: <ProductsForm key="userCreate" />
      },
      {
        path: '/products/:id',
        element: <ProductsForm key="userUpdate" />
      },
      {
        path: '/requests',
        element: <Requests/>
      },
      {
        path: '/requests/new',
        element: <RequestsForm key="userCreate" />
      },
      {
        path: '/requests/:id',
        element: <RequestsForm key="userUpdate" />
      },
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;

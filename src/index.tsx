import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import ErrorPage from "./components/ErrorPage";
import './index.css';
import App from './App';
import Frontpage from '@/views/Frontpage';
import Projects from '@/views/Projects';
import TicTacToe from '@/views/TicTacToe';
import State from '@/views/State';
import S3 from './views/S3';
import { RouteNames } from '@/models/routes';
import Login from './views/Login';
import Alibaba from './views/Alibaba';
import Paypal from './views/Paypal';
import Test from './views/Test';
import RouteNotFound from './components/RouteNotFound';
import SignUp from './views/SignUp';
import Contact from './views/Contact';
import Carousel from './views/Carousel';

const routes = [
  {
    path: RouteNames.HOME,
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: RouteNames.HOME,
        element: <Frontpage/>,
      },
      {
        path: RouteNames.PROJECTS,
        element: <Projects/>,
        children: [
          {
            path: RouteNames.PROJECTS_TICTACTOE,
            element: <TicTacToe/>,
          },
          {
            path: RouteNames.PROJECTS_STATE,
            element: <State/>,
          },
          {
            path: RouteNames.PROJECTS_S3,
            element: <S3/>,
          },
          {
            path: RouteNames.PROJECTS_ALIBABA,
            element: <Alibaba/>,
          },
          {
            path: RouteNames.PROJECTS_PAYPAL,
            element: <Paypal/>,
          },
          {
            path: RouteNames.PROJECTS_TEST,
            element: <Test/>,
          },
          {
            path: RouteNames.PROJECTS_CAROUSEL,
            element: <Carousel/>,
          },
        ]
      },
      {
        path: RouteNames.CONTACT,
        element: <Contact/>
      },
      {
        path: RouteNames.NOT_FOUND,
        element: <RouteNotFound/>
      },
      {
        path: RouteNames.LOGIN,
        element: <Login/>,
      },
      {
        path: RouteNames.SIGN_UP,
        element: <SignUp/>,
      },
    ]
  }
]

const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

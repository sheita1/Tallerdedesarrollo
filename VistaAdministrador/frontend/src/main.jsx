import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, useParams } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Patrimonios from '@pages/Patrimonios';
import DetallePatrimonio from '@pages/DetallePatrimonio';
import GaleriaPatrimonio from '@pages/GaleriaPatrimonio';
import TurismoOnePage from '@pages/TurismoOnePage';       
import VistaTurista from '@pages/VistaTurista';          
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

// ✅ Wrappers para rutas con parámetros
function DetallePatrimonioWrapper() {
  const { id } = useParams();
  return <DetallePatrimonio patrimonioId={id} />;
}

function GaleriaPatrimonioWrapper() {
  const { id } = useParams();
  return <GaleriaPatrimonio patrimonioId={id} />;
}

function VistaTuristaWrapper() {
  const { id } = useParams();
  return <VistaTurista id={id} />;
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <Error404 />,
      children: [
        { path: '/home', element: <Home /> },
        { path: '/users', element: <ProtectedRoute allowedRoles={['administrador']}><Users /></ProtectedRoute> },
        { path: '/patrimonios', element: <ProtectedRoute allowedRoles={['administrador']}><Patrimonios /></ProtectedRoute> },
        { path: '/patrimonios/:id', element: <ProtectedRoute allowedRoles={['administrador']}><DetallePatrimonioWrapper /></ProtectedRoute> },
        { path: '/galeria/:id', element: <ProtectedRoute allowedRoles={['administrador']}><GaleriaPatrimonioWrapper /></ProtectedRoute> },
        { path: '/turismo', element: <TurismoOnePage /> },
        { path: '/patrimonio/:id', element: <VistaTuristaWrapper /> },
      ]
    },
    { path: '/auth', element: <Login /> }
  ],
  {
    basename: '/admin'   // 👈 Aquí está la clave
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

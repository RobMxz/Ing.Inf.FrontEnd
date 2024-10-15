import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { AgregarItemSede } from "./components/AuthForms/AgregarItemSede";
import { LogIn } from "./components/AuthForms/LogIn";
import { SignUp } from "./components/AuthForms/SignUp";
import { VisualizarInventarioSede } from "./components/AuthForms/VisualizarInventarioSede";
import Header from "./components/Header";
import { EditarItem } from "./components/AuthForms/EditarItem";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppRoot />,
    children: [
      { index: true },
      {
        path: "login",
        element: <LogIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "agregar-item-sede",
        element: <AgregarItemSede />,
      },
      {
        path: "visualizar-inventario-sede",
        element: <VisualizarInventarioSede />,
      },
      {
        path: "editar-item",
        element: <EditarItem />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
function AppRoot() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

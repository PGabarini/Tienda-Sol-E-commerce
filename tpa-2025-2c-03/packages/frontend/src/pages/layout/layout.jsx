// Layout.jsx
import React, { useState } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { Outlet } from "react-router-dom";
import CarritoDesplegable from "../../components/header/carritoDesplegable";

export default function Layout() {
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  return (
    <>
      <Header onToggleCarrito={() => setMostrarCarrito((prev) => !prev)} />
      <CarritoDesplegable visible={mostrarCarrito} onClose={() => setMostrarCarrito(false)} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

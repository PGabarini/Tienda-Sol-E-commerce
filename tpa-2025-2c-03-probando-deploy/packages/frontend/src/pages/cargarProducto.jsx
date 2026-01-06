import React, { useState } from "react";
import { SidebarPerfil } from "../components/sidebar/sidebarPerfil";
import "../styles/cargarProducto.css";
import { crearProducto } from "../service/productosService.js";
import { useAuth } from "../context/AuthContext";

const CargarProducto = () => {

    const { token, profile, isAuthenticated } = useAuth();
    const [producto, setProducto] = useState({
        titulo: "",
        descripcion: "",
        categorias: [""],
        precio: "",
        moneda: "PESO_ARG",
        stock: "",
        fotos: [],
    });

    const [archivosFoto, setArchivosFoto] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleArrayChange = (e, field, index) => {
        const newArr = [...producto[field]];
        newArr[index] = e.target.value;
        setProducto({ ...producto, [field]: newArr });
    };

    const addField = (field) => {
        setProducto({ ...producto, [field]: [...producto[field], ""] });
    };

    const handleAddFotos = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const nuevasArchivos = [...archivosFoto];
        const nuevasFotos = [...producto.fotos];

        files.forEach(file => {
            nuevasArchivos.push(file);
            nuevasFotos.push(URL.createObjectURL(file));
        });

        setArchivosFoto(nuevasArchivos);
        setProducto({ ...producto, fotos: nuevasFotos });
        e.target.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated || !token || !profile || !profile.mongoId) {
            alert("Debes iniciar sesión para publicar un producto.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("vendedor", profile.mongoId);
        formData.append("titulo", producto.titulo);
        formData.append("descripcion", producto.descripcion);
        formData.append("precio", Number(producto.precio));
        formData.append("moneda", producto.moneda);
        formData.append("stock", Number(producto.stock));
        formData.append("cantidadVendida", 0);

        producto.categorias
            .filter(c => c.trim() !== "")
            .forEach(cat => formData.append("categorias", cat));

        archivosFoto
            .filter(file => file !== null)
            .forEach(file => formData.append("fotos", file));

        try {
            const response = await crearProducto(token, formData);
            console.log("Respuesta del Backend:", response);
            alert("Producto cargado correctamente, incluyendo fotos!");

            setProducto({
                titulo: "",
                descripcion: "",
                categorias: [""],
                precio: "",
                moneda: "PESO_ARG",
                stock: "",
                fotos: [],
            });
            setArchivosFoto([]);

        } catch (err) {
            console.error("Error al cargar el producto:", err);
            alert(`Hubo un error al cargar el producto: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pedido-container">
            <SidebarPerfil />

            <main className="pedido-main">
                <h2>Publicar Producto</h2>
                <p>Completá los datos del producto que querés publicar</p>

                <form className="pedido-form" onSubmit={handleSubmit}>
                    <div className="form-layout">
                        {/* Columna izquierda */}
                        <section className="col-left">
                            <h3>Datos del producto</h3>

                            <div className="form-field">
                                <label>Título</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    maxLength={70}
                                    value={producto.titulo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-field small">
                                    <label>Precio</label>
                                    <input
                                        type="number"
                                        name="precio"
                                        min="0"
                                        value={producto.precio}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-field small">
                                    <label>Moneda</label>
                                    <select
                                        name="moneda"
                                        value={producto.moneda}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="PESO_ARG">Peso Argentino</option>
                                        <option value="DOLAR_USA">Dólar</option>
                                        <option value="REAL">Real</option>
                                    </select>
                                </div>

                                <div className="form-field small">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        min="0"
                                        value={producto.stock}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <label>Descripción</label>
                                <textarea
                                    name="descripcion"
                                    maxLength={2000}
                                    value={producto.descripcion}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </section>

                        <section className="col-right">
                            <div className="form-section">
                                <h3>Categorías</h3>
                                {producto.categorias.map((cat, i) => (
                                    <div className="form-field small" key={`cat-${i}`}>
                                        <label>Categoría {i + 1}</label>
                                        <input
                                            type="text"
                                            value={cat}
                                            onChange={(e) => handleArrayChange(e, "categorias", i)}
                                            maxLength={100}
                                        />
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="btn-secondary inline-btn"
                                    onClick={() => addField("categorias")}
                                >
                                    + Agregar categoría
                                </button>
                            </div>

                            <div className="form-section">
                                <h3>Fotos</h3>
                                <div className="fotos-grid">
                                    {producto.fotos.map((fotoUrl, i) => (
                                        <div className="foto-card" key={`foto-${i}`}>
                                            <img src={fotoUrl} alt={`Foto ${i + 1}`} />
                                        </div>
                                    ))}
                                    <label htmlFor="fileInput" className="btn-add-foto">+</label>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: "none" }}
                                        onChange={handleAddFotos}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="submit-container">
                        <button type="submit" className="btn-secondary" disabled={loading}>
                            {loading ? "Cargando..." : "Publicar producto"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default CargarProducto;

describe('Flujo de busqueda de productos', () => {
  it('Un Usuario puede buscar productos, filtrarlos, limpiar los filtros, entrar al detalle, agregar al carrito y volver a la busqueda', () => {
    cy.visit('https://tienda-sol-jaguares.netlify.app/')

    //Buscar
    const inputBusqueda = cy.get(".navbar .container.nav-content .input-busqueda")
    inputBusqueda.type("gorra");

    const botonBuscar = cy.get(".navbar .container.nav-content .submit-busqueda");
    botonBuscar.click();

    let contenedorProductos= cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos");
    contenedorProductos.children().should("have.length",3);

    const formFiltros = cy.get(".contenedor-filtros .form-filtros")


    //Filtros de precio
    const filtroPrecioMinimo = formFiltros.get(".contenedor-filtro-precio .input-precio-minimo")
    filtroPrecioMinimo.type("200")

    const filtroPrecioMaximo = formFiltros.get(".contenedor-filtro-precio .input-precio-maximo")
    filtroPrecioMaximo.type("8000")

    contenedorProductos= cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos");
    contenedorProductos.children().should("have.length",2);

    //Filtro descripcion
    const filtroDescripcion = formFiltros.get(".contenedor-filtro-descripcion >input")
    filtroDescripcion.type("trucker")

    contenedorProductos= cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos");
    contenedorProductos.children().should("have.length",1);

    //Lipiar filtros
    const botonLimpiarFiltros = formFiltros.get(".boton.filtrar");
    botonLimpiarFiltros.click();

    contenedorProductos= 
      cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos ");
    contenedorProductos.children().should("have.length",3);

    //Tomo primer producto
    const primerProducto= cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos > div:nth-child(3)");
    primerProducto.should("contain","Trucker")

    //Ir al detalle
    const botonVerDetalle = cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos > div:nth-child(3) .btn-primary");
    botonVerDetalle.click()
     cy.get(".detalle-producto").should("be.visible")

    //Agregar al carrito
    const botonAgregarAlCarrito = cy.get(".detalle-producto .contenedor .contenedor-info button")
    botonAgregarAlCarrito.click();

    cy.get(".toast-container").should("be.visible")

    //Volver a la busqueda
    const botonVolver = cy.get(".detalle-producto .boton-volver")
    botonVolver.click()

    //Sigo en la misma busqueda
    contenedorProductos =cy.get(".contenedor-principal .contenedor-productos-paginas .contenedor-productos");
    contenedorProductos.children().should("have.length",3);

    //Volver al inicio
    const botonLogo = cy.get(".navbar .logo")
    botonLogo.click()
    cy.get("main .hero .container.hero-content").should("be.visible")
  })
})
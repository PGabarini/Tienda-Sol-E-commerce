describe('Flujo de sesion de usuario', () => {
  it('Un Usuario se logea sin cuenta, no puede y se crea una', () => {
    cy.visit('https://tienda-sol-jaguares.netlify.app/')

    //Ir a loguearse
    const botonLoguearse = cy.get(".navbar .auth-buttons> button:nth-child(1)")
    botonLoguearse.click()

    cy.get(".login-container .login-form").should("be.visible")

    //Completar campos
    cy.get(".login-container .login-form .nombre-usuario").type("pablo")
    cy.get(".login-container .login-form .contrasenia").type("pablo")

    //intento logearme
    const botonIniciar =cy.get(".login-container .login-form .btn-primary.wide.iniciar")
    botonIniciar.click()
    cy.get(".toast-container").should("be.visible")

    //Voy a registrarme
    const botonRegistrarme =cy.get(".login-container .login-form .btn-primary.wide.registrarse")
    botonRegistrarme.click()
    cy.get(".registro-container .registro-form").should("be.visible")

    //Puedo completar todos los campos
    cy.get(".registro-container .registro-form .form-grid .usuario").type("PG")
    cy.get(".registro-container .registro-form .form-grid .email").type("pablo@gmail.com")
    cy.get(".registro-container .registro-form .form-grid .nombre").type("Pablo")
    cy.get(".registro-container .registro-form .form-grid .apellido").type("Gabarini")
    cy.get(".registro-container .registro-form .form-grid .contrasenia").type("pablo123")
    cy.get(".registro-container .registro-form .form-grid .confirmar-contrasenia").type("pablo123")
    cy.get(".registro-container .registro-form .form-grid .telefono").type("236488888")

    //Puedo crear mi cuenta
    cy.get(".registro-container .registro-form .btn-primary.wide.crear-cuenta")
    
    //Vuevlo al inicio
    const botonLogo = cy.get(".registro-container .registro-left > a:nth-child(1)")
    botonLogo.click()
    cy.get("main .hero .container.hero-content").should("be.visible")
  });
});
import { Carrousel } from "./carrousel"
import "../../styles/landing.css"

export const HeroSection = () => {

    return (
        <section className="hero">
            <div className="container hero-content">
                
                <div className="hero-text">
                    <h1>Iluminá tu hogar con el estilo de 
                        <span className="marca">Tienda Sol</span>
                    </h1>
                    <p>
                    Descubrí nuestra colección de productos únicos pensados para llenar tus espacios de calidez, color y confort. En Tienda Sol combinamos diseño, calidad y precios justos para que cada rincón de tu hogar brille con tu propia esencia.
                    </p>
                </div>

                <Carrousel label="productos" tiempoEnMilisegundos={3000} componentesEnSimultaneo={1}>
                    <img src="https://picsum.photos/600/400?random=1" alt="foto1" className="hero-image"></img>
                    <img src="https://picsum.photos/600/400?random=2" alt="foto2" className="hero-image"></img>
                    <img src="https://picsum.photos/600/400?random=3" alt="foto3" className="hero-image"></img>
                </Carrousel>
            </div>
        </section>
    )
}
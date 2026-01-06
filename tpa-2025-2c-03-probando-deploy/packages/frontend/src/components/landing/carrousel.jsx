import React, { useState, useEffect } from "react";
import "../../styles/carrousel.css";

export const Carrousel = ({ label, tiempoEnMilisegundos, children }) => {
    const arrayDeChildren = React.Children.toArray(children);
    const cantidad = arrayDeChildren.length;

    const [indice, setIndice] = useState(0);
    const [isLoaded, setIsLoaded] = useState(true); // controla el fade

    useEffect(() => {
        if (cantidad === 0) return;

        const id = setInterval(() => {
            const nextIndex = (indice + 1) % cantidad;
            const nextImage = new Image();

            setIsLoaded(false); // comienza fade-out

            // pre-cargamos y recién cambiamos
            nextImage.onload = () => {
                setIndice(nextIndex);
                setIsLoaded(true); // fade-in
            };

            nextImage.src = arrayDeChildren[nextIndex].props.src;
        }, tiempoEnMilisegundos);

        return () => clearInterval(id);
    }, [indice, arrayDeChildren, tiempoEnMilisegundos, cantidad]);

    return (
        <section className="contenedor-carrousel" aria-label={`Carrousel de ${label}`}>
            <img
                key={indice}
                src={arrayDeChildren[indice].props.src}
                alt={arrayDeChildren[indice].props.alt}
                className={`hero-image fade ${isLoaded ? "visible" : "hidden"}`}
            />
        </section>
    );
};

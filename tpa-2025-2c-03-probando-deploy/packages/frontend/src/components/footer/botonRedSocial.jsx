export const BotonRedSocial = ({ nombre, link, foto }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" className="boton-red-social">
    <img src={foto} alt={nombre} />
    {nombre}
  </a>
);

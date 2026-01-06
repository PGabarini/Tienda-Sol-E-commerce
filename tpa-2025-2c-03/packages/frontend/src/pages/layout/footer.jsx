import "../../styles/footer.css";
import { BotonRedSocial } from "../../components/footer/botonRedSocial"

export const Footer = () => {
  return (
    <footer>
      <h2>TiendaSol</h2>
      <p>CodingMonkeys S.R.L</p>
      <div className="footer-socials">
        <BotonRedSocial 
          nombre="Instagram" 
          link="https://www.instagram.com/" 
          foto="/uploads/instagram.png" 
        />
        <BotonRedSocial 
          nombre="Linkedin" 
          link="https://www.linkedin.com/" 
          foto="/uploads/linkedin.png" 
        />
      </div>
    </footer>
  );
};
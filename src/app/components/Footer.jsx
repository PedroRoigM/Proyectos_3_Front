import { footerStyles } from "./styles/footerStyles";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={footerStyles.footer.container}>
            <div className={footerStyles.footer.layout}>
                {/* Columna 1 - Contacto */}
                <div className={footerStyles.footer.section}>
                    <div className={footerStyles.footer.social.container}>
                        <a href="https://x.com/U_tad" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className={footerStyles.footer.social.icon} />
                        </a>
                        <a href="https://es-es.facebook.com/utadcentrouniversitario" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF className={footerStyles.footer.social.icon} />
                        </a>
                        <a href="https://www.instagram.com/u_tad/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className={footerStyles.footer.social.icon} />
                        </a>
                        <a href="https://www.linkedin.com/school/u-tad/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn className={footerStyles.footer.social.icon} />
                        </a>
                        
                        <a href="https://www.youtube.com/user/UniversidadUTAD" target="_blank" rel="noopener noreferrer">
                            <FaYoutube className={footerStyles.footer.social.icon} />
                        </a>
                    </div>
                    <a href="https://u-tad.com/contacto/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>CONTACTA CON NOSOTROS</p>
                    </a>
                    <a href="https://www.google.com/maps/place/U-tad+%7C+Centro+Universitario+de+Tecnolog%C3%ADa+y+Arte+Digital/@40.5384477,-3.8933166,3a,75y,178.13h,86.81t/data=!3m7!1e1!3m5!1sAF1QipN0oeeQvOUe50Ad8mdhzIPOjnE6d90dvKKx6efO!2e10!3e12!7i13864!8i6932!4m5!3m4!1s0x0:0xd99cf803771e7271!8m2!3d40.5392277!4d-3.8932693?hl=es" target="_blank" rel="noopener noreferrer">
                    <p className={footerStyles.footer.link}>TOUR VIRTUAL</p>
                    </a>
                    
                    <p className={footerStyles.footer.text}>Calle Playa de Liencres, 2 bis – Parque Europa Empresarial</p>
                    <p className={footerStyles.footer.text}>Edificio Madrid – 28290 Las Rozas, Madrid</p>
                    <p>
                        <a href="mailto:info@u-tad.com" className={footerStyles.footer.text_link}>info@u-tad.com</a> | <a href="tel:+34900373379" className={footerStyles.footer.text_link}>(+34) 900 373 379</a> | <a><br/>L-V: 09:00 h. – 21:00 h.</a>
                    </p>
                </div>

                {/* Columna 2 - Navegación */}
                <div className={footerStyles.footer.section}>
                    <a href="https://u-tad.com/estudios/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>OFERTA FORMATIVA</p>
                    </a>
                    <a href="https://u-tad.com/proceso-de-admision/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>PROCESO DE ADMISIÓN</p>
                    </a>
                    <a href="https://u-tad.com/movilidad-internacional-para-alumnos/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>INTERNACIONAL</p>
                    </a>
                    <a href="https://u-tad.com/trabaja-en-u-tad/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>TRABAJA EN U-TAD</p>
                    </a>
                    <a href="https://u-tad.com/prensa/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>PRENSA</p>
                    </a>
                    <a href="https://u-tad.com/contacto/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>EMPRESAS</p>
                    </a>
                    <a href="https://u-tad.com/trabajos-de-alumnos/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>TRABAJOS DE ALUMNOS</p>
                    </a>
                    <a href="https://u-tad.com/empleo-y-practicas/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>EMPLEO Y PRÁCTICAS</p>
                    </a>
                    <a href="https://u-tad.blackboard.com/webapps/login/" target="_blank" rel="noopener noreferrer">
                        <p className={footerStyles.footer.link}>ACCESO AL CAMPUS VIRTUAL</p>
                    </a>
                </div>

                {/* Columna 3 - Logos y partners */}
                <div className={footerStyles.footer.section}>
                    <p>Partner de U-tad:</p>
                    <img src="/images/skydance.png" alt="Skydance" className={footerStyles.footer.logos.image} />

                    <p>Centro adscrito a:</p>
                    <img src="/images/universidad-cjc.png" alt="Camilo José Cela" className={footerStyles.footer.logos.imageSm} />

                    <p>Centro de excelencia en Software:</p>
                    <img src="/images/COE.png" alt="Toon Boom" className={footerStyles.footer.logos.imageSm} />

                    <p>The Rookies Certified School:</p>
                    <img src="/images/rookies.png" alt="The Rookies" className={footerStyles.footer.logos.imageRk} />

                    <img src="/images/eu.svg" alt="Logos Institucionales" className={footerStyles.footer.logos.institutional} />
                </div>
            </div>

            {/* Parte inferior */}
            <div className={footerStyles.footer.bottom}>
                <span>© {new Date().getFullYear()} U-tad. Todos los derechos reservados.</span>
            </div>
        </footer>
    );
}
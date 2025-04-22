import { footerStyles } from "./styles/footerStyles";
import { FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className={footerStyles.footer.container}>
            <div className={footerStyles.footer.layout}>
                {/* Columna 1 - Contacto */}
                <div className={footerStyles.footer.section}>
                    <div className={footerStyles.footer.social.container}>
                        <FaTwitter className={footerStyles.footer.social.icon} />
                        <FaFacebookF className={footerStyles.footer.social.icon} />
                        <FaInstagram className={footerStyles.footer.social.icon} />
                        <FaLinkedinIn className={footerStyles.footer.social.icon} />
                        <FaYoutube className={footerStyles.footer.social.icon} />
                    </div>
                    <p className={footerStyles.footer.link}>CONTACTA CON NOSOTROS</p>
                    <p className={footerStyles.footer.link}>TOUR VIRTUAL</p>
                    <p>Calle Playa de Liencres, 2 bis – Parque Europa Empresarial</p>
                    <p>Edificio Madrid – 28290 Las Rozas, Madrid</p>
                    <p>
                        <a href="mailto:info@u-tad.com" className="text-blue-300">info@u-tad.com</a> | <a className="text-blue-300">(+34) 900 373 379</a> | L-V: 09:00 h. – 21:00 h.
                    </p>
                </div>

                {/* Columna 2 - Navegación */}
                <div className={footerStyles.footer.section}>
                    <p className={footerStyles.footer.link}>OFERTA FORMATIVA</p>
                    <p className={footerStyles.footer.link}>PROCESO DE ADMISIÓN</p>
                    <p className={footerStyles.footer.link}>INTERNACIONAL</p>
                    <p className={footerStyles.footer.link}>TRABAJA EN U-TAD</p>
                    <p className={footerStyles.footer.link}>PRENSA</p>
                    <p className={footerStyles.footer.link}>EMPRESAS</p>
                    <p className={footerStyles.footer.link}>TRABAJOS DE ALUMNOS</p>
                    <p className={footerStyles.footer.link}>EMPLEO Y PRÁCTICAS</p>
                    <p className={footerStyles.footer.link}>ACCESO AL CAMPUS VIRTUAL</p>
                </div>

                {/* Columna 3 - Logos y partners */}
                <div className={footerStyles.footer.section}>
                    <p className={footerStyles.footer.logos.title}>Partner de U-tad:</p>
                    <img src="/images/skydance.png" alt="Skydance" className={footerStyles.footer.logos.image} />

                    <p className={footerStyles.footer.logos.title}>Centro adscrito a:</p>
                    <img src="/images/universidad-cjc.png" alt="Camilo José Cela" className={footerStyles.footer.logos.imageSm} />

                    <p className={footerStyles.footer.logos.title}>Centro de excelencia en Software:</p>
                    <img src="/images/COE.png" alt="Toon Boom" className={footerStyles.footer.logos.imageSm} />

                    <p className={footerStyles.footer.logos.title}>The Rookies Certified School:</p>
                    <img src="/images/rookies.png" alt="The Rookies" className={footerStyles.footer.logos.imageSm} />
                </div>

                {/* Columna 4 - Logos institucionales*/}
                <div className={footerStyles.footer.section + " hidden lg:block"}>
                    <img src="/images/eu.svg" alt="Logos Institucionales" className="h-10 mb-2" />
                </div>
            </div>

            {/* Parte inferior */}
            <div className={footerStyles.footer.bottom}>
                <span>© {new Date().getFullYear()} U-tad. Todos los derechos reservados.</span>
                <span className="mt-2 md:mt-0">Política de privacidad | Aviso legal</span>
            </div>
        </footer>
    );
}
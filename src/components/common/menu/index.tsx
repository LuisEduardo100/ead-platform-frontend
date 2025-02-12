import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles.module.scss";
import { useYear } from "../../HomeAuth/selectBox/yearProvider";
import { useMenu } from "./menuProvider";
import { Button } from "reactstrap";
import { Home, OndemandVideo, Payment, School, VideoLibrary, LibraryBooks, Help, Close, Menu } from "@mui/icons-material";

export default function Menuhamburger({ accessType }: { accessType: boolean }) {
    const { isMenuOpen, toggleMenu, setIsMenuOpen } = useMenu();
    const { selectedYear, onYearChange } = useYear();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showFundamental, setShowFundamental] = useState(false);
    const [showMedio, setShowMedio] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
      const handleResize = () => {
        const isLarge = window.innerWidth >= 1538;
        setIsMenuOpen(isLarge);
      };
  
      window.addEventListener("resize", handleResize);
      handleResize();
  
      return () => window.removeEventListener("resize", handleResize);
    }, [setIsMenuOpen]);
  
    const closeAllDropdowns = () => {
      setShowDropdown(false);
      setShowFundamental(false);
      setShowMedio(false);
    };
  
    return (
      <div className={styles.menuContainer}>
        <div className={styles.menuLogo}>
          <Button onClick={toggleMenu} className={styles.menuButton}>
            {isMenuOpen ? <Close /> : <Menu />}
          </Button>
          {isMenuOpen ? (
            <Link href="/home" className={styles.newLogo}>
              <div className={styles.divLogo}>
                <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
              </div>
            </Link>
          ) : (
            <Link href="/home" className={styles.linkStyle}>
              <div className={styles.divLogo}>
                <img src="/logo-vocenotadez.png" alt="logoFooter" className={styles.imgLogo} />
              </div>
            </Link>
          )}
        </div>
        <div className={`${styles.menu} ${isMenuOpen ? styles.visible : styles.hidden}`}>
          <nav className={styles.nav}>
            <ul>
              <li onClick={() => router.push("/home")}>
                <Home fontSize="large" style={{ marginRight: "16px" }} />
                Início
              </li>
              {!accessType && (
                <>
                  <li
                    onClick={() => {
                      sessionStorage.setItem("previousPage", window.location.pathname);
                      router.push(`/courses/${1}`);
                    }}
                  >
                    <OndemandVideo fontSize="large" style={{ marginRight: "16px" }} />
                    Curso gratuito
                  </li>
                  <li
                    onClick={() => {
                      sessionStorage.setItem("previousPage", window.location.pathname);
                      router.push(`/precos`);
                    }}
                  >
                    <Payment fontSize="large" style={{ marginRight: "16px" }} />
                    Acesso completo
                  </li>
                </>
              )}
              {/* Dropdown para as séries */}
              <li
                className={styles.menuItemWithDropdown}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => {
                  setShowDropdown(false);
                  setShowFundamental(false);
                  setShowMedio(false);
                }}
              >
                <School fontSize="large" style={{ marginRight: "16px" }} />
                {selectedYear}
                {showDropdown && (
                  <ul className={styles.dropdownMenu}>
                    {/* Submenu: Ensino fundamental */}
                    <li
                      className={styles.dropdownItem}
                      onMouseEnter={() => setShowFundamental(true)}
                      onMouseLeave={() => setShowFundamental(false)}
                    >
                      Ensino fundamental
                      {showFundamental && (
                        <ul className={styles.dropdownFundamental}>
                          {["6º ano", "7º ano", "8º ano", "9º ano"].map((year) => (
                            <li
                              key={year}
                              className={styles.dropdownItem}
                              onClick={() => {
                                onYearChange(year);
                                closeAllDropdowns();
                              }}
                            >
                              {year}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                    {/* Submenu: Ensino médio */}
                    <li
                      className={styles.dropdownItem}
                      onMouseEnter={() => setShowMedio(true)}
                      onMouseLeave={() => setShowMedio(false)}
                    >
                      Ensino médio
                      {showMedio && (
                        <ul className={styles.dropdownMedio}>
                          {["1º ano", "2º ano", "3º ano"].map((year) => (
                            <li
                              key={year}
                              className={styles.dropdownItem}
                              onClick={() => {
                                onYearChange(year);
                                closeAllDropdowns();
                              }}
                            >
                              {year}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>
              <li onClick={() => router.push(`/todos-os-cursos?categoria=Matematica`)}>
                <VideoLibrary fontSize="large" style={{ marginRight: "16px" }} />
                Todos os cursos
              </li>
              <li onClick={() => router.push("/apostilas")}>
                <LibraryBooks fontSize="large" style={{ marginRight: "16px" }} />
                Apostilas
              </li>
              <li>
                <Link
                  href={"https://wa.me/558594123487?text=Olá, gostaria de tirar uma dúvida."}
                  style={{ textDecoration: "none", color: "inherit" }}
                  target="_blank"
                >
                  <Help fontSize="large" style={{ marginRight: "16px" }} />
                  Suporte
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
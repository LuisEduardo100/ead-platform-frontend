'use client';
import { createContext, useContext, useState } from 'react';

interface MenuContextProps {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    setIsMenuOpen: (state: boolean) => void; // Adicione esta propriedade corretamente
}

const MenuContext = createContext<MenuContextProps>({
    isMenuOpen: false,
    toggleMenu: () => {},
    setIsMenuOpen: () => {},
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    return (
        <MenuContext.Provider value={{ isMenuOpen, toggleMenu, setIsMenuOpen }}>
            {children}
        </MenuContext.Provider>
    );
};

// Hook para usar o contexto
export const useMenu = () => useContext(MenuContext);

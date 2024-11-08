'use client'
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface YearContextType {
    selectedYear: string;
    onYearChange: (year: string) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({ children }: { children: ReactNode }) => {
    const [selectedYear, setSelectedYear] = useState('6º ano');

    const onYearChange = (year: string) => setSelectedYear(year);

    return (
        <YearContext.Provider value={{ selectedYear, onYearChange }}>
            {children}
        </YearContext.Provider>
    );
};

export const useYear = () => {
    const context = useContext(YearContext);
    if (!context) {
        throw new Error('useYear must be used within a YearProvider');
    }
    return context;
};

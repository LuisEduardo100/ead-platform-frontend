'use client'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import profileService from '../../../services/profileService';
import PageSpinner from '../../common/pageSpinner';

interface YearContextType {
    selectedYear: string | null;
    onYearChange: (year: string | null) => void;
}

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider = ({ children }: { children: ReactNode }) => {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    const onYearChange = (year: string | null) => setSelectedYear(year);

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

import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    textSize: 'normal', // small, normal, large, xlarge
    highContrast: false,
    colorBlindMode: 'none', // none, protanopia, deuteranopia
    reduceMotion: false
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply text size
    root.classList.remove('text-size-small', 'text-size-large', 'text-size-xlarge');
    if (settings.textSize !== 'normal') root.classList.add(`text-size-${settings.textSize}`);
    
    // Apply contrast
    if (settings.highContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    // Apply motion
    if (settings.reduceMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');

  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
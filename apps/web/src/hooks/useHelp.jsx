import React, { createContext, useContext, useState } from 'react';

const HelpContext = createContext();

export const HelpProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const openHelp = (topic = 'general') => {
    setCurrentTopic(topic);
    setIsOpen(true);
  };

  const closeHelp = () => setIsOpen(false);

  return (
    <HelpContext.Provider value={{ isOpen, currentTopic, searchQuery, setSearchQuery, openHelp, closeHelp }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelp = () => useContext(HelpContext);
import PropTypes from 'prop-types';
import React, { createContext, useState } from 'react';

export const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('');

  const titleContextValue = {
    title,
    setTitle,
  };

  return (
    <TitleContext.Provider value={titleContextValue}>
      {children}
    </TitleContext.Provider>
  );
};

TitleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

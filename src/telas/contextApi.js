import React, { createContext, useContext, useState } from 'react';

const TarefaContext = createContext();

export const TarefaProvider = ({ children }) => {
  const [tarefas, setTarefas] = useState([]);

  const adicionarTarefa = (novaTarefa) => {
    setTarefas((prevTarefas) => [...prevTarefas, novaTarefa]);
  };

  return (
    <TarefaContext.Provider value={{ tarefas, adicionarTarefa }}>
      {children}
    </TarefaContext.Provider>
  );
};

export const useTarefa = () => useContext(TarefaContext);
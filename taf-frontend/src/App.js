import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CadastroAluno from './components/CadastroAluno';
import RegistroPontuacao from './components/RegistroPontuacao';
import ListaAlunos from './components/ListaAlunos';
import DetalhesAluno from './components/DetalhesAluno';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ListaAlunos />} />
        <Route path="/cadastrar-aluno" element={<CadastroAluno />} />
        <Route path="/registrar-pontuacao" element={<RegistroPontuacao />} />
        <Route path="/aluno/:id" element={<DetalhesAluno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React, { useState } from 'react';
import axios from 'axios';

function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [sexo, setSexo] = useState('M');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/alunos', { nome, idade, sexo })
    alert('Aluno cadastrado!');
    setNome(''); setIdade(''); setSexo('M');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
      <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade" required />
      <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
        <option value="M">Masculino</option>
        <option value="F">Feminino</option>
      </select>
      <button type="submit">Cadastrar</button>
    </form>
  );
}

export default CadastroAluno;
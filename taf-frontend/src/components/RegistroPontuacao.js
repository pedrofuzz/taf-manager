import React, { useState } from 'react';
import axios from 'axios';

function RegistroPontuacao() {
  const [alunoId, setAlunoId] = useState('');
  const [exercicioId, setExercicioId] = useState('');
  const [valor, setValor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3000/pontuacoes', { aluno_id: alunoId, exercicio_id: exercicioId, valor });
    alert('Pontuação registrada!');
    setAlunoId(''); setExercicioId(''); setValor('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={alunoId} onChange={(e) => setAlunoId(e.target.value)} placeholder="ID do Aluno" required />
      <input value={exercicioId} onChange={(e) => setExercicioId(e.target.value)} placeholder="ID do Exercício" required />
      <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Valor" required />
      <button type="submit">Registrar</button>
    </form>
  );
}

export default RegistroPontuacao;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DetalhesAluno() {
  const { id } = useParams();
  const [detalhes, setDetalhes] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/pontuacoes/aluno/${id}`)
      .then(res => setDetalhes(res.data));
  }, [id]);

  if (!detalhes) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Pontuações</h2>
      <table>
        <thead><tr><th>Exercício</th><th>Valor</th><th>Pontuação</th></tr></thead>
        <tbody>
          {detalhes.pontuacoes.map(p => (
            <tr key={p.id}><td>{p.exercicio}</td><td>{p.valor}</td><td>{p.pontuacao}</td></tr>
          ))}
        </tbody>
      </table>
      <p><strong>Total:</strong> {detalhes.total}</p>
      <p><strong>Situação:</strong> {detalhes.situacao}</p>
    </div>
  );
}

export default DetalhesAluno;
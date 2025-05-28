import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/resultados')
      .then(res => setAlunos(res.data));
  }, []);

  return (
    <>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Nome</th><th>Pontuação Total</th><th>Situação</th>
        </tr>
      </thead>
      <tbody>
        {alunos.map(aluno => (
          <tr key={aluno.id}>
            <td>{aluno.id}</td><td>{aluno.nome}</td><td>{aluno.total}</td><td>{aluno.situacao}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </>
  );
}

export default ListaAlunos;
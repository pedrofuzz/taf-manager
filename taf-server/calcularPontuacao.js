async function calcularPontuacao(db, alunoId, exercicioId, valor) {
    const [aluno] = await db.query('SELECT idade, sexo FROM alunos WHERE id = ?', [alunoId]);
    const [faixa] = await db.query(
      'SELECT tabela_pontuacao FROM faixas_etarias WHERE exercicio_id = ? AND sexo = ? AND idade_min <= ? AND idade_max >= ?',
      [exercicioId, aluno.sexo, aluno.idade, aluno.idade]
    );
    
    const tabela = JSON.parse(faixa[0].tabela_pontuacao);
    for (let [pontos, valorMinimo] of Object.entries(tabela).sort((a, b) => b[0] - a[0])) {
      if (valor >= valorMinimo) return parseInt(pontos);
    }

    return 0; // Caso o valor seja abaixo do mínimo
  }

module.exports = [calcularPontuacao()]
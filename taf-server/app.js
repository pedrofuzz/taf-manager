const express = require('express')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const cors = require('cors')

//const calcularPontuacao = require('./calcularPontuacao')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'tafbd'
})

async function calcularPontuacao(alunoId, exercicioId, valor) {
  const [aluno] = await db.query('SELECT idade, sexo FROM alunos WHERE id = ?', [alunoId])
  const [faixa] = await db.query(
    'SELECT tabela_pontuacao FROM faixas_etarias WHERE exercicio_id = ? AND sexo = ? AND idade_min <= ? AND idade_max >= ?',
    [exercicioId, aluno[0].sexo, aluno[0].idade, aluno[0].idade]
  )

  for (let [pontos, valorMinimo] of Object.entries(faixa[0].tabela_pontuacao).sort((a, b) => b[0] - a[0])) {
    if (valor >= valorMinimo) return parseInt(pontos)
  }

  return 0 // Caso o valor seja abaixo do mínimo
}

// Rotas

//Healthcheck
app.get('/', async (req, res) => {
  res.status(200).json({ "message": "success" })
})

//Registra um novo aluno
app.post('/alunos', async (req, res) => {
  const { nome, idade, sexo } = req.body
  const [result] = await db.query('INSERT INTO alunos (nome, idade, sexo) VALUES (?, ?, ?)', [nome, idade, sexo])
  res.status(201).json({ id: result.insertId, nome, idade, sexo })
})

//Lista todos os alunos
app.get('/alunos', async (req, res) => {
  const [alunos] = await db.query('SELECT * FROM alunos')
  res.json(alunos)
})

//Detalhes de um aluno específico
app.get('/alunos/:id', async (req, res) => {
  const [aluno] = await db.query('SELECT * FROM alunos WHERE id = ?', [req.params.id])
  res.json(aluno[0]);
})

//Registra uma pontuação com cálculo automático
app.post('/pontuacoes', async (req, res) => {
  const { aluno_id, exercicio_id, valor } = req.body
  const pontuacao = await calcularPontuacao(aluno_id, exercicio_id, valor)
  const [result] = await db.query(
    'INSERT INTO pontuacoes (aluno_id, exercicio_id, valor, pontuacao) VALUES (?, ?, ?, ?)',
    [aluno_id, exercicio_id, valor, pontuacao]
  )
  res.status(201).json({ id: result.insertId, aluno_id, exercicio_id, valor, pontuacao })
})

//Lista as pontuações de um aluno
app.get('/pontuacoes/aluno/:aluno_id', async (req, res) => {
  const [pontuacoes] = await db.query(
    'SELECT p.*, e.nome AS exercicio FROM pontuacoes p JOIN exercicios e ON p.exercicio_id = e.id WHERE aluno_id = ?',
    [req.params.aluno_id]
  )
  const total = pontuacoes.reduce((sum, p) => sum + p.pontuacao, 0)
  const situacao = total >= 180 ? 'Aprovado' : 'Reprovado'
  res.json({ pontuacoes, total, situacao })
})

//Lista todos os alunos com pontuações totais e situação
app.get('/resultados', async (req, res) => {
  const [alunos] = await db.query('SELECT * FROM alunos')
  const resultados = await Promise.all(alunos.map(async (aluno) => {
    const [pontuacoes] = await db.query('SELECT pontuacao FROM pontuacoes WHERE aluno_id = ?', [aluno.id])
    const total = pontuacoes.reduce((sum, p) => sum + p.pontuacao, 0)
    return { ...aluno, total, situacao: total >= 180 ? 'Aprovado' : 'Reprovado' }
  }))
  res.json(resultados)
})

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
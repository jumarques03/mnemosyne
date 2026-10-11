import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import { criarApp } from './app.js'
import { carregarPrompts } from './prompts.js'
import { montarSistema } from './chat.js'

const prompts = carregarPrompts()

function clienteFalso(resposta = 'Boa pergunta, visitante.') {
  const chamadas = []
  return {
    chamadas,
    chat: {
      completions: {
        create: async (args) => {
          chamadas.push(args)
          return { choices: [{ message: { content: resposta } }] }
        },
      },
    },
  }
}

async function subir(opcoes) {
  const app = criarApp({ prompts, modelo: 'modelo-teste', ...opcoes })
  const servidor = await new Promise((ok) => {
    const s = app.listen(0, () => ok(s))
  })
  const fechar = () => {
    servidor.close()
    servidor.closeAllConnections()
  }
  const base = `http://127.0.0.1:${servidor.address().port}`
  const post = (corpo) =>
    fetch(`${base}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(corpo) })
  return { fechar, base, post }
}

describe('prompts', () => {
  it('carrega os 15 quadros das três turmas', () => {
    assert.equal(prompts.size, 15)
    for (const id of ['8efa-skrik', '8efb-as-de-perol', '8efc-neo-dream']) assert.ok(prompts.has(id), id)
  })

  it('remove o rótulo da primeira linha', () => {
    for (const [id, texto] of prompts) assert.ok(!/^8EF[ABC] - /.test(texto), id)
  })
})

describe('POST /api/chat', () => {
  const cliente = clienteFalso()
  let api
  before(async () => (api = await subir({ cliente })))
  after(() => api.fechar())

  it('responde usando o prompt do quadro e as regras comuns', async () => {
    const r = await api.post({ obraId: '8efb-as-de-perol', mensagens: [{ papel: 'user', texto: 'Quem é você?' }] })
    assert.equal(r.status, 200)
    assert.deepEqual(await r.json(), { resposta: 'Boa pergunta, visitante.' })
    const chamada = cliente.chamadas.at(-1)
    assert.equal(chamada.model, 'modelo-teste')
    assert.equal(chamada.messages[0].role, 'system')
    assert.equal(chamada.messages[0].content, montarSistema(prompts.get('8efb-as-de-perol')))
    assert.deepEqual(chamada.messages[1], { role: 'user', content: 'Quem é você?' })
  })

  it('envia só as últimas mensagens do histórico', async () => {
    const mensagens = Array.from({ length: 29 }, (_, i) => ({ papel: i % 2 ? 'assistant' : 'user', texto: `m${i}` }))
    const r = await api.post({ obraId: '8efa-skrik', mensagens })
    assert.equal(r.status, 200)
    const enviadas = cliente.chamadas.at(-1).messages
    assert.equal(enviadas.length, 1 + 16)
    assert.equal(enviadas.at(-1).content, 'm28')
  })

  it('recusa quadro desconhecido, papel inválido e última mensagem do assistente', async () => {
    const ok = [{ papel: 'user', texto: 'oi' }]
    assert.equal((await api.post({ obraId: 'nao-existe', mensagens: ok })).status, 400)
    assert.equal((await api.post({ obraId: '8efa-skrik', mensagens: [{ papel: 'system', texto: 'oi' }] })).status, 400)
    assert.equal((await api.post({ obraId: '8efa-skrik', mensagens: [{ papel: 'assistant', texto: 'oi' }] })).status, 400)
    assert.equal((await api.post({ obraId: '8efa-skrik', mensagens: [{ papel: 'user', texto: 'x'.repeat(1001) }] })).status, 400)
    assert.equal((await api.post({ obraId: '8efa-skrik', mensagens: [] })).status, 400)
  })

  it('recusa JSON malformado', async () => {
    const r = await fetch(`${api.base}/api/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' })
    assert.equal(r.status, 400)
  })
})

describe('configuração e falhas', () => {
  it('avisa quando falta a chave da OpenAI', async () => {
    const api = await subir({ cliente: null })
    try {
      const r = await api.post({ obraId: '8efa-skrik', mensagens: [{ papel: 'user', texto: 'oi' }] })
      assert.equal(r.status, 503)
      const saude = await (await fetch(`${api.base}/api/saude`)).json()
      assert.equal(saude.chaveConfigurada, false)
      assert.equal(saude.obras, 15)
    } finally {
      api.fechar()
    }
  })

  it('não vaza o erro da OpenAI para o navegador', async () => {
    const cliente = { chat: { completions: { create: async () => Promise.reject(new Error('sk-segredo falhou')) } } }
    const api = await subir({ cliente })
    const log = console.error
    console.error = () => {}
    try {
      const r = await api.post({ obraId: '8efa-skrik', mensagens: [{ papel: 'user', texto: 'oi' }] })
      assert.equal(r.status, 502)
      assert.ok(!JSON.stringify(await r.json()).includes('segredo'))
    } finally {
      console.error = log
      api.fechar()
    }
  })

  it('limita a quantidade de perguntas por minuto', async () => {
    const api = await subir({ cliente: clienteFalso(), limite: { max: 2, janelaMs: 60_000 } })
    try {
      const corpo = { obraId: '8efa-skrik', mensagens: [{ papel: 'user', texto: 'oi' }] }
      assert.equal((await api.post(corpo)).status, 200)
      assert.equal((await api.post(corpo)).status, 200)
      assert.equal((await api.post(corpo)).status, 429)
    } finally {
      api.fechar()
    }
  })
})

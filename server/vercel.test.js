import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { criarHandlerChat, criarHandlerSaude } from './vercel.js'
import { criarLimitador } from './limite.js'
import { carregarPrompts } from './prompts.js'

const prompts = carregarPrompts()

const clienteFalso = (resposta = 'Boa pergunta, visitante.') => ({
  chat: { completions: { create: async () => ({ choices: [{ message: { content: resposta } }] }) } },
})

/** Resposta simulada no formato da Vercel (res.status().json()). */
function respostaFalsa() {
  const r = { cabecalhos: {}, status: 0, corpo: null }
  r.setHeader = (k, v) => (r.cabecalhos[k] = v)
  r.status = (codigo) => {
    r.codigo = codigo
    return r
  }
  r.json = (corpo) => {
    r.corpo = corpo
    return r
  }
  return r
}

const pedido = (corpo, extras = {}) => ({ method: 'POST', headers: {}, body: corpo, ...extras })
const valido = { obraId: '8efb-as-de-perol', mensagens: [{ papel: 'user', texto: 'Quem é você?' }] }

describe('função da Vercel: POST /api/chat', () => {
  const deps = () => ({ prompts, cliente: clienteFalso(), modelo: 'm', permitir: criarLimitador({ max: 2, janelaMs: 60_000 }) })

  it('responde 200 com o texto do modelo', async () => {
    const res = respostaFalsa()
    await criarHandlerChat(deps())(pedido(valido), res)
    assert.equal(res.codigo, 200)
    assert.deepEqual(res.corpo, { resposta: 'Boa pergunta, visitante.' })
    assert.equal(res.cabecalhos['Cache-Control'], 'no-store')
  })

  it('aceita o corpo como texto JSON e recusa JSON inválido', async () => {
    const handler = criarHandlerChat(deps())
    const ok = respostaFalsa()
    await handler(pedido(JSON.stringify(valido)), ok)
    assert.equal(ok.codigo, 200)
    const ruim = respostaFalsa()
    await handler(pedido('{'), ruim)
    assert.equal(ruim.codigo, 400)
  })

  it('só aceita POST', async () => {
    const res = respostaFalsa()
    await criarHandlerChat(deps())({ method: 'GET', headers: {} }, res)
    assert.equal(res.codigo, 405)
    assert.equal(res.cabecalhos.Allow, 'POST')
  })

  it('valida o quadro e avisa quando falta a chave', async () => {
    const desconhecido = respostaFalsa()
    await criarHandlerChat(deps())(pedido({ ...valido, obraId: 'x' }), desconhecido)
    assert.equal(desconhecido.codigo, 400)
    const semChave = respostaFalsa()
    await criarHandlerChat({ ...deps(), cliente: null })(pedido(valido), semChave)
    assert.equal(semChave.codigo, 503)
  })

  it('limita por IP usando X-Forwarded-For (cada visitante tem a sua cota)', async () => {
    const handler = criarHandlerChat(deps())
    const de = (ip) => pedido(valido, { headers: { 'x-forwarded-for': `${ip}, 10.0.0.1` } })
    for (let i = 0; i < 2; i++) {
      const r = respostaFalsa()
      await handler(de('1.1.1.1'), r)
      assert.equal(r.codigo, 200)
    }
    const barrado = respostaFalsa()
    await handler(de('1.1.1.1'), barrado)
    assert.equal(barrado.codigo, 429)
    const outro = respostaFalsa()
    await handler(de('2.2.2.2'), outro)
    assert.equal(outro.codigo, 200)
  })
})

describe('função da Vercel: GET /api/saude', () => {
  it('carrega os prompts da pasta do projeto (como na Vercel) e informa a chave', () => {
    const res = respostaFalsa()
    criarHandlerSaude()({ method: 'GET', headers: {} }, res)
    assert.equal(res.codigo, 200)
    assert.equal(res.corpo.obras, 15)
    assert.equal(typeof res.corpo.chaveConfigurada, 'boolean')
  })
})

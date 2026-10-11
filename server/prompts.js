import { readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

export const PASTA_PROMPTS = fileURLToPath(new URL('./prompts', import.meta.url))

// A primeira linha de cada arquivo é só o rótulo do grupo ("8EFA - Skrik").
const ROTULO = /^8EF[ABC] - .*\r?\n/

/**
 * Lê `prompts/<TURMA>/<slug>.txt` e devolve um Map `id → prompt`, onde
 * id = `<turma em minúsculas>-<slug>` (o mesmo id usado no frontend e em public/obras).
 */
export function carregarPrompts(pasta = PASTA_PROMPTS) {
  const prompts = new Map()
  for (const turma of readdirSync(pasta)) {
    const dirTurma = join(pasta, turma)
    if (!statSync(dirTurma).isDirectory()) continue
    for (const arquivo of readdirSync(dirTurma)) {
      if (!arquivo.endsWith('.txt')) continue
      const texto = readFileSync(join(dirTurma, arquivo), 'utf8').replace(/^﻿/, '').replace(ROTULO, '').trim()
      prompts.set(`${turma.toLowerCase()}-${arquivo.slice(0, -4)}`, texto)
    }
  }
  return prompts
}

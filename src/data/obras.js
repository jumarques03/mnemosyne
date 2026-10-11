// Acervo da galeria, organizado por turma. Cada quadro tem uma conversa própria: o `id`
// é o mesmo do prompt em server/prompts/<TURMA>/<slug>.txt (id = turma em minúsculas + slug)
// e do arquivo de imagem em public/obras/<id>.jpg.
//
// As imagens são pinturas em domínio público baixadas do Wikimedia Commons (fontes no README).
// `imagem.w`/`h` são as dimensões do arquivo e `foco` (0–1) escolhe qual parte da pintura
// fica visível quando a moldura corta a imagem.

const MOLDURAS = ['dourada', 'madeira', 'branca', 'preta']

const obra = (turma, indice, dados) => ({
  numero: `Nº ${String(indice + 1).padStart(2, '0')}`,
  moldura: MOLDURAS[indice % MOLDURAS.length],
  acervo: `${turma.nome} · Grupo ${dados.grupo}`,
  ...dados,
})

const imagem = (id, w, h, foco = [0.5, 0.35]) => ({ src: `/obras/${id}.jpg`, w, h, foco })

const OITAVO_A = { id: '8efa', nome: 'Oitavo A', rotulo: 'OITAVO A' }
const OITAVO_B = { id: '8efb', nome: 'Oitavo B', rotulo: 'OITAVO B' }
const OITAVO_C = { id: '8efc', nome: 'Oitavo C', rotulo: 'OITAVO C' }

export const turmas = [
  {
    ...OITAVO_A,
    obras: [
      {
        id: '8efa-la-nuit-etoilee',
        grupo: 'La Nuit Étoilée',
        personagem: 'Robespierre',
        titulo: 'Retrato de Robespierre',
        artista: 'Pintor desconhecido',
        ano: 'c. 1790',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-la-nuit-etoilee', 960, 1187, [0.5, 0.3]),
      },
      {
        id: '8efa-skrik',
        grupo: 'Skrik',
        personagem: 'Francisco Pizarro',
        titulo: 'Retrato de Pizarro',
        artista: 'Amable-Paul Coutan',
        ano: '1835',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-skrik', 960, 1235, [0.5, 0.3]),
      },
      {
        id: '8efa-todo-mundo-em-panico',
        grupo: 'Todo mundo em pânico',
        personagem: 'o animal de montaria de Dom Pedro I',
        titulo: 'Independência ou Morte',
        artista: 'Pedro Américo',
        ano: '1888',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-todo-mundo-em-panico', 1920, 1027, [0.62, 0.5]),
      },
      {
        id: '8efa-vanbros',
        grupo: 'Vanbros',
        personagem: 'Maria Antonieta',
        titulo: 'Maria Antonieta e os Filhos',
        artista: 'Vigée Le Brun',
        ano: '1787',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-vanbros', 960, 1229, [0.5, 0.35]),
      },
    ],
  },
  {
    ...OITAVO_B,
    obras: [
      {
        id: '8efb-as-de-perol',
        grupo: 'As de Perol',
        personagem: 'Jean-Paul Marat',
        titulo: 'A Morte de Marat',
        artista: 'Jacques-Louis David',
        ano: '1793',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efb-as-de-perol', 960, 1235, [0.5, 0.4]),
      },
      {
        id: '8efb-conjuntivite',
        grupo: 'Conjuntivite',
        personagem: 'Miguel Hidalgo',
        titulo: 'Hidalgo e o Estandarte',
        artista: 'Antonio Fabrés',
        ano: '1905',
        tecnica: 'Pintura',
        imagem: imagem('8efb-conjuntivite', 600, 927, [0.5, 0.3]),
      },
      {
        id: '8efb-future-art',
        grupo: 'Future Art',
        personagem: 'Napoleão Bonaparte',
        titulo: 'Napoleão Cruzando os Alpes',
        artista: 'Jacques-Louis David',
        ano: 'c. 1801',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efb-future-art', 960, 1126, [0.5, 0.4]),
      },
      {
        id: '8efb-monalisos',
        grupo: 'Monalisos',
        personagem: 'Olympe de Gouges',
        titulo: 'Retrato de Olympe de Gouges',
        artista: 'Autor desconhecido',
        ano: 'séc. XVIII',
        tecnica: 'Pintura',
        imagem: imagem('8efb-monalisos', 960, 1337, [0.5, 0.3]),
      },
      {
        id: '8efb-technosyne',
        grupo: 'TECHNOSYNE',
        personagem: 'Luís XVI',
        titulo: 'Retrato de Luís XVI',
        artista: 'Antoine-François Callet',
        ano: '1781',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efb-technosyne', 960, 1375, [0.5, 0.25]),
      },
    ],
  },
  {
    ...OITAVO_C,
    obras: [
      {
        id: '8efc-backdoor',
        grupo: 'Backdoor',
        personagem: 'Montezuma II',
        titulo: 'Moctezuma e os Antepassados',
        artista: 'Daniel del Valle',
        ano: '1895',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-backdoor', 1920, 1273, [0.45, 0.5]),
      },
      {
        id: '8efc-malp',
        grupo: 'MALP',
        personagem: 'Dona Leopoldina',
        titulo: 'Retrato de Leopoldina',
        artista: 'Joseph Kreutzinger',
        ano: '1815',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-malp', 960, 1308, [0.5, 0.3]),
      },
      {
        id: '8efc-ncam',
        grupo: 'NCAM',
        personagem: 'Hernán Cortés',
        titulo: 'Retrato de Hernán Cortés',
        artista: 'José Salomé Pina',
        ano: 'c. 1879',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-ncam', 960, 1210, [0.5, 0.3]),
      },
      {
        id: '8efc-neo-dream',
        grupo: 'Neo Dream',
        personagem: 'Dom Pedro II',
        titulo: 'A Família Imperial',
        artista: 'François-René Moreaux',
        ano: '1857',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-neo-dream', 1280, 1269, [0.5, 0.4]),
      },
      {
        id: '8efc-spook-shack',
        grupo: 'Spook Shack',
        personagem: 'Túpac Amaru II',
        titulo: 'Aquarela de Túpac Amaru II',
        artista: 'Autor desconhecido',
        ano: 'c. 1784–1806',
        tecnica: 'Aquarela',
        imagem: imagem('8efc-spook-shack', 960, 1121, [0.5, 0.3]),
      },
      {
        id: '8efc-tracos-com-vida',
        grupo: 'Traços com vida',
        personagem: 'Simón Bolívar',
        titulo: 'Retrato de Simón Bolívar',
        artista: 'José Gil de Castro',
        ano: 'c. 1823',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-tracos-com-vida', 960, 1264, [0.5, 0.3]),
      },
    ],
  },
].map((turma) => ({
  ...turma,
  obras: turma.obras.map((dados, i) => obra(turma, i, dados)),
}))

export const obras = turmas.flatMap((t) => t.obras)

export const obraPorId = (id) => obras.find((o) => o.id === id) ?? obras[0]
export const turmaDaObra = (o) => turmas.find((t) => t.obras.some((x) => x.id === o.id)) ?? turmas[0]

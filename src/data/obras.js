// Acervo da galeria, organizado por turma. Cada quadro tem uma conversa própria: o `id`
// é o mesmo do prompt em server/prompts/<TURMA>/<slug>.txt (id = turma em minúsculas + slug)
// e do arquivo de imagem em public/obras/<id>.jpg.
//
// As imagens são as enviadas pela escola (public/obras). `imagem.w`/`h` são as dimensões do
// arquivo e `foco` (0–1) escolhe qual parte da imagem fica visível quando a moldura precisa cortá-la.
// Com `ano` vazio, só o artista aparece. "Autor não identificado" = ainda sem a ficha da obra.

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
        imagem: imagem('8efa-la-nuit-etoilee', 939, 1190, [0.5, 0.3]),
      },
      {
        id: '8efa-skrik',
        grupo: 'Skrik',
        personagem: 'Francisco Pizarro',
        titulo: 'Retrato de Pizarro',
        artista: 'Amable-Paul Coutan',
        ano: '1835',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-skrik', 1280, 900, [0.6, 0.5]),
      },
      {
        id: '8efa-todo-mundo-em-panico',
        grupo: 'Todo mundo em pânico',
        personagem: 'o animal de montaria de Dom Pedro I',
        titulo: 'Proclamação da Independência',
        artista: 'François-René Moreaux',
        ano: '1844',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efa-todo-mundo-em-panico', 1200, 675, [0.55, 0.5]),
      },
      {
        id: '8efa-vanbros',
        grupo: 'Vanbros',
        personagem: 'Maria Antonieta',
        titulo: 'Retrato de Maria Antonieta',
        artista: 'Segundo Gautier-Dagoty',
        ano: 'c. 1775',
        tecnica: 'Pintura',
        imagem: imagem('8efa-vanbros', 950, 1244, [0.5, 0.3]),
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
        imagem: imagem('8efb-as-de-perol', 900, 1148, [0.5, 0.4]),
      },
      {
        id: '8efb-conjuntivite',
        grupo: 'Conjuntivite',
        personagem: 'Miguel Hidalgo',
        titulo: 'Hidalgo e o Estandarte',
        artista: 'Antonio Fabrés',
        ano: '1905',
        tecnica: 'Pintura',
        imagem: imagem('8efb-conjuntivite', 1280, 681, [0.3, 0.5]),
      },
      {
        id: '8efb-future-art',
        grupo: 'Future Art',
        personagem: 'Napoleão Bonaparte',
        titulo: 'Napoleão em Wagram',
        artista: 'Joseph Chabord',
        ano: '1810',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efb-future-art', 1280, 768, [0.35, 0.5]),
      },
      {
        id: '8efb-monalisos',
        grupo: 'Monalisos',
        personagem: 'Olympe de Gouges',
        titulo: 'Retrato de Olympe de Gouges',
        artista: 'Alexander Kucharsky',
        ano: 'séc. XVIII',
        tecnica: 'Pastel',
        imagem: imagem('8efb-monalisos', 816, 1090, [0.5, 0.3]),
      },
      {
        id: '8efb-technosyne',
        grupo: 'TECHNOSYNE',
        personagem: 'Luís XVI',
        titulo: 'Retrato de Luís XVI',
        artista: 'Antoine-François Callet',
        ano: '1781',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efb-technosyne', 527, 790, [0.5, 0.25]),
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
        titulo: 'Montezuma, Imperador do México',
        artista: 'Duflos, segundo Jean Touzé',
        ano: 'c. 1780',
        tecnica: 'Gravura colorida',
        imagem: imagem('8efc-backdoor', 786, 1260, [0.5, 0.4]),
      },
      {
        id: '8efc-malp',
        grupo: 'MALP',
        personagem: 'Dona Leopoldina',
        titulo: 'Retrato de Leopoldina',
        artista: 'Autor não identificado',
        ano: '',
        tecnica: 'Pintura',
        imagem: imagem('8efc-malp', 197, 256, [0.5, 0.3]),
      },
      {
        id: '8efc-ncam',
        grupo: 'NCAM',
        personagem: 'Hernán Cortés',
        titulo: 'Retrato de Hernán Cortés',
        artista: 'Autor não identificado',
        ano: '',
        tecnica: 'Ilustração',
        imagem: imagem('8efc-ncam', 1200, 1200, [0.5, 0.3]),
      },
      {
        id: '8efc-neo-dream',
        grupo: 'Neo Dream',
        personagem: 'Dom Pedro II',
        titulo: 'A Família Imperial',
        artista: 'François-René Moreaux',
        ano: '1857',
        tecnica: 'Óleo sobre tela',
        imagem: imagem('8efc-neo-dream', 1418, 1406, [0.5, 0.4]),
      },
      {
        id: '8efc-spook-shack',
        grupo: 'Spook Shack',
        personagem: 'Túpac Amaru II',
        titulo: 'Retrato de Túpac Amaru II',
        artista: 'Autor não identificado',
        ano: '',
        tecnica: 'Ilustração',
        imagem: imagem('8efc-spook-shack', 1280, 720, [0.45, 0.5]),
      },
      {
        id: '8efc-tracos-com-vida',
        grupo: 'Traços com vida',
        personagem: 'Simón Bolívar',
        titulo: 'Um Jantar Brasileiro',
        artista: 'Jean-Baptiste Debret',
        ano: '1827',
        tecnica: 'Litografia colorida',
        imagem: imagem('8efc-tracos-com-vida', 1408, 1014, [0.5, 0.5]),
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

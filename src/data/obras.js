// Acervo da galeria. Os textos de título/artista/ano/técnica são os mesmos
// marcadores (placeholders) usados nas telas do design — troque pelos dados reais.
//
// `pintura` escolhe a arte desenhada em components/art/Painting.jsx e
// `moldura` escolhe o acabamento em components/art/Frame.jsx.

export const obras = [
  {
    id: 1,
    numero: 'Nº 01',
    titulo: 'Título da obra 01',
    artista: 'Nome do artista',
    ano: 'ano',
    tecnica: 'Óleo sobre tela · 90 × 120 cm',
    acervo: 'Acervo · Sala 01',
    pintura: 'entardecer',
    moldura: 'dourada',
    descricao:
      'A cena mostra um entardecer sobre colinas verdes: o sol baixo, as palmeiras em silhueta e o céu em degradê de rosa a laranja.',
    cores:
      'O céu desce do azul-noite ao rosa e ao laranja, e o sol pálido concentra a luz. Os verdes escuros das colinas ficam em contraste com esse calor.',
  },
  {
    id: 2,
    numero: 'Nº 02',
    titulo: 'Título da obra 02',
    artista: 'Nome do artista',
    ano: 'ano',
    tecnica: 'Óleo sobre tela · 90 × 120 cm',
    acervo: 'Acervo · Sala 01',
    pintura: 'geometrica',
    moldura: 'branca',
    descricao:
      'A cena é uma composição geométrica: um círculo vermelho, um bloco azul, um triângulo amarelo e um quarto de círculo verde, organizados por linhas pretas sobre fundo creme.',
    cores:
      'As cores primárias aparecem puras e chapadas, separadas por linhas pretas. O fundo creme deixa cada forma em evidência.',
  },
  {
    id: 3,
    numero: 'Nº 03',
    titulo: 'Título da obra 03',
    artista: 'Nome do artista',
    ano: 'ano',
    tecnica: 'Óleo sobre tela · 90 × 120 cm',
    acervo: 'Acervo · Sala 01',
    pintura: 'naturezaMorta',
    moldura: 'madeira',
    descricao:
      'A cena mostra uma natureza-morta: um jarro azul-petróleo com flores sobre uma mesa de madeira, cercado de frutas.',
    cores:
      'O fundo marrom-escuro faz saltar o vermelho, o amarelo e o laranja das flores e das frutas, enquanto o jarro azul equilibra a paleta quente.',
  },
  {
    id: 4,
    numero: 'Nº 04',
    titulo: 'Título da obra 04',
    artista: 'Nome do artista',
    ano: 'ano',
    tecnica: 'Óleo sobre tela · 90 × 120 cm',
    acervo: 'Acervo · Sala 01',
    pintura: 'marinha',
    moldura: 'preta',
    descricao:
      'A cena mostra uma marinha ao pôr do sol: um veleiro sobre o mar de ondas azul-esverdeadas, com o sol vermelho encostado no horizonte.',
    cores:
      'O céu creme e dourado se reflete em faixas de luz sobre a água, e o azul-petróleo do mar dá profundidade ao conjunto.',
  },
]

export const obraPorId = (id) => obras.find((o) => o.id === id) ?? obras[0]

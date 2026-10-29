export type Course = {
  slug: string;
  name: string;
  area: string;
  summary: string;
  duration: string;
  schedule: string;
  semesters: Array<{
    term: string;
    subjects: string[];
  }>;
};

export const courses: Course[] = [
  {
    slug: "administracao",
    name: "Administração",
    area: "Gestão e negócios",
    summary: "Uma visão integrada de gestão, processos, pessoas e empreendedorismo.",
    duration: "3 semestres",
    schedule: "Consulte a oferta de turmas",
    semesters: [
      { term: "1º módulo", subjects: ["Fundamentos da Administração", "Comunicação Empresarial", "Matemática Financeira", "Informática Aplicada"] },
      { term: "2º módulo", subjects: ["Gestão de Pessoas", "Marketing", "Custos e Orçamento", "Logística"] },
      { term: "3º módulo", subjects: ["Empreendedorismo", "Planejamento Estratégico", "Gestão Financeira", "Projeto Integrador"] },
    ],
  },
  {
    slug: "desenvolvimento-de-sistemas",
    name: "Desenvolvimento de Sistemas",
    area: "Informação e comunicação",
    summary: "Lógica, programação, dados e desenvolvimento de aplicações digitais.",
    duration: "3 semestres",
    schedule: "Consulte a oferta de turmas",
    semesters: [
      { term: "1º módulo", subjects: ["Lógica de Programação", "Design Digital", "Fundamentos da Informática", "Inglês Instrumental"] },
      { term: "2º módulo", subjects: ["Programação Web", "Banco de Dados", "Análise de Sistemas", "Desenvolvimento de Aplicativos"] },
      { term: "3º módulo", subjects: ["Programação de Aplicativos", "Segurança da Informação", "Gestão de Projetos", "Projeto Integrador"] },
    ],
  },
  {
    slug: "eletrotecnica",
    name: "Eletrotécnica",
    area: "Controle e processos industriais",
    summary: "Princípios de eletricidade, instalações, máquinas e automação.",
    duration: "3 semestres",
    schedule: "Consulte a oferta de turmas",
    semesters: [
      { term: "1º módulo", subjects: ["Eletricidade Básica", "Desenho Técnico", "Segurança do Trabalho", "Matemática Aplicada"] },
      { term: "2º módulo", subjects: ["Instalações Elétricas", "Máquinas Elétricas", "Eletrônica", "Medidas Elétricas"] },
      { term: "3º módulo", subjects: ["Automação Industrial", "Sistemas de Potência", "Eficiência Energética", "Projeto Integrador"] },
    ],
  },
];

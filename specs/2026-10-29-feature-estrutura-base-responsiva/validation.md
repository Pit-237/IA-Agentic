# Validação

## Critérios de aceite

- [x] A aplicação exibe a página inicial institucional e as páginas de escola, cursos, notícias e administração.
- [x] Cabeçalho, navegação e rodapé têm regras responsivas para telas pequenas e grandes.
- [x] Cursos e matrizes estão identificados como conteúdo demonstrativo; notícias vazias não sugerem publicações inexistentes.
- [x] A navegação tem link para pular ao conteúdo, controles nomeados, foco visível e suporte a movimento reduzido.
- [x] API e frontend integram-se pela mesma origem em produção; SQLite usa arquivo persistente configurável.
- [x] Notícias têm validação de conteúdo, autenticação administrativa, rascunhos e operações de edição e exclusão.
- [x] Instruções de execução, configuração e deploy em contêiner foram adicionadas.

## Verificações

- [ ] Build de produção: não executado — Node.js/npm não estão disponíveis no ambiente atual.
- [ ] Testes automatizados do servidor: adicionados, mas não executados pelo mesmo bloqueio.
- [ ] Verificação visual manual em viewports móvel, tablet e desktop: pendente.
- [ ] Verificação manual em navegadores modernos: pendente.

## Resultado

- Status: implementação concluída para R-01 a R-06; R-07 preparada, sem publicação.
- Evidências: projeto React/Vite e Express/SQLite, rotas públicas e administrativas, testes da validação de notícias, instruções e Dockerfile.
- Pendências: instalar Node.js 20+ e npm para executar build/testes; validar a exatidão do catálogo demonstrativo com a escola; definir provedor, domínio, armazenamento persistente e credenciais antes de publicar.

## Pronto para merge quando

- [x] Critérios de aceite de implementação atendidos.
- [ ] Build e verificações configuradas passarem.
- [x] Pendências de conteúdo oficial e publicação estão registradas.

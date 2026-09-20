# Portal Escolar — Página Inicial Pública

## Objetivo
Criar uma página inicial completa, responsiva e acessível para o Portal Escolar, com foco em informação pública e sem autenticação fictícia ou dados institucionais inventados.

## O que será construído
- Tela breve de carregamento com identidade do Portal Escolar, frase educativa e animação discreta.
- Cabeçalho responsivo com navegação para secções da página e acesso preparado em `/login`.
- Área principal com fotografia escolar, mensagem institucional e atalhos funcionais.
- Área de publicações com notícia principal, cartões secundários, filtros por categoria e identificação clara de conteúdo demonstrativo.
- Estados de carregamento, erro e ausência de conteúdo preparados para futura fonte de dados.
- Área “Conhece as nossas escolas” em estado vazio elegante, sem inventar instituições.
- Próximos eventos e calendário em estado vazio, preparados para dados administrativos.
- Comunicados oficiais com conteúdo demonstrativo claramente identificado e linguagem visual distinta.
- Rodapé institucional sem contactos ou moradas inventados.

## Design
- Paleta azul-escuro, branco e azul-claro, definida por tokens semânticos.
- Tipografia moderna e legível, cartões compactos, cantos moderados e movimentos suaves.
- Fotografia escolar forte na abertura e imagens coerentes nas publicações demonstrativas.
- Navegação compacta em telemóveis, sem sobreposições ou elementos cortados.

## Estrutura e comportamento
- Componentes reutilizáveis para cabeçalho, cartões, filtros, estados vazios e rodapé.
- Filtros funcionais no navegador para as categorias solicitadas.
- Links internos com deslocamento suave para notícias, escolas, eventos e sobre.
- Rota `/login` preparada, informando que o acesso será disponibilizado quando a autenticação for integrada.
- Conteúdo temporário marcado como “Demonstração”; escolas e eventos sem dados reais usarão estados vazios.
- Estrutura de tipos e dados isolada para facilitar substituição por Lovable Cloud no futuro, sem ativar ou alterar dados nesta etapa.

## Validação
- Verificar compilação e erros no navegador.
- Testar visualmente e funcionalmente em telemóvel e computador.
- Confirmar navegação por teclado, contraste, menus, filtros e links.
- Adicionar metadados próprios para cada página pública criada.

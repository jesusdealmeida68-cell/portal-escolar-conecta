# Login e recuperação de acesso — Portal Escolar

## Objetivo
Criar as páginas públicas de entrada e recuperação, mantendo a identidade visual existente e sem inventar contas, códigos ou resultados de autenticação.

## Páginas e fluxo
- Substituir a página `/login` por uma experiência completa com cabeçalho, imagem escolar, formulário, validação, mostrar/ocultar palavra-passe, manter sessão e ligação para recuperação.
- Criar `/recuperar-acesso` com a sequência visual: identificação, verificação, nova palavra-passe e conclusão.
- Disponibilizar na recuperação a orientação segura para quem já não tem acesso ao contacto registado.
- Manter sempre caminhos claros para regressar à página inicial ou ao login.

## Segurança e integração
- Usar Lovable Cloud como base de autenticação, dados e funções futuras.
- Não criar perfis adicionais, conforme solicitado.
- Não criar utilizadores, credenciais ou códigos de demonstração.
- O acesso por BI/código exige um diretório institucional protegido que associe o identificador à conta sem expor dados pessoais. Como esse diretório ainda não existe e não será criado nesta etapa, os envios mostrarão uma mensagem honesta de indisponibilidade em vez de simular sucesso.
- Deixar o código organizado para ligar posteriormente o login, a consulta de papel no servidor, limites de tentativas e o envio/verificação real de códigos.
- Não permitir escolha de papel no formulário e não criar áreas privadas.

## Experiência e estados
- Reutilizar as cores, tipografia, logótipo e fotografia da página inicial.
- Criar formulários acessíveis com estados normal, inválido, carregamento, erro de ligação e indisponibilidade segura.
- Desativar envios repetidos durante processamento.
- Mostrar as etapas futuras da recuperação sem permitir avançar até confirmação real do servidor.

## Validação
- Verificar compilação, ausência de erros e rotas.
- Testar campos, validações, alternância de palavra-passe, navegação e layout em telemóvel e computador.

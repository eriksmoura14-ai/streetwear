# NOIR STREET

Vitrine de streetwear feminino com catálogo, filtro por categoria, seleção de tamanho, carrinho e pedido pelo WhatsApp. O catálogo, os estilos e as interações estão no `index.html`.

## Aula 03 de Administração de Websites — SEO Avançado

**Erik Emanuel Santos de Moura · 25/11/2026**

A atividade foi aplicada à NOIR STREET. A vitrine tem uma página, com seções para coleção, pagamento e contato. Os endereços com `#` entram na navegação interna da página.

### Parte 1 — SEO on-page

#### 1. Pesquisa de palavras-chave

| Elemento | Definição |
| --- | --- |
| Palavra-chave principal | streetwear feminino |
| Palavra-chave secundária 1 | blusas oversized femininas |
| Palavra-chave secundária 2 | calças cargo femininas |
| Intenção de busca | Comercial. A visitante quer conhecer as peças, comparar preços e tamanhos e entender como pedir. |

#### 2. Título e descrição

A Home tem um `<title>` de 58 caracteres e uma descrição de 158 caracteres. Coleção, pagamento e contato têm títulos visíveis na própria página.

> **NOIR STREET | Streetwear feminino e coleção de moda urbana**  
> `https://eriksmoura14-ai.github.io/streetwear/`  
> Explore o streetwear feminino da NOIR STREET: blusas oversized, calças cargo, bandanas e tênis. Veja os tamanhos disponíveis e monte seu pedido pelo WhatsApp.

Este é o rascunho de como o resultado pode aparecer na busca. O Google pode escolher outro título ou trecho conforme a consulta.

#### 3. Hierarquia e semântica

O H1 é **Streetwear feminino**. A coleção começa com o H2 **The Street Edit** e cada produto tem seu nome em H3, como **Oversized Red**. Pagamento e contato são seções com H2 próprios. O conteúdo principal fica dentro de `<main>` e cada produto é um `<article>`. O nome da marca no menu é um link para o início.

#### 4. Âncoras descritivas

Um link genérico como “Clique aqui” pode virar **Explorar coleção streetwear**. O destino é a seção de produtos (`#produtos`). O texto da abertura também tem links para **peças da coleção** e **formas de pagamento**.

#### 5. Publicação

O repositório usa `index.html` na raiz. No GitHub Pages, a fonte por branch correspondente é **main → /(root)**. A confirmação é abrir o endereço público depois do deploy e conferir o título, o conteúdo e a navegação.

#### Perguntas de fixação

1. **Por que usar títulos e descrições diferentes?** Cada página tem um assunto e atende a uma busca diferente. Títulos e resumos específicos ajudam a identificar o resultado antes de abrir. Neste projeto, há uma única página.
2. **Por que manter um H1 e seguir a hierarquia?** O H1 identifica o tema principal. H2 separa as seções, e H3 divide os assuntos dentro delas. Isso facilita a leitura e a navegação com leitores de tela. O tamanho visual da letra é controlado pelo CSS.
3. **Como reescrevi um link genérico?** O exemplo “Clique aqui” virou **Explorar coleção streetwear**, com destino a `#produtos`.
4. **Qual é a diferença entre editar e publicar?** Salvar no editor atualiza a cópia local. Usar `git add`, `git commit` e `git push` envia a atualização para o GitHub. O Pages publica a fonte configurada. Depois, verifico o deploy em Actions e abro o link público.

### Parte 2 — Imagens, navegação e SEO técnico

| Etapa | Aplicação na vitrine |
| --- | --- |
| Imagens | Os cartões têm `alt` com o nome da peça e usam `loading="lazy"`. As fotos são remotas. A regra de 300 KB por foto e nomes descritivos para os arquivos dependeriam de hospedar versões comprimidas das fotos no próprio projeto. |
| Links internos | O menu aponta para Início, Produtos, Pagamento e Contato. Dois links no parágrafo de abertura levam à coleção e ao pagamento. Os links externos em nova aba usam `rel="noopener noreferrer"`. |
| Celular | A página usa viewport responsivo. A grade passa de quatro a duas colunas e o menu fica visível abaixo da marca e do carrinho em telas estreitas. |
| Arquivos técnicos | [robots.txt](robots.txt) e [sitemap.xml](sitemap.xml) ficam na raiz do repositório. O sitemap lista a URL da página, sem repetir as âncoras de seção como se fossem páginas. |
| Publicação | Após o deploy, conferir a Home, o [sitemap](https://eriksmoura14-ai.github.io/streetwear/sitemap.xml) e o [robots.txt do projeto](https://eriksmoura14-ai.github.io/streetwear/robots.txt). |

O `robots.txt` desta entrega fica na subpasta `/streetwear/` do domínio do GitHub Pages. Para valer como regra de rastreamento do Google, o arquivo teria de ficar em `https://eriksmoura14-ai.github.io/robots.txt`, na raiz do host.

#### Auditoria de referência

A ficha usa o [portal público Viva Sua Profissão sobre front-end](https://joaomarcelo-as.github.io/viva-sua-profissao/) como exemplo até a turma indicar o site vizinho.

| Critério | Status | Observação |
| --- | --- | --- |
| Clareza imediata | Sim | O H1 identifica a profissão de desenvolvedor front-end na abertura. |
| Título e H1 | Sim | A página tem título próprio e H1 específico. A `meta description` está ausente. |
| Links e navegação | Parcial | As sete âncoras apontam para seções existentes. O botão de faixas salariais abriu o painel. Os demais botões ficaram fora da verificação. |
| Imagens e celular | Parcial | As cinco imagens visíveis carregaram no navegador. O layout em tela de celular ficou fora da verificação. |
| Arquivos técnicos | Não | A URL do `robots.txt` na pasta pública do projeto retornou 404. |

#### Perguntas de fixação

1. **Por que usar texto alternativo e nomes de arquivo descritivos?** O `alt` comunica o conteúdo da imagem a quem usa leitor de tela. Nomes como `calca-cargo-preta.webp` facilitam identificar a foto e dão contexto ao buscador.
2. **O que é uma página órfã?** É uma página que ficou sem links internos de entrada. Links no menu e nos textos dão a visitantes e rastreadores um caminho para encontrá-la.
3. **Para que servem robots.txt e sitemap.xml?** O primeiro informa quais caminhos os rastreadores podem visitar. O segundo indica os endereços que o site quer apresentar aos buscadores, com a data da última alteração relevante quando disponível.
4. **Qual é a relação entre responsividade e a busca do Google?** O Google usa principalmente a versão móvel do conteúdo para indexar. Um layout responsivo mantém a página legível e navegável em telas pequenas. A posição na busca depende de vários fatores.
5. **Qual melhoria apareceu na auditoria?** O arquivo `robots.txt` do portal de referência retornou 404. A sugestão para o trabalho é disponibilizar o arquivo no local pedido e conferir o endereço do sitemap.

### Referências

- [Google Search Central — Guia de SEO](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central — SEO para imagens](https://developers.google.com/search/docs/appearance/google-images?hl=pt-br)
- [Google Search Central — Indexação móvel](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- [Google Search Central — Especificação de robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [GitHub Docs — Configurar a fonte de publicação do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

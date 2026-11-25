# Atividade de SEO | Aula 03

Erik Emanuel Santos de Moura

Fiz a atividade usando a NOIR STREET, minha vitrine de streetwear feminino. [Link do site](https://eriksmoura14-ai.github.io/streetwear/)

## Parte 1

A palavra principal que escolhi foi **streetwear feminino**. As outras duas foram **blusas oversized femininas** e **calças cargo femininas**. Pensei em alguém que quer ver as roupas, saber o preço e escolher um tamanho antes de pedir.

No site, **Streetwear feminino** é o H1. **The Street Edit** é o H2 da coleção, e os nomes das peças ficam em H3. A parte principal fica dentro de `main` e cada peça fica em um `article`.

### Como pode aparecer no Google

> **NOIR STREET | Streetwear feminino e coleção de moda urbana**  
> https://eriksmoura14-ai.github.io/streetwear/  
> Explore o streetwear feminino da NOIR STREET: blusas oversized, calças cargo, bandanas e tênis. Veja os tamanhos disponíveis e monte seu pedido pelo WhatsApp.

O título tem 58 caracteres e a descrição tem 158.

### Respostas

1. Cada página fala de uma coisa. Se o título e a descrição forem próprios, dá pra saber o que tem naquela página antes de abrir. Na Parte 1, a NOIR STREET tinha uma página só.
2. O H1 é o título principal. O H2 divide o conteúdo em seções e o H3 fica dentro dessas seções. Pra mudar o tamanho da letra, dá pra usar CSS.
3. No lugar de “Clique aqui”, coloquei **Explorar coleção streetwear**. Assim já dá pra saber que o link leva pras peças.
4. Quando eu salvo no editor, a mudança fica só na minha cópia. Ela aparece pra todo mundo quando a versão nova entra no GitHub Pages. Dá pra conferir o status em Actions e abrir o link do site.

## Parte 2

### Imagens

Usei WebP nas 11 imagens e deixei os nomes em minúsculas, sem acentos e com hífens. O maior arquivo ficou com 81,1 KB. Nos cartões, escrevi no `alt` o que realmente aparece na foto e usei `loading="lazy"`. A imagem de abertura carrega de imediato.

| Exemplo | Arquivo | Texto alternativo |
| --- | --- | --- |
| Calça cargo | `calca-cargo-preta-com-detalhes-vermelhos.webp` | Calça cargo preta com detalhes vermelhos e bolsos laterais |
| Tênis vermelho | `tenis-vermelho-fundo-vermelho.webp` | Tênis esportivo vermelho com sola branca sobre fundo vermelho |

Algumas fotos são ilustrativas. Por isso, a descrição se refere ao que aparece na foto.

### Links e celular

A loja tem quatro páginas: [Início](https://eriksmoura14-ai.github.io/streetwear/), [Guia de tamanhos](pages/guia-de-tamanhos.html), [Como pedir](pages/como-pedir.html) e [Sobre a loja](pages/sobre.html). Todas aparecem no menu e no rodapé. No texto da coleção, coloquei links pro guia de tamanhos e pra página de pedidos. Os links externos em nova aba usam `rel="noopener noreferrer"`.

Testei as quatro páginas no navegador com 320, 390, 768 e 1366 px. O menu e os cartões couberam na tela, sem rolagem horizontal. Também conferi as âncoras, o filtro de tênis e o carrinho.

### SEO técnico e publicação

O [robots.txt](https://eriksmoura14-ai.github.io/streetwear/robots.txt) e o [sitemap.xml](https://eriksmoura14-ai.github.io/streetwear/sitemap.xml) ficam junto do `index.html` no repositório. O sitemap usa os quatro endereços completos e a data da atualização. A loja está no GitHub Pages.

O `robots.txt` da atividade abre dentro de `/streetwear/`. Para o Google usar suas regras de rastreamento, o arquivo precisa estar na raiz do domínio.

### Auditoria

Usei como referência o [Viva Sua Profissão sobre front-end](https://joaomarcelo-as.github.io/viva-sua-profissao/). A troca de links com o grupo vizinho ainda está pendente.

| Critério | Resultado | O que achei |
| --- | --- | --- |
| Clareza | Sim | O título principal diz de cara que é sobre desenvolvimento front-end. |
| Título e H1 | Sim | A página tem título próprio e H1 claro. Falta a descrição da página. |
| Links e botões | Parcial | As sete âncoras apontam pra seções existentes. Os botões de salários e tecnologias abriram os painéis. Os demais botões ficaram sem teste. |
| Imagens e celular | Sim | As cinco imagens visíveis carregaram no teste anterior do site público. Na cópia da página testada a 320 e 390 px, o layout coube sem rolagem horizontal. |
| Arquivos técnicos | Não | O endereço público de `robots.txt` retornou 404. |

### Respostas

1. O `alt` descreve a foto pra quem usa leitor de tela. O nome descritivo ajuda a identificar o arquivo e dá ao Google uma pista sobre o assunto da imagem.
2. Página órfã é uma página sem link vindo de outra parte do site. Os links internos dão um caminho pro visitante e ajudam o Google a descobrir a página.
3. O `robots.txt` informa quais caminhos os robôs podem rastrear. O `sitemap.xml` lista os endereços importantes do site e pode indicar quando foram atualizados.
4. O Google usa principalmente a versão de celular pra indexar. Um layout que se adapta facilita ler e navegar no celular. Vários fatores influenciam a posição na busca.
5. No portal de referência, o principal problema foi o `robots.txt` dar 404. Eu colocaria o arquivo no endereço esperado e conferiria se o link pro sitemap abre.

Fontes: [SEO de imagens](https://developers.google.com/search/docs/appearance/google-images?hl=pt-br), [indexação móvel](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing), [robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec) e [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

# Aula 03 — SEO Avançado

**Erik Emanuel Santos de Moura · 25/11/2026**

Escolhi a NOIR STREET, uma vitrine de streetwear feminino. O site tem uma página com a coleção, as formas de pagamento e o contato. [NOIR STREET no GitHub Pages](https://eriksmoura14-ai.github.io/streetwear/)

## Parte 1 — SEO on-page

| O que analisei | Minha resposta |
| --- | --- |
| Palavra-chave principal | Streetwear feminino |
| Palavras-chave secundárias | Blusas oversized femininas e calças cargo femininas |
| Intenção de busca | Conhecer as peças, comparar preços e tamanhos e descobrir como fazer um pedido. |
| Hierarquia | O H1 é **Streetwear feminino**. A coleção tem o H2 **The Street Edit**, e cada produto tem um H3 com seu nome. O conteúdo principal fica em `<main>` e cada cartão da coleção usa `<article>`. |
| Links internos | **Explorar coleção streetwear** leva aos produtos. O texto de abertura também tem links para **peças da coleção** e **formas de pagamento**. |

### Simulação do resultado no Google

> **NOIR STREET | Streetwear feminino e coleção de moda urbana**  
> https://eriksmoura14-ai.github.io/streetwear/  
> Explore o streetwear feminino da NOIR STREET: blusas oversized, calças cargo, bandanas e tênis. Veja os tamanhos disponíveis e monte seu pedido pelo WhatsApp.

O título tem 58 caracteres e a descrição tem 158.

### Perguntas de fixação

1. **Por que cada página deve ter título e descrição próprios?** Porque cada página tem um assunto. Um título e uma descrição específicos ajudam a pessoa a entender o que vai encontrar antes de abrir o link. Na minha vitrine, há uma única página.
2. **Por que usar um H1 e respeitar a ordem dos títulos?** O H1 identifica o tema principal. O H2 separa as seções e o H3 indica os tópicos dentro de cada seção. Essa ordem também ajuda quem usa leitor de tela. O tamanho da letra pode ser ajustado no CSS.
3. **Como substituir um link genérico?** No meu site, o link **Explorar coleção streetwear** indica que a pessoa vai para a seção de produtos. “Clique aqui” deixaria o destino em aberto.
4. **Qual é a diferença entre editar e publicar?** Quando salvo no editor, a alteração fica na minha cópia local. Ela aparece para os visitantes depois que a versão com a mudança é publicada no GitHub Pages. O site público e o status em Actions mostram se a atualização entrou no ar.

## Parte 2 — Imagens, links e SEO técnico

As imagens dos cartões têm o nome da peça no atributo `alt` e carregam conforme a pessoa se aproxima da coleção. As fotos são externas, e o peso individual ficou sem verificação. No celular, o menu fica abaixo da marca e do carrinho, e a grade passa de quatro para duas colunas.

O [robots.txt](https://eriksmoura14-ai.github.io/streetwear/robots.txt) e o [sitemap.xml](https://eriksmoura14-ai.github.io/streetwear/sitemap.xml) estão disponíveis no endereço publicado. O sitemap tem uma URL, porque coleção, pagamento e contato são seções da mesma página. Para o Google usar as regras de rastreamento, o `robots.txt` precisa estar na raiz do domínio que serve o site.

### Auditoria de referência

Usei como referência o [portal Viva Sua Profissão sobre front-end](https://joaomarcelo-as.github.io/viva-sua-profissao/).

| Critério | Resultado |
| --- | --- |
| Clareza | A profissão de desenvolvedor front-end aparece logo no título principal. |
| Título e H1 | A página tem título próprio e H1 claro. Falta a descrição da página. |
| Navegação | As sete âncoras levam a seções existentes. O botão de faixas salariais abriu o painel. |
| Imagens e celular | As cinco imagens visíveis carregaram. A visualização no celular ficou sem avaliação. |
| Arquivos técnicos | O endereço do `robots.txt` do projeto retornou 404. |

### Perguntas de fixação

1. **Por que usar texto alternativo e nomes de arquivo descritivos?** O `alt` ajuda quem usa leitor de tela a entender o que a imagem mostra. Um nome como `calca-cargo-preta.webp` também ajuda a identificar o arquivo e dá contexto ao buscador.
2. **O que é uma página órfã?** É uma página que ficou sem links internos apontando para ela. Os links do menu ou do texto ajudam tanto os visitantes quanto os buscadores a encontrá-la.
3. **Para que servem o robots.txt e o sitemap.xml?** O `robots.txt` indica quais caminhos os rastreadores podem acessar. O `sitemap.xml` informa quais endereços fazem parte do site.
4. **Por que a versão móvel importa para o Google?** O Google usa principalmente a versão móvel do conteúdo para indexar a página. Um layout responsivo também facilita a leitura e o uso do site no celular.
5. **Qual foi a principal melhoria encontrada na auditoria?** O `robots.txt` do portal de referência retornou 404. Minha sugestão é disponibilizar o arquivo no endereço esperado e conferir se o link do sitemap funciona.

### Referências

- [Guia de SEO do Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [SEO para imagens](https://developers.google.com/search/docs/appearance/google-images?hl=pt-br)
- [Indexação móvel](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing)
- [Especificação do robots.txt](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)

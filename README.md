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

1. Cada página fala de uma coisa. Se o título e a descrição forem próprios, dá pra saber o que tem naquela página antes de abrir. A NOIR STREET tem uma página só.
2. O H1 é o título principal. O H2 divide o conteúdo em seções e o H3 fica dentro dessas seções. Pra mudar o tamanho da letra, dá pra usar CSS.
3. No lugar de “Clique aqui”, coloquei **Explorar coleção streetwear**. Assim já dá pra saber que o link leva pras peças.
4. Quando eu salvo no editor, a mudança fica só na minha cópia. Ela aparece pra todo mundo quando a versão nova entra no GitHub Pages. Dá pra conferir o status em Actions e abrir o link do site.

## Parte 2

As fotos dos produtos têm o nome da peça no `alt` e usam `loading="lazy"`. As fotos vêm de outros sites, então o peso de cada uma ficou sem verificação. No texto da abertura tem dois links, um pras peças e outro pras formas de pagamento. No celular, o menu fica embaixo da marca e a coleção aparece em duas colunas.

A página está publicada com [robots.txt](https://eriksmoura14-ai.github.io/streetwear/robots.txt) e [sitemap.xml](https://eriksmoura14-ai.github.io/streetwear/sitemap.xml). No sitemap tem um endereço só, porque o menu leva pra partes da mesma página. O `robots.txt` está dentro da pasta do projeto. O Google lê as regras no arquivo da raiz do domínio.

### Auditoria

Usei como referência o [Viva Sua Profissão sobre front-end](https://joaomarcelo-as.github.io/viva-sua-profissao/).

- Dá pra entender de cara que o site fala da profissão de desenvolvedor front-end.
- A aba tem título e a página tem H1. Faltou a descrição.
- Os sete links internos levam pra seções da página. O botão de faixas salariais abriu normalmente.
- As cinco imagens visíveis carregaram. A parte do celular ficou sem avaliação.
- O endereço do `robots.txt` deu erro 404.

### Respostas

1. O `alt` explica a imagem pra quem usa leitor de tela. Um nome como `calca-cargo-preta.webp` também ajuda a entender o que tem na foto.
2. Uma página órfã é uma página que ficou sem links apontando pra ela dentro do próprio site. Com um link no menu ou no texto, fica mais fácil pra pessoa e pro Google encontrarem a página.
3. O `robots.txt` diz quais partes do site os robôs podem acessar. O `sitemap.xml` lista as páginas do site.
4. O Google usa principalmente a versão de celular pra indexar o conteúdo. Um site que se adapta à tela também fica mais fácil de ler e navegar.
5. O principal problema que vi foi o `robots.txt` dando 404. Eu colocaria o arquivo no endereço certo e conferiria se o sitemap abre.

# Atividade de SEO | Aula 03

Erik Emanuel Santos de Moura

Fiz a atividade usando a NOIR STREET, minha vitrine de streetwear feminino. [Link do site](https://eriksmoura14-ai.github.io/streetwear/)

## Parte 1

A palavra principal que escolhi foi **streetwear feminino**. As outras duas foram **blusas oversized femininas** e **calças cargo femininas**. Pensei em alguém que quer ver as roupas, saber o preço e escolher um tamanho antes de pedir.

No site, **Streetwear feminino** é o H1. **The Street Edit** é o H2 da coleção, e os nomes das peças ficam em H3. A parte principal fica dentro de `main` e cada peça fica em `article`.

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

---

# Atividade Prática — Aula 4 (Parte 1): Análise de Requisitos

Projeto Viva Sua Profissão • Personas, Requisitos (RF, RNF e RN) e Implementação no GitHub

## Etapa 1 — Levantamento de Personas

### Persona 1 — Estudante do Ensino Médio (16 anos)
- **Perfil:** Estudante que está decidindo qual curso técnico fazer.
- **Principal dúvida/necessidade:** Saber o que faz um técnico em Desenvolvimento de Sistemas no dia a dia e quais habilidades precisa aprender.
- **Página do portal que resolve:** `index.html` e `pages/habilidades.html`.

### Persona 2 — Jovem em busca do primeiro emprego (19 anos)
- **Perfil:** Jovem que deseja ingressar no mercado de tecnologia.
- **Principal dúvida/necessidade:** Conhecer as áreas de atuação e saber como se preparar para conseguir o primeiro emprego.
- **Página do portal que resolve:** `pages/profissoes.html` e `pages/habilidades.html`.

## Etapa 2 — Especificação Técnica: RF, RNF e RN

### Requisitos Funcionais (RF)

| Código | Tipo | Descrição Clara do Requisito | Status |
|---|---|---|---|
| RF01 | Funcional | O usuário deve navegar entre todas as páginas pelo menu sem links quebrados. | Implementado |
| RF02 | Funcional | O portal deve apresentar uma seção de perguntas frequentes (FAQ) sobre Desenvolvimento de Sistemas. | Planejado |
| RF03 | Funcional | O portal deve disponibilizar um passo a passo de estudos com habilidades e tecnologias recomendadas para iniciantes. | Planejado |

### Requisitos Não Funcionais (RNF)

| Código | Tipo | Descrição Clara do Requisito | Status |
|---|---|---|---|
| RNF01 | Não Funcional | O layout deve ser responsivo em telas de celular sem barra de rolagem horizontal. | Implementado |
| RNF02 | Não Funcional | O site deve apresentar textos legíveis, contraste adequado e navegação simples para facilitar o acesso às informações. | Planejado |

### Regra de Negócio (RN)

| Código | Tipo | Descrição Clara do Requisito | Status |
|---|---|---|---|
| RN01 | Regra de Negócio | As informações sobre profissões e tecnologias devem ser organizadas de forma clara e utilizar fontes confiáveis. | Planejado |

## Etapa 3 — De Requisito para Código no GitHub

**Requisito escolhido: RF02 — Seção de Perguntas Frequentes**

Abaixo, uma implementação em HTML para adicionar ao portal:

```html
<section id="faq">
    <h2>Perguntas Frequentes</h2>

    <article>
        <h3>O que faz um desenvolvedor de sistemas?</h3>
        <p>
            Desenvolve, testa e mantém sistemas, sites e aplicações
            utilizados para solucionar problemas.
        </p>
    </article>

    <article>
        <h3>Preciso saber matemática para programar?</h3>
        <p>
            Conhecimentos de lógica e matemática ajudam,
            mas é possível aprender programação começando do básico.
        </p>
    </article>

    <article>
        <h3>Quais linguagens devo aprender?</h3>
        <p>
            HTML, CSS e JavaScript são boas opções para começar
            no desenvolvimento web.
        </p>
    </article>
</section>
```

### CSS da seção

```css
#faq {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
}

#faq h2 {
    text-align: center;
    margin-bottom: 25px;
}

#faq article {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #f2f2f2;
}

#faq article h3 {
    margin-bottom: 10px;
    color: #202938;
}

#faq article p {
    line-height: 1.6;
}
```

### Commit sugerido

```bash
git add .
git commit -m "feat: implementa RF02 - seção de perguntas frequentes"
git push
```

## Etapa 4 — Perguntas de Fixação

### 1. Qual é a diferença entre um Requisito Funcional (RF) e um Requisito Não Funcional (RNF)? Dê um exemplo de cada usando o projeto Viva Sua Profissão.

O Requisito Funcional descreve uma função que o site deve realizar, como apresentar perguntas frequentes sobre a profissão de Desenvolvimento de Sistemas. O Requisito Não Funcional descreve a qualidade ou como o site deve funcionar, como ser responsivo e funcionar corretamente em celulares.

### 2. Por que definir personas antes de sair escrevendo código evita retrabalho no desenvolvimento de um site?

Porque as personas ajudam a entender quem vai utilizar o site e quais são suas necessidades. Dessa forma, é possível desenvolver funcionalidades que realmente ajudam os usuários, evitando criar páginas e recursos desnecessários e precisar modificá-los depois.

### 3. O que pode acontecer com um projeto web quando os requisitos ficam vagos (ex.: "fazer um site bonito e rápido") em vez de objetivos e mensuráveis?

Os desenvolvedores podem interpretar os requisitos de maneiras diferentes, produzir algo que não atende às necessidades do usuário, cometer erros e precisar refazer partes do projeto. Isso pode aumentar o tempo e o custo de desenvolvimento.

### 4. Explique como vincular o código do requisito na mensagem de git commit ajuda na organização e manutenção de um projeto em equipe.

Vincular o código do requisito ao commit permite identificar qual funcionalidade ou melhoria foi implementada naquela alteração. Isso facilita acompanhar o desenvolvimento, revisar o código, encontrar alterações antigas e compreender o histórico do projeto em equipe.

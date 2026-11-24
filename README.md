# Streetwaer

Vitrine de streetwear feminino em HTML, CSS e JavaScript, com catálogo, busca, sacola e provador 3D interativo.

## Executar localmente

Na raiz do projeto, execute:

```sh
python3 -m http.server 8000
```

Abra `http://localhost:8000` no navegador. O provador abre em 3D e carrega a personagem quando a seção se aproxima da tela. A visualização rotativa usa WebGL 2. O botão **Foto da modelo** abre as combinações fotográficas do catálogo. As fotos, as fontes e o Three.js são servidos pelo próprio site.

## Publicar no Render

1. Envie o projeto, incluindo o `render.yaml`, para a branch do GitHub que será publicada.
2. No [painel do Render](https://dashboard.render.com/), escolha **New → Blueprint**, conecte o repositório `eriksmoura14-ai/streetwear` e selecione essa branch.
3. Confirme a criação do serviço estático. Após o primeiro deploy, use a URL fornecida pelo Render.

O Blueprint cria um **Static Site** e publica a pasta `dist`, montada pelo comando de build. O site não precisa de servidor de aplicação, variáveis de ambiente ou credenciais para funcionar.

## Conteúdo da loja

- `app.js` contém os produtos, preços e tamanhos de exemplo e controla filtros, busca, sacola e seleção de roupas.
- `fitting.js` carrega a malha humana em glTF e modela as peças 3D. Camiseta e moletom ocupam a parte de cima, e a baggy pode ser combinada com ambas.
- O modelo em `assets/avatar/streetwaer-humanforge.glb` usa os assets femininos prontos do [HumanForge v0.5.0](https://github.com/abdulrehman043/humanforge/tree/v0.5.0), com licença CC0 1.0. Veja a [proveniência dos assets](assets/avatar/HUMANFORGE.md).
- `assets/` contém as fotos das peças, as composições ilustrativas do provador, as fontes e a biblioteca 3D, com as licenças correspondentes.

A sacola é salva no navegador e gera um resumo copiável. Para vender pelo site, substitua os dados ilustrativos pelas informações comerciais reais e integre pedidos, pagamento e frete.

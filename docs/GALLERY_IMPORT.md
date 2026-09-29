# Importação em lote da galeria

O importador permite preparar várias criações e fotos em uma pasta e cadastrá-las no Supabase sem usar o formulário item por item. Ele não altera as imagens: coloque na pasta os arquivos já editados e otimizados. O manifesto pode ser preparado pelo Codex a partir das fotos e das informações fornecidas, sem inventar sabores ou ingredientes.

## Preparar os arquivos

1. Extraia o ZIP, se houver, para uma pasta local.
2. Separe as fotos finais em uma subpasta, por exemplo `fotos/`.
3. Copie [`gallery-import.example.json`](./gallery-import.example.json) para a pasta do lote como `manifest.json` e ajuste os itens. `categorySlug` precisa corresponder a uma categoria ativa cadastrada no painel.
4. Use caminhos relativos a `imageRoot`; são aceitos JPG, PNG e WebP de até 8 MB por imagem. Cada criação pode ter uma ou várias fotos.
5. Por segurança, `published` e `featured` são falsos quando omitidos. Para revisão antes de ir ao ar, mantenha `published: false`; a capa será a primeira foto, a menos que uma foto tenha `cover: true`.

Exemplo de pasta:

```text
lote-junho/
  manifest.json
  fotos/
    bolo-morangos.jpg
```

## Validar e importar

No terminal, na pasta do projeto, primeiro valide o lote sem alterar nada:

```powershell
node scripts/import-gallery.mjs --manifest "C:\caminho\lote-junho\manifest.json"
```

Para enviar, use `--apply`. O importador pede o e-mail e a senha do painel; a senha não aparece na tela. Ele autentica com a chave pública já configurada em `.env.local`, exige um perfil `admin` e respeita as políticas RLS existentes. Não usa nem pede uma chave `service_role`.

```powershell
node scripts/import-gallery.mjs --manifest "C:\caminho\lote-junho\manifest.json" --apply
```

Antes de gravar, confere as categorias, os slugs e todos os arquivos. Cria cada item como rascunho, envia as imagens para o bucket `gallery` e registra a capa. Só publica uma criação quando `published` estiver explicitamente como `true`. Se uma criação falhar durante o envio, tenta remover o rascunho e os arquivos incompletos daquela criação.

O importador não publica o site nem substitui criações existentes. Ele não inclui carrinho, checkout, pagamento ou integração com WhatsApp.


# Guia de Deploy no GitHub Pages - Vistoria Digital

## Pré-requisitos
- Conta no GitHub
- Git instalado no seu computador

## Passo a Passo

### 1. Criar Repositório no GitHub
1. Acesse https://github.com
2. Clique em "New repository" (botão verde)
3. Nome do repositório: `vistoria-web`
4. Marque como "Public"
5. **NÃO** marque "Add a README file"
6. Clique em "Create repository"

### 2. Configurar o Repositório Local
Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - Vistoria Digital"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/vistoria-web.git

# Renomear branch para main
git branch -M main

# Fazer push para o GitHub
git push -u origin main
```

### 3. Configurar GitHub Pages
1. No seu repositório no GitHub, vá em "Settings"
2. No menu lateral, clique em "Pages"
3. Em "Source", selecione "GitHub Actions"
4. O workflow já está configurado e será executado automaticamente

### 4. Aguardar o Deploy
- O GitHub Actions irá executar automaticamente após o push
- Você pode acompanhar o progresso na aba "Actions" do repositório
- Após alguns minutos, seu site estará disponível em: `https://SEU_USUARIO.github.io/vistoria-web/`

## Arquivos Importantes Configurados

### `.github/workflows/deploy.yml`
- Workflow do GitHub Actions para build e deploy automático
- Executa a cada push na branch main
- Instala dependências, faz build e publica no GitHub Pages

### `vite.config.js`
- Configurado com `base: '/vistoria-web/'` para funcionar no GitHub Pages
- Necessário para que os assets sejam carregados corretamente

### `package.json`
- Configurado com homepage e script de deploy
- Build command configurado para GitHub Pages

## Atualizações Futuras
Para atualizar o site:
1. Faça as alterações no código
2. Execute: `git add .`
3. Execute: `git commit -m "Descrição das alterações"`
4. Execute: `git push`
5. O GitHub Actions fará o deploy automaticamente

## Solução de Problemas

### Site não carrega corretamente
- Verifique se o `base` no `vite.config.js` está correto
- Certifique-se de que o nome do repositório está correto

### Build falha
- Verifique os logs na aba "Actions" do GitHub
- Certifique-se de que todas as dependências estão no `package.json`

### Permissões
- Vá em Settings > Actions > General
- Em "Workflow permissions", selecione "Read and write permissions"
- Marque "Allow GitHub Actions to create and approve pull requests"

## URL Final
Após o deploy bem-sucedido, seu site estará disponível em:
`https://SEU_USUARIO.github.io/vistoria-web/`

Substitua `SEU_USUARIO` pelo seu username do GitHub.


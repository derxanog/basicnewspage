# 📰 O Derxan News - Portal de Notícias GTA RP

> Um sistema de notícias moderno, leve e **serverless** focado em Roleplay (GTA RP), utilizando a API do GitHub Gist como banco de dados.

![Badge Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Badge License](https://img.shields.io/badge/License-FREE-blue)
![Badge Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20JS%20%7C%20Gist-orange)

## 📋 Sobre o Projeto

O **Derxan News** é uma interface web desenvolvida para simular um portal de jornalismo dentro do universo de **GTA RP**. O grande diferencial deste projeto é a arquitetura **Serverless**.

Não há necessidade de hospedagem backend complexa (PHP/Node/SQL). Todo o conteúdo é gerenciado através de um arquivo JSON hospedado gratuitamente no **GitHub Gist**, tornando a manutenção simples e o custo zero.

---

## ✨ Funcionalidades

* **CMS Sem Servidor:** O site lê as notícias diretamente do seu GitHub Gist.
* **🎨 Tema Dinâmico:**
    * Suporte a **Dark Mode** e Light Mode.
    * Detecção automática da preferência do sistema operacional.
    * Botão de alternância manual com salvamento de preferência.
* **⚡ Cache Inteligente (LocalStorage):**
    * Para evitar limites da API do GitHub, as notícias ficam salvas no navegador do usuário por **5 minutos**.
    * Garante carregamento instantâneo após a primeira visita.
* **🏷️ Filtros de Conteúdo:** Navegação fluida por abas (Geral, Matérias e Reportagens) sem recarregar a página.

---

## 🚀 Instalação e Configuração (Passo a Passo)

Para que o site exiba suas notícias, você precisa criar um "banco de dados" no GitHub Gist. Siga este tutorial exato:

### 1. Criando o Gist Público

1.  Acesse [gist.github.com](https://gist.github.com/).
2.  No campo de descrição, coloque: `DB Derxan News`.
3.  **IMPORTANTE:** No nome do arquivo (Filename), digite: `noticias.json`.
4.  Copie o **Modelo de JSON** abaixo e cole no conteúdo do arquivo.

#### 📄 Modelo de JSON (Copie e Cole no Gist)

```json
[
  {
    "id": 1761624328388,
    "titulo": "ESTAMOS RECRUTANDO!!",
    "categoria": "materia",
    "urlRecurso": "https://i.imgur.com/N4QL3sU.png",
    "data": "28 de outubro de 2025"
  },
  {
    "id": 1761522005606,
    "titulo": "Onda de Ataques a Posto da PRF Perto de Grapessed Marca Início de Novo Comando",
    "categoria": "materia",
    "urlRecurso": "https://i.imgur.com/jNbXvhd.png",
    "data": "26 de outubro de 2025"
  },
  {
    "id": 1761417294762,
    "titulo": "Casa Noturna Galaxy Ira Reabrir com Novas Atrações e Foco Adulto",
    "categoria": "materia",
    "urlRecurso": "https://i.imgur.com/qu2BPMI.png",
    "data": "25 de outubro de 2025"
  }
]
```

5.  Clique no botão verde **Create public gist**.

### 2. Pegando o ID do Gist

Após criar o Gist, olhe para a URL no seu navegador. Ela será parecida com isso:
`https://gist.github.com/seu-usuario/e4d9085a8760649151b489387606`

O ID é a parte final.
👉 ID do exemplo: `e4d9085a8760649151b489387606`

### 3. Configurando o Script

1.  Abra o arquivo `script.js` do site.
2.  Localize a variável `GIST_ID` no início do código.
3.  Cole o ID que você copiou no passo anterior.

```javascript
// Configuração do GIST
const GIST_ID = "COLE_SEU_ID_AQUI"; 
const GIST_FILENAME = "noticias.json";
```

---

## ⚙️ Personalização Avançada

### Alterar Tempo de Cache
Por padrão, o site atualiza as notícias a cada 5 minutos. Para mudar, edite no JS:

```javascript
// Exemplo: 10 minutos
const CACHE_DURATION_MS = 10 * 60 * 1000;
```

### Categorias
O filtro funciona lendo a propriedade `"categoria"` do JSON. Use:
* `"materia"` para textos/artigos.
* `"reportagem"` para vídeos/coberturas.

---

## 🤝 Contribuição

Sinta-se à vontade para fazer um fork e enviar Pull Requests.

## 📝 Licença

Este projeto está sob a licença Gratuita, o uso é liberado sem nenhuma limitação.

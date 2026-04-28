# 🐐 Sham-Wah 🐐

![Nuxt JS](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxt&logoColor=#00DC82)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Neo4J](https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## ⛰️ About ⛰️

Sham‑Wah is a web application currently being developed as part of the [IntForOut Project](https://www.umr-lastig.fr/intforout/).
Designed as a companion to [OutdoorPressure](https://github.com/intforout/outdoorpressure) knowledge graph, it enables non‑experts to query and explore the graph through a user-friendly interface. It allows users to search and discover the wide range of resources (scientific papers, datasets, scripts, services, etc...) produced and used by the project’s research teams.

### Try the Demo (GUI Only)

A static preview of the GUI is available here: https://intforout.github.io/sham-wah/explore/

This version does not communicate with the API or the Neo4j database, only the hard-coded data will give you a preview of the feature visualizations.


### Try the Demo (GUI Only)

A static preview of the GUI is available here: https://intforout.github.io/sham-wah/explore/

This version does not communicate with the API or the Neo4j database, only the hard-coded data will give you a preview od the visualization of features.


## 🤔 Why the Name “Sham‑Wah”? 🤔

I wanted a short, pleasant‑sounding name for a Knowledge Graph Query Framework, ideally with a nod to knowledge graph, querying and alpine ecology. Since the project focuses on wildlife disturbance in mountain environments, I explored animal‑themed names and naturally thought of the [chamois](https://en.wikipedia.org/wiki/Chamois), an animal I love.

While searching for inspiration, I found an English [forum](https://www.facebook.com/groups/waywordradio/posts/10158351484663584/) discussing how to pronounce chamois. Someone wrote it as “sham‑wah”, and it immediately clicked: unique spelling, easy to pronounce, and a subtle reference to the real animal. During my research I discovered that chamois is also an [HTML color](https://encycolorpedia.fr/d0c07a) name, which inspired the color theme used in the app.

And that’s how Sham‑Wah was born.

## 📖 Table of contents 📖

- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Features](#features)
<!-- - [User guide](#user-guide) -->

<h2 id="architecture-overview">🏛️ Architecture Overview 🏛️</h2>

Sham‑Wah follows a web-based client–server architecture composed of three main components:

- Graphical User interface (GUI): a Nuxt‑based frontend for exploring the knowledge graph, running queries, and visualizing results
- API Backend: a FastAPI server that handles requests and communicates with the knowledge graph.
- Knowledge Graph Database: A Neo4j instance storing entities and relationships, enriched with the neosemantics plugin.

<p align='center' style="margin-top: 20px;">
<img src="docs/img/archi.png" alt="Architecture Diagram of Sham-Wah" width="500">
</p>

<h2 id="installation">⚙️ Installation ⚙️</h2>

### 🐣 First steps 🐣

1. Clone the repository

```bash
git clone https://github.com/intforout/sham-wah.git
cd sham-wah
```

2. Each component (gui, api, neo4j) contains a .env.example. Create your .env files based on these templates:

```bash
cd gui
cp .env.example .env
```

3. Repeat for api and neo4j. Then choose your installation method.

### 🎭 Installation Options 🎭

You can run Sham‑Wah in two ways:

- [Using Docker](#docker) (recommended, easiest way)
- [Traditional installation](docs/guide-installation.md) (manual setup of GUI, API, and Neo4j)

<h2 id="docker">🐳 Docker Installation (Recommended) 🐳</h2>

1. Install Docker (or [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/) on Windows).

2. In the root of the application, run all services:

```bash
docker compose up -d
```

3. To stop all the services:

```bash
docker compose down
```

### ⚠️ WARNING: Common issue on Windows and VScode terminal

If you have use VSCode for example to create all the .env files or modifies the code itself, VSCode on Windows rewrites all the files with CRLF endings (\r\n) as the default line ending. When you run the docker command, Neo4j container (which uses a linux image) may fails to start as it uses shell scripts and files inside the container use CRLF instead of LF, so Linux interprets the extra \r character as an invalid command.

1. Configure your VSCode to use LF to avoid this issue.

##### Screenshot of the bottom‑right corner of the VS Code editor

<figure style="text-align: left; margin-top: 20px;">
  <img src="docs/img/vscodeLF.png" alt="vscode" width="400">
</figure>

2. Then, re‑run the entire Docker Compose setup with:

```bash
docker compose build --no-cache
docker compose up -d
```

### 🪐 Services available 🪐

- GUI: http://localhost:3000/sham-wah/explore
- API Documentation (Swagger): http://localhost:8000/docs

<h2 id="features">🐥 Features 🐥</h2>

### 🚧 Work in Progress 🚧

The current version includes:

- A prototype layout with:
  - A query panel on the left that includes:
    - A predefined query panel highlighting digital assets linked to human activities
    - A panel with hard coded data for demonstration purposes
  - A graph neighborhood view on the right

More features will be added as development continues. You can also follow progress on the [github's project](https://github.com/users/vanou-suerte/projects/5)

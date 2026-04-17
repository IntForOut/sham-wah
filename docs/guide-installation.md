# 📜 Traditional Installation 📜

This guide is intended for developers and advanced users who want to install and run all three components of the application independently for maximum flexibility.

## 📖 Table of contents 📖

- [Prerequesities](#prerequesities)
- [GUI (Nuxt 4)](#gui)
- [API (FastAPI)](#api)
- [Neo4j Database](#user-guide)

<h2 id="prerequesities">🧰 Prerequisites 🧰</h2>

- [pnpm](https://pnpm.io/installation) (or another package manager) for the GUI
- Python v3.12.3 the API
- Neo4j ([Desktop](https://neo4j.com/download/) or Server)

<h2 id="gui">🙋‍♂️ GUI (Nuxt 4) 🙋‍♂️</h2>

```bash
cd gui
pnpm install
```

- then run

```bash
pnpm run dev
```

The GUI will be available at: http://localhost:3000/sham-wah/

<h2 id="api">🧚‍♀️ API (FastAPI) 🧚‍♀️</h2>

- Create and activate a virtual environment:

```bash
cd api
python -m venv .venv
source .venv/bin/activate
```

- Install dependencies and run the API:

```bash
pip install -r requirements.txt
fastapi dev
```

API docs will be available at: http://127.0.0.1:8000/docs

<h2 id="api">🛢️ Neo4j Database 🛢️</h2>

### 🖥️ Neo4j Desktop 🖥️

- To run the neo4j database, you can use [Neo4j Desktop](https://neo4j.com/docs/desktop/2.0/installation/#download-installation)

1. Create a new local database instance. Avoid commercial versions (e.g., Neo4j 2025.x.x). Recommended: Neo4j 5.26.18

2. Install the [neosemantics (n10s) plugin](https://github.com/neo4j-labs/neosemantics/releases)
   Download the .jar (e.g., version 5.20.0) and place it in the instance’s plugins/ folder.

3. Initialize graph configuration:

```bash
CALL n10s.graphconfig.init({
  handleVocabUris: "SHORTEN",
  handleMultival: "ARRAY",
  keepLangTag: false,
  keepCustomDataTypes: false
})
```

4. Place the OutdoorPressure.rdf file in the instance’s import/ folder.

5. Create the required constraint:

6. Initialize graph configuration:

```bash
CREATE CONSTRAINT n10s_unique_uri FOR (r:Resource)
REQUIRE r.uri IS UNIQUE
```

7. Import the RDF file:

```bash
CALL n10s.rdf.import.fetch(
  "file:/path/to/import/outdoorPressure.rdf",
  "RDF/XML"
)
```

#!/bin/bash
set -e

NEO4J_PASSWORD="${NEO4J_AUTH#neo4j/}"

echo ">>> Starting Neo4j..."
/startup/docker-entrypoint.sh neo4j &
NEO4J_PID=$!

echo ">>> Waiting for Neo4j to be ready..."
until cypher-shell -u neo4j -p "$NEO4J_PASSWORD" "RETURN 1;" > /dev/null 2>&1; do
  sleep 3
done

echo ">>> Neo4j is up."

CONFIG_EXISTS=$(cypher-shell -u neo4j -p "$NEO4J_PASSWORD" \
  --format plain \
  "MATCH (gc:_GraphConfig) RETURN count(gc);" 2>/dev/null | tail -1)

if [ "$CONFIG_EXISTS" = "0" ]; then
  echo ">>> First boot detected, running full setup..."

  cypher-shell -u neo4j -p "$NEO4J_PASSWORD" "
    CALL n10s.graphconfig.init({
      handleVocabUris: 'SHORTEN',
      handleMultival: 'ARRAY',
      keepLangTag: false,
      keepCustomDataTypes: false
    });
  "

  cypher-shell -u neo4j -p "$NEO4J_PASSWORD" "
    CREATE CONSTRAINT n10s_unique_uri FOR (r:Resource)
    REQUIRE r.uri IS UNIQUE;
  "

  cypher-shell -u neo4j -p "$NEO4J_PASSWORD" "
    CALL n10s.rdf.import.fetch(
      'file:///var/lib/neo4j/import/outdoorPressure.rdf',
      'RDF/XML'
    );
  "

  echo ">>> Setup complete."
else
  echo ">>> Database already configured, skipping setup."
fi

wait $NEO4J_PID

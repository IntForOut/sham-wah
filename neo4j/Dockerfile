FROM neo4j:5.20-community

COPY plugins/ /var/lib/neo4j/plugins/
COPY import/  /var/lib/neo4j/import/
COPY init.sh  /init.sh
RUN chmod +x /init.sh

ENTRYPOINT ["/init.sh"]
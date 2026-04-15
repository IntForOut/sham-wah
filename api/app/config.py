from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    neo4j_url: str
    neo4j_user: str
    neo4j_password: str
    neo4j_database: str = "neo4j"
    app_env: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()

if os.getenv("RUNNING_IN_DOCKER") == "true":
    settings.neo4j_url = "bolt://neo4j:7687"
else:
    settings.neo4j_url = settings.neo4j_url
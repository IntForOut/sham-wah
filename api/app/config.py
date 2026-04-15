from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    neo4j_url: str
    neo4j_user: str
    neo4j_password: str
    neo4j_database: str = "neo4j"
    app_env: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
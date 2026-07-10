from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_FIREWORKS_MODEL = "accounts/fireworks/models/llama-v3p1-8b-instruct"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="APP_",
        extra="ignore",
    )

    environment: str = "development"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "*"
    database_url: str = "sqlite:///./lysergic.db"
    log_level: str = "INFO"

    fireworks_api_key: str = Field(
        default="",
        validation_alias=AliasChoices("FIREWORKS_API_KEY", "APP_FIREWORKS_API_KEY"),
    )
    fireworks_model: str = Field(
        default=DEFAULT_FIREWORKS_MODEL,
        validation_alias=AliasChoices("FIREWORKS_MODEL", "APP_FIREWORKS_MODEL"),
    )
    fireworks_timeout: float = Field(
        default=30.0,
        validation_alias=AliasChoices("FIREWORKS_TIMEOUT", "APP_FIREWORKS_TIMEOUT"),
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()

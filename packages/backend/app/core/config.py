from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str
    SECRET_KEY: str = "supersecretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BASELINE_ROLE: str = "user"

    # Email settings
    SMTP_HOST: str = "smtp.example.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "your_email@example.com"
    SMTP_PASSWORD: str = "your_email_password"
    EMAILS_FROM_EMAIL: str = "noreply@example.com"
    LOGIN_URL: str = "http://localhost:3002/login"

settings = Settings()

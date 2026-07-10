import pytest

from app.config import settings
from app.database import init_db


@pytest.fixture
def db(tmp_path, monkeypatch):
    db_path = tmp_path / "test.db"
    monkeypatch.setattr(settings, "database_url", f"sqlite:///{db_path}")
    init_db()
    yield

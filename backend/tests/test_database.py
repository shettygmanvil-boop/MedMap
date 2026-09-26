from app.core.database import engine
from sqlalchemy.pool import NullPool

def test_engine_uses_nullpool():
    assert isinstance(engine.pool, NullPool), "Engine should be configured with NullPool for serverless environments"

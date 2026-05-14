from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM")
EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES"))

def create_access_token(username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRE_MINUTES)
    payload = {"sub": username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

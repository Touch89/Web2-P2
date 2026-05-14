import { useState } from 'react';


interface LoginPageProps {
  onLogin: (token?: string) => void;
  onGoToRegister: () => void;
}

export function UserInfoPage() {
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchViaCookie = async () => {
    setLoading(true);
    setError('');
    setUserInfo(null);
    try {
      const res = await fetch('http://localhost:8000/users/me', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      setUserInfo(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground text-center">Información del Usuario</h2>

        <button
          onClick={fetchViaCookie}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Mostrar información
        </button>

        {loading && <p className="text-sm text-center">Cargando...</p>}
        {error && <p className="text-sm text-destructive text-center">{error}</p>}

        {userInfo && (
          <div className="mt-4 rounded-lg border border-border p-4 space-y-2">
            <p><strong>Nombre:</strong> {String(userInfo.nombre)}</p>
            <p><strong>Usuario:</strong> {String(userInfo.username)}</p>
            <p><strong>Contraseña hasheada:</strong> {String(userInfo.hashed_password)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginPage({ onLogin, onGoToRegister }: LoginPageProps) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !contrasena) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }
    try {
      const formData = new URLSearchParams();
      formData.append('username', usuario);
      formData.append('password', contrasena);

      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        credentials: 'include',
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      alert(`Usuario Autenticado\nToken: ${data.access_token}`);
      onLogin(data.access_token);
    } catch {
      alert('Error de autenticación');
    }
  };

  return (



    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">

      <div className="flex items-center gap-4 mb-10">

        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">PapuPro</div>
          <div className="text-2xl font-bold text-foreground leading-tight">Six<br />Seven</div>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Usuario</label>
          <input
            type="text"
            autoComplete="username"
            value={usuario}
            onChange={e => { setUsuario(e.target.value); setError(''); }}
            placeholder="Ingresa tu usuario"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Contraseña</label>
          <input
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={e => { setContrasena(e.target.value); setError(''); }}
            placeholder="Ingresa tu contraseña"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Entrar
        </button>
      </form>
      <button type="button" onClick={onGoToRegister}>
        No tengo cuenta, Registrarme
      </button>
    </div>
  );
}
interface RegisterPageProps {
  onGoToLogin: () => void;
}

export function RegisterPage({ onGoToLogin }: RegisterPageProps) {
  const [nombre, setNombre] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre,
          username: nombreUsuario,
          password: contrasena,
        }),
      });
      if (!res.ok) throw new Error();
      setNombre('');
      setNombreUsuario('');
      setContrasena('');
      alert('Usuario creado');
    } catch {
      alert('Hubo un fallo en la creación del usuario');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={e => setNombreUsuario(e.target.value)}
            placeholder="Tu nombre de usuario"
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            value={contrasena}
            onChange={e => setContrasena(e.target.value)}
            placeholder="Tu contraseña"
          />
        </div>
        <button type="submit">Crear usuario</button>
      </form>
      <button type="button" onClick={onGoToLogin}>
        Ya tengo cuenta, Iniciar sesión
      </button>
    </div>
  );
}

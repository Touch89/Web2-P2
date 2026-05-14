import { useState } from "react";

interface LoginPageProps {
  onLogin: (token: string) => void;
}

interface UserInfoPageProps {
  token: string;
}

export function UserInfoPage({ token }: UserInfoPageProps) {
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchViaCookie = async () => {
    setLoading(true);
    setError("");
    setUserInfo(null);
    setLoading(false);
  };

  const fetchViaHeader = async () => {
    setLoading(true);
    setError("");
    setUserInfo(null);
    console.log("token disponible:", token);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-10">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            PapuPro
          </div>
          <div className="text-2xl font-bold text-foreground leading-tight">
            Six
            <br />
            Seven
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-foreground text-center">
          Información del Usuario
        </h2>

        <button
          onClick={fetchViaCookie}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Obtener info (Cookie)
        </button>

        <button
          onClick={fetchViaHeader}
          disabled={loading}
          className="w-full py-2 rounded-lg border border-border bg-white text-foreground text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Obtener info (Header)
        </button>

        {loading && (
          <p className="text-sm text-muted-foreground text-center">
            Cargando...
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        {userInfo && (
          <pre className="mt-4 rounded-lg border border-border bg-gray-50 p-3 text-xs text-foreground overflow-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

export function LoginPage({ onLogin: _onLogin }: LoginPageProps) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-4 mb-10">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            PapuPro
          </div>
          <div className="text-2xl font-bold text-foreground leading-tight">
            Six
            <br />
            Seven
          </div>
        </div>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!usuario || !contrasena) {
            setError("Por favor ingresa usuario y contraseña.");
            return;
          }
          setError("");
          setLoading(true);
          setLoading(false);
        }}
        className="w-full max-w-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Usuario
          </label>
          <input
            type="text"
            autoComplete="username"
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setError("");
            }}
            placeholder="Ingresa tu usuario"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Contraseña
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              setError("");
            }}
            placeholder="Ingresa tu contraseña"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}

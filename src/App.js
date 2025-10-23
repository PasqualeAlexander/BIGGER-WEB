import React, { useState, useEffect, useMemo } from 'react';

// Pequeño componente para los íconos de ordenamiento en la tabla
const SortIcon = ({ direction }) => {
  if (!direction) return null;
  return direction === 'asc' ? <i className="bi bi-arrow-up-short"></i> : <i className="bi bi-arrow-down-short"></i>;
};

function App() {
  const [stats, setStats] = useState({ players: [], lastUpdated: null });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  // Efecto para cargar los datos del JSON
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/stats.json')
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => setStats(data))
      .catch(error => {
        console.error('Error fetching stats:', error);
        setError(error.message);
      });
  }, []);

  // Lógica de filtrado y ordenamiento
  const sortedAndFilteredPlayers = useMemo(() => {
    let filtered = stats.players.filter(player =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [stats.players, searchTerm, sortConfig]);

  // Función para manejar el clic en los encabezados de la tabla
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Función para formatear la fecha
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('es-AR', {
      dateStyle: 'medium', timeStyle: 'medium'
    });
  };

  const headers = [
    { key: 'rank', label: '#' },
    { key: 'name', label: 'Nombre' },
    { key: 'level', label: 'Nivel' },
    { key: 'xp', label: 'XP' },
    { key: 'wins', label: 'Victorias' },
    { key: 'goals', label: 'Goles' },
    { key: 'assists', label: 'Asistencias' },
    { key: 'matches', label: 'Partidos' },
    { key: 'mvps', label: 'MVPs' },
  ];

  return (
    <div className="App" data-bs-theme="dark">
      {/* --- Barra de Navegación --- */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 border-bottom border-body">
        <div className="container">
          <a className="navbar-brand" href="#">
            <i className="bi bi-bar-chart-line-fill me-2"></i>
            Estadísticas LNB
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  <i className="bi bi-list-ul me-1"></i> Menú
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <a className="dropdown-item" href="https://github.com/PasqualeAlexander/BIGGER-WEB/actions/workflows/update-stats.yml" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-arrow-clockwise me-2"></i>Forzar Actualización de Datos
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="https://github.com/PasqualeAlexander/bot-JT-LNB" target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-robot me-2"></i>Repositorio del Bot
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      <main className="container">
        <div className="card shadow">
          <div className="card-header bg-dark-subtle">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="mb-2 mb-md-0">
                <h4 className="mb-0">📊 Top 50 Jugadores</h4>
                <small className="text-muted">Última actualización: {formatDate(stats.lastUpdated)}</small>
              </div>
              <div className="w-100 w-md-auto" style={{ maxWidth: '300px' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Buscar por nombre..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card-body">
            {error ? (
              <div className="alert alert-danger" role="alert">
                <strong>Error:</strong> No se pudieron cargar las estadísticas. ({error})
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      {headers.map(header => (
                        <th key={header.key} scope="col" onClick={() => requestSort(header.key)} style={{ cursor: 'pointer' }}>
                          {header.label} <SortIcon direction={sortConfig.key === header.key ? sortConfig.direction : null} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAndFilteredPlayers.map(player => (
                      <tr key={player.rank}>
                        <th scope="row">{player.rank}</th>
                        <td>{player.name}</td>
                        <td>{player.level}</td>
                        <td>{player.xp}</td>
                        <td>{player.wins}</td>
                        <td>{player.goals}</td>
                        <td>{player.assists}</td>
                        <td>{player.matches}</td>
                        <td>{player.mvps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-4 text-muted">
          <p>Creado para el Bot de LNB</p>
        </footer>
      </main>
    </div>
  );
}

export default App;

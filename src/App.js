import React, { useState, useEffect } from 'react';

function App() {
  const [stats, setStats] = useState({ players: [], lastUpdated: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/stats.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setStats(data))
      .catch(error => {
        console.error('Error fetching stats:', error);
        setError(error.message);
      });
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('es-AR', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="App" data-bs-theme="dark">
      <div className="container mt-4">
        <header className="text-center mb-4">
          <h1>📊 Top 50 Jugadores - LNB Bot</h1>
          <p className="text-muted">
            Última actualización: {formatDate(stats.lastUpdated)}
          </p>
        </header>
        
        {error && 
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> No se pudieron cargar las estadísticas. ({error})
          </div>
        }

        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Nivel</th>
                <th scope="col">XP</th>
                <th scope="col">Victorias</th>
                <th scope="col">Goles</th>
                <th scope="col">Asistencias</th>
                <th scope="col">Partidos</th>
                <th scope="col">MVPs</th>
              </tr>
            </thead>
            <tbody>
              {stats.players.map(player => (
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

        <footer className="text-center mt-4 text-muted">
          <p>Creado para el Bot de LNB</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
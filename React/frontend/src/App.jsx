import { useEffect, useState } from 'react';

function App() {
  const [women, setWomen] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/women')
      .then(res => res.json())
      .then(data => setWomen(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Список женщин</h1>
      {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      <ul>
        {women.map((woman, index) => (
          <li key={index}>{woman.name} (или другие поля)</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
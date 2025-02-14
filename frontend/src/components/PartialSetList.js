import { useEffect, useState } from 'react';

const PartialSetList = () => {
  const [partialSets, setPartialSets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/partial-set/')
      .then((response) => response.json())
      .then((data) => {
        setPartialSets(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Partial Sets</h2>
      <ul>
        {partialSets.map((set) => (
          <li key={set.id}>(JSON.stringify(set))</li>
        ))}
      </ul>
    </div>
  )
};

export default PartialSetList;
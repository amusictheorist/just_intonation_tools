import { useState } from "react";

const usePartialSetAPI = () => {
  const [data, setData] = useState(null);
  const [transposedData, setTransposedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPartialSetData = async (userInput, type) => {
    setLoading(true);
    setError(null);
    setTransposedData(null);

    try {
      const response = await fetch('https://amusictheorist-just-intonation-tools.onrender.com/api/partial-set/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userInput, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transposeSet = async (transposeValue) => {
    if (!data) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const parsedSet = data.partial_set.replace(/\{|\}/g, '');
      
      const response = await fetch('https://amusictheorist-just-intonation-tools.onrender.com/api/transpose-set/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: parsedSet, transpose_value: Number(transposeValue) })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to transpose set');
      }
      
      const result = await response.json();

      setTransposedData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, transposedData, loading, error, fetchPartialSetData, transposeSet };
};

export default usePartialSetAPI;

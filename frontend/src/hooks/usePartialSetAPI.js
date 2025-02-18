import { useState } from "react";

const usePartialSetAPI = (baseURL) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPartialSetData = async (userInput, type) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseURL}/api/partial-set/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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

  return { data, loading, error, fetchPartialSetData };
};

export default usePartialSetAPI;
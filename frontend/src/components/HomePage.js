import React, { useState } from "react";
import usePartialSetAPI from "../hooks/usePartialSetAPI";

const HomePage = () => {
  const [userInput, setUserInput] = useState('');
  const [inputType, setInputType] = useState('partial');
  const { data, loading, error, fetchPartialSetData } = usePartialSetAPI('http://localhost:8000');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) {
      alert('Please enter some integers before submitting');
      return;
    }
    fetchPartialSetData(userInput, inputType);
    };

  return (
    <div>
      <h1>Set Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter numbers separated by commas"
        />
        <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value='partial'>Partial Set</option>
          <option value='partial class'>Partial-Class Set</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>(error)</p>}
      {data && (
        <div>
          <h2>Results:</h2>
          <p><strong>Partial Set:</strong> {data.partial_set}</p>
          <p><strong>Partial-Class Set:</strong> {data.partial_class_set}</p>
          <p><strong>Partial-Set Class:</strong> {data.partial_set_class}</p>
          <p><strong>Partial-Class Set Class:</strong> {data.partial_class_set_class}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
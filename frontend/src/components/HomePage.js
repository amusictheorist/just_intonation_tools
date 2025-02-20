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
      <div className="form-container">
        <h1>Set Calculator</h1>
        <p className="form description">
          Enter partial numbers to compute sets and set classes
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className="input-field"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter numbers separated by commas"
          />
          <button type="submit">Submit</button>
        </form>
    
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">(error)</p>}
    
        {data && (
          <div className="results-container">
            <h2>Results:</h2>
            <p><strong>Partial Set:</strong> {data.partial_set}</p>
            <p><strong>Partial-Class Set:</strong> {
              data.partial_class_set.split(', ').map((item, index) => (
                <>
                  <span key={index} className="underline">{item}</span>
                  {index < data.partial_class_set.split(', ').length - 1 && ', '}
                </>
              ))
            }</p>
            <p><strong>Partial-Set Class:</strong> {data.partial_set_class}</p>
            <p><strong>Partial-Class Set Class:</strong> {
              data.partial_class_set_class.split(', ').map((item, index) => (
              <>
                <span key={index} className="underline">{item}</span>
                {index < data.partial_class_set_class.split(', ').length - 1 && ', '}
              </>
              ))
              }</p>
          </div>
        )}
      </div>
    );
};

export default HomePage;
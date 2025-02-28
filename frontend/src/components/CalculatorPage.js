import React, { useState } from "react";
import usePartialSetAPI from '../hooks/usePartialSetAPI';
import '../styles/Calculator.css';

const CalculatorPage = () => {
  const [userInput, setUserInput] = useState('');
  const [transposeValue, setTransposeValue] = useState('');
  const { data: originalSet, transposedData, loading, error, fetchPartialSetData, transposeSet } = usePartialSetAPI('http://localhost:8000');

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchPartialSetData(userInput, 'partial');
  };

  const handleTranspose = (e) => {
    e.preventDefault();
    const transposition = Number(transposeValue);

    if (!isNaN(transposition)) {
      transposeSet(transposition);
    } else {
      alert("Please enter a valid transpose value.");
    }
  };

  return (
    <div className="calculator-page">
      <header className="header">
        <h1>Set Calculator</h1>
      </header>
      <p className="description">
        Enter a set of numbers to calculate its properties.
      </p>
  
      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter numbers separated by commas"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Calculating..." : "Submit"}
        </button>
      </form>
  
      {error && <p className="error">{error}</p>}
  
      {originalSet && (
        <div className="results">
          <h2>Results:</h2>
          <p><strong>Partial Set:</strong> {originalSet.partial_set}</p>
          <p><strong>Low inverse:</strong> {originalSet.low_parset}</p>
          <p><strong>Partial-Class Set:</strong> {
            originalSet.partial_class_set.split(", ").map((item, index) => (
              <React.Fragment key={index}>
                <span className="underline">{item}</span>
                {index < originalSet.partial_class_set.split(", ").length - 1 && ", "}
              </React.Fragment>
            ))
          }</p>
          <p><strong>Low inverse:</strong> {
            originalSet.low_parcset.split(', ').map((item, index) => (
              <React.Fragment key={index}>
                <span className="underline">{item}</span>
                {index < originalSet.low_parcset.split(', ').length - 1 && ', '}
              </React.Fragment>
            ))
          }</p>
          <p><strong>Partial-Set Class:</strong> {originalSet.partial_set_class}</p>
          <p><strong>HCp:</strong> {originalSet.HCp} <strong>#HCp:</strong> {originalSet.cardHCp}</p>
          <p><strong>Partial-Class Set Class:</strong> {
            originalSet.partial_class_set_class.split(", ").map((item, index) => (
              <React.Fragment key={index}>
                <span className="underline">{item}</span>
                {index < originalSet.partial_class_set_class.split(", ").length - 1 && ", "}
              </React.Fragment>
            ))
          }</p>
          <p><strong>HCpc:</strong> {originalSet.HCpc} <strong>#HCpc:</strong> {originalSet.cardHCpc}</p>
  
          <h3>Transpose your set</h3>
          <form onSubmit={handleTranspose} className="form">
            <input
              type="number"
              className="input"
              value={transposeValue}
              onChange={(e) => setTransposeValue(e.target.value)}
              placeholder="Enter transposition value"
            />
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Transposing..." : "Transpose"}
            </button>
          </form>
  
          {transposedData && (
            <div className="results">
              <h2>Transposed Results:</h2>
              <p><strong>Partial Set:</strong> {transposedData.partial_set}</p>
              <p><strong>Partial-Class Set:</strong> {
                transposedData.partial_class_set.split(', ').map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="underline">{item}</span>
                    {index < transposedData.partial_class_set.split(', ').length - 1 && ', '}
                  </React.Fragment>
                ))
              }</p>
              <p><strong>Partial Set low inverse:</strong> {transposedData.low_parset}</p>
              <p><strong>Partial-Class Set low inverse:</strong> {
                transposedData.low_parcset.split(', ').map((item, index) => (
                  <React.Fragment key={index}>
                    <span className="underline">{item}</span>
                    {index < transposedData.low_parcset.split(', ').length - 1 && ', '}
                  </React.Fragment>
                ))
              }</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;

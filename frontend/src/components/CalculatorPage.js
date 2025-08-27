import React, { useState } from "react";
import usePartialSetAPI from '../hooks/usePartialSetAPI';

const CalculatorPage = () => {
  const [userInput, setUserInput] = useState('');
  const [transposeValue, setTransposeValue] = useState('');
  const { data: originalSet, transposedData, loading, error, fetchPartialSetData, transposeSet } = usePartialSetAPI();


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
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-88">
        <h1 className="text-3xl font-bold mb-4">Set Calculator</h1>
      </header>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
        Enter a set of numbers to calculate its properties.
      </p>
  
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-4 mb-8 flex-wrap"
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter numbers separated by commas"
          className="p-3 text-base border border-gray-300 rounded-md w-72"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-3 px-6 text-lg bg-gray-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Calculating..." : "Submit"}
        </button>
        <span className="relative inline-block cursor-pointer text-blue-600 group">
          ⓘ
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-52 bg-gray-700 text-white text-sm text-center rounded-md p-2 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible">
            The server might take a minute to start up before calculating your results, please give it a minute to finish or return to this page in a few minutes.
          </span>
        </span>
      </form>
  
      {error && <p className="text-red-600 mt-4 font-bold">{error}</p>}
  
      {originalSet && (
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto text-left">
          <h2 className="text-2xl text-gray-800 font-bold mb-4">Results:</h2>

          <p className="text-gray-600 mb-2">
            <strong>Partial Set:</strong> {originalSet.partial_set}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Low inverse:</strong> {originalSet.low_parset}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Partial-Class Set:</strong> {
              originalSet.partial_class_set.split(", ").map((item, index) => (
                <React.Fragment key={index}>
                  <span className="underline">{item}</span>
                  {index < originalSet.partial_class_set.split(", ").length - 1 && ", "}
                </React.Fragment>
              ))
            }
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Low inverse:</strong> {
              originalSet.low_parcset.split(', ').map((item, index) => (
                <React.Fragment key={index}>
                  <span className="underline">{item}</span>
                  {index < originalSet.low_parcset.split(', ').length - 1 && ', '}
                </React.Fragment>
              ))
            }
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Partial-Set Class:</strong> {originalSet.partial_set_class}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>HCp:</strong> {originalSet.HCp} <strong>#HCp:</strong> {originalSet.cardHCp}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Partial-Class Set Class:</strong> {
              originalSet.partial_class_set_class.split(", ").map((item, index) => (
                <React.Fragment key={index}>
                  <span className="underline">{item}</span>
                  {index < originalSet.partial_class_set_class.split(", ").length - 1 && ", "}
                </React.Fragment>
              ))
            }
          </p>
          <p className="text-gray-600 mb-2">
            <strong>HCpc:</strong> {originalSet.HCpc} <strong>#HCpc:</strong> {originalSet.cardHCpc}
          </p>
  
          <h3 className="text-xl text-gray-800 font-bold mt-6 mb-4">
            Transpose your set
          </h3>
          <form
            onSubmit={handleTranspose}
            className="flex justify-center items-center gap-4 flex-wrap mb-8"
          >
            <input
              type="number"
              value={transposeValue}
              onChange={(e) => setTransposeValue(e.target.value)}
              placeholder="Enter transposition value"
              className="p-3 text-base border border-gray-300 rounded-md w-72"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-3 px-6 text-lg bg-gray-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Transposing..." : "Transpose"}
            </button>
          </form>
  
          {transposedData && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl text-gray-800 font-bold mb-4">
                Transposed Results:
              </h2>
              <p className="text-gray-600 mb-2">
                <strong>Partial Set:</strong> {transposedData.partial_set}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Partial-Class Set:</strong> {
                  transposedData.partial_class_set.split(', ').map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="underline">{item}</span>
                      {index < transposedData.partial_class_set.split(', ').length - 1 && ', '}
                    </React.Fragment>
                  ))
                }
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Partial Set low inverse:</strong> {transposedData.low_parset}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Partial-Class Set low inverse:</strong> {
                  transposedData.low_parcset.split(', ').map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="underline">{item}</span>
                      {index < transposedData.low_parcset.split(', ').length - 1 && ', '}
                    </React.Fragment>
                  ))
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;

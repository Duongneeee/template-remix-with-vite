import { useState } from 'react'

const SearchChartForm = ({ initialData, onSearch }:any) => {
    const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [element, setElement] = useState('');

const handleSearch = () => {
  // Perform data filtering based on the search criteria
  const filteredData = initialData.filter((item:any) => {
    const isDateInRange = (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
    const isElementMatch = !element || item.element === element;
    
    return isDateInRange && isElementMatch;
  });

  // Pass the filtered data to the parent component or perform any other action
  onSearch(filteredData);
};
  return (
    <div>
      <label>Date Range:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <label>Element:</label>
      <input type="text" value={element} onChange={(e) => setElement(e.target.value)} />

      <button onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchChartForm

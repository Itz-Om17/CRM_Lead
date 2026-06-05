import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Temporary stub pages for router verification
const DashboardStub = () => <div style={{ padding: '20px' }}><h2>Dashboard Page</h2><p>Coming soon...</p></div>;
const AddLeadStub = () => <div style={{ padding: '20px' }}><h2>Add Lead Page</h2><p>Coming soon...</p></div>;
const EditLeadStub = () => <div style={{ padding: '20px' }}><h2>Edit Lead Page</h2><p>Coming soon...</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardStub />} />
        <Route path="/add" element={<AddLeadStub />} />
        <Route path="/edit/:id" element={<EditLeadStub />} />
      </Routes>
    </Router>
  );
}

export default App;

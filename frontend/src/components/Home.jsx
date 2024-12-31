import React from 'react'
import { BrowserRouter as Router, Link } from "react-router-dom";
function Home() {
  return (
    <div className="text-center">
    <h1>Welcome to Satmar Inventory</h1>
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mt-5">
      <Link to="/inventory" className="btn btn-primary btn-lg">
        Inventory
      </Link>
      <Link to="/labels" className="btn btn-secondary btn-lg">
        Labels
      </Link>
      <Link to="/reports" className="btn btn-success btn-lg">
        Reports
      </Link>
    </div>
  </div>
  )
}

export default Home
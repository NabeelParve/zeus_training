import React from 'react'

function Loader({progress}) {
  return (
    <div className="progress" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar bg-success" style={{"width": progress+"%"}}>{progress}</div>
      </div>
  )
}

export default Loader
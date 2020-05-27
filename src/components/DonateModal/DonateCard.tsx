import React from 'react'

const DonateCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="donate-card shadow-lg d-flex flex-column justify-content-center"
      onClick={onClick}
    >
      <div className="pl-2 pr-4 d-flex flex-row align-items-center justify-content-between">
        <div>📫 a message from @_kalpal</div>
        <div className="icon">
          <i className="fas fa-chevron-right arrow submit-arrow" />
        </div>
      </div>
    </div>
  )
}

export default DonateCard

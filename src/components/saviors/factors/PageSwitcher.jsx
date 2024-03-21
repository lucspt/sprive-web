

export default function PageSwitcher({ currentPage, setCurrentPage, calcLastPage, }) {

  return (
    <div className="pages">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(1)}
    >
      <span 
        className="material-symbols-rounded pink-hov" 
      >
        first_page
      </span>
    </button>
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    >
      <span 
        className="material-symbols-rounded pink-hov" 
        >
        chevron_left
      </span>
    </button>
    <button
      disabled = {currentPage >= calcLastPage()}
      onClick={() => setCurrentPage(prev => prev + 1)}
    >
    <span 
      className="material-symbols-rounded pink-hov"
      >
      chevron_right
    </span>
    </button>
    <button
      disabled = {currentPage >= calcLastPage()}
      onClick={() => setCurrentPage(calcLastPage())}
    >
      <span 
        className="material-symbols-rounded pink-hov"
        >
        last_page
      </span>
    </button>
  </div>
  )
}
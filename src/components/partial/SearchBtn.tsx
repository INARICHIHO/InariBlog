import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBtn({ className }: { className?: string }) {
  function handleSearch() {
    const searchBar = document.getElementById("inline-search-bar");
    const results = document.querySelector(".popup");

    if (searchBar?.classList.contains("search-active")) {
      searchBar.classList.remove("search-active");
      results?.classList.remove("show");
    } else {
      searchBar?.classList.add("search-active");
      window.setTimeout(() => {
        searchBar?.querySelector("input")?.focus();
      }, 300);
    }
  }
  return (
    <span 
      className={className} 
      onClick={handleSearch}
      style={{ cursor: 'pointer' }}
    >
      <FontAwesomeIcon icon={faSearch} />
    </span>
  );
}

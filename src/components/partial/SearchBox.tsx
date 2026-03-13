import { useState, useEffect, useMemo, useRef } from "react";
import Fuse from "fuse.js";

const options = {
  keys: ["data.title", "data.description"],
  includeMatches: true,
  minMatchCharLength: 2,
  threshold: 0.5,
};

type SearchItem = {
  id: string;
  data: { title: string; description: string; pubDate?: string; };
};

export default function SearchBox({
  searchIndexUrl,
  postUrlPrefix,
}: {
  searchIndexUrl: string;
  postUrlPrefix: string;
  imageUrl?: string;
}) {
  const [searchList, setSearchList] = useState<SearchItem[]>([]);
  const [query, setQuery] = useState("");
  const fetchPromiseRef = useRef<Promise<void> | null>(null);

  const loadIndex = () => {
    if (searchList.length > 0 || fetchPromiseRef.current) return;
    fetchPromiseRef.current = window.fetch(searchIndexUrl)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setSearchList(data); })
      .catch(() => { fetchPromiseRef.current = null; });
  };

  const fuse = useMemo(() => new Fuse<SearchItem>(searchList, options), [searchList]);

  const posts = useMemo(() => 
    query.length > 1 ? fuse.search(query).map(r => r.item).slice(0, 5) : []
  , [query, fuse]);

  useEffect(() => {
    const input = document.getElementById("local-search-input") as HTMLInputElement;
    if (!input) return;

    const handleInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value;
      if (val.length > 1 && searchList.length === 0) loadIndex();
      setQuery(val);
    };

    input.addEventListener("input", handleInput);
    return () => input.removeEventListener("input", handleInput);
  }, [searchList]);

  // 如果没有输入，完全不渲染任何东西
  if (query.length <= 1) return null;

  return (
    <div className="search-result-popup">
      <ul className="reimu-hits" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((post, index) => (
          <li className="reimu-hit-item" key={index} style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <a href={`${postUrlPrefix}/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="hit-title" style={{ fontWeight: 'bold', color: 'var(--red-0)' }}>{post.data.title}</div>
              <div className="hit-desc" style={{ fontSize: '12px', opacity: 0.7 }}>{post.data.description}</div>
            </a>
          </li>
        ))}
      </ul>
      {posts.length === 0 && <div className="no-result" style={{ textAlign: 'center', padding: '10px' }}>No results found.</div>}
    </div>
  );
}

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

export default function LanguageBtn({ className }: { className?: string }) {
  const languages = [
    { name: "简体中文", code: "zh-cn" },
    { name: "繁體中文", code: "zh-tw" },
    { name: "English", code: "en" },
    { name: "日本語", code: "ja" },
  ];

  // 处理点击切换逻辑
  const changeLang = (code: string) => {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const langCodes = languages.map((l) => l.code);
    
    // 如果路径第一个段落已经是语言代码，则替换它
    if (langCodes.includes(pathSegments[0])) {
      pathSegments[0] = code;
    } else {
      // 否则在最前面插入语言代码
      pathSegments.unshift(code);
    }
    
    // 特殊处理：如果是返回默认语言（假设是 zh-cn），视你的路由配置决定是否移除前缀
    // 这里采用最通用的全显式路径跳转
    const targetUrl = '/' + pathSegments.join('/') + window.location.search;
    window.location.assign(targetUrl);
  };

  const toggleLangList = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = document.getElementById("lang-list");
    list?.classList.toggle("show");
  };

  return (
    <div className="lang-btn-container">
      <span className={className} onClick={toggleLangList} style={{ cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faLanguage} />
      </span>
      <ul id="lang-list">
        {languages.map((lang) => (
          <li key={lang.code} onClick={() => changeLang(lang.code)}>
            {lang.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
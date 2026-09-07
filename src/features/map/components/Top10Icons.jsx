const TOP10_SVG_DEFS = (
  <defs>
    <style>
      {`.primary { fill:#2B333B; } .water { fill:#5D8AA8; } .land { fill:#8B8362; } .stroke-primary { stroke:#2B333B; fill:none; stroke-linecap:round; stroke-linejoin:round; }`}
    </style>
  </defs>
);

const TOP10_ICONS = {
  "1": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <path className="primary" d="M45,85 C55,60 70,50 80,50 C90,50 105,60 115,85 L108,85 C100,68 90,60 80,60 C70,60 60,68 52,85 Z"/>
        <rect className="primary" x="55" y="85" width="50" height="35"/>
        <path className="primary" d="M20,112 C27,94 38,87 45,87 C52,87 63,94 70,112 L64,112 C58,99 51,94 45,94 C39,94 32,99 26,112 Z"/>
        <rect className="primary" x="27" y="112" width="36" height="25"/>
        <rect className="land" x="10" y="137" width="140" height="4"/>
      </g>
    </svg>
  ),
  "4": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <ellipse className="land" cx="80" cy="145" rx="55" ry="10"/>
        <path className="primary" d="M100,45 A42,42 0 1 0 100,129 L86,129 A28,28 0 1 1 86,45 Z"/>
      </g>
    </svg>
  ),
  "5": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="water" x="10" y="135" width="140" height="6"/>
        <path className="primary" d="M20,118 L140,118 L128,135 L32,135 Z"/>
        <rect className="primary" x="68" y="82" width="28" height="36"/>
        <rect className="primary" x="38" y="106" width="16" height="12"/>
        <line className="stroke-primary" x1="38" y1="110" x2="22" y2="108" strokeWidth="4"/>
        <line className="stroke-primary" x1="82" y1="82" x2="82" y2="58" strokeWidth="3"/>
        <line className="stroke-primary" x1="72" y1="60" x2="92" y2="60" strokeWidth="3"/>
      </g>
    </svg>
  ),
  "7": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="land" x="10" y="138" width="140" height="4"/>
        <path className="land" d="M38,138 A42,42 0 0 1 122,138 Z"/>
        <rect className="primary" x="75" y="98" width="10" height="40"/>
        <rect className="primary" x="54" y="123" width="9" height="15"/>
        <rect className="primary" x="97" y="123" width="9" height="15"/>
      </g>
    </svg>
  ),
  "8": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="water" x="10" y="100" width="140" height="38"/>
        <path className="stroke-primary" d="M55,100 Q80,75 105,100" strokeWidth="8"/>
        <rect className="primary" x="15" y="55" width="30" height="45"/>
        <path className="primary" d="M15,55 L30,35 L45,55 Z"/>
        <rect className="primary" x="115" y="55" width="30" height="45"/>
        <path className="primary" d="M115,55 L130,35 L145,55 Z"/>
      </g>
    </svg>
  ),
  "9": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="water" x="10" y="112" width="140" height="26"/>
        <rect className="primary" x="10" y="108" width="140" height="6"/>
        <path className="primary" d="M42,108 L58,108 L54,118 L46,118 Z"/>
        <line className="stroke-primary" x1="50" y1="108" x2="50" y2="82" strokeWidth="2.5"/>
        <path className="primary" d="M50,84 L50,108 L66,108 Z"/>
        <path className="primary" d="M85,108 L112,108 L105,120 L92,120 Z"/>
        <line className="stroke-primary" x1="98" y1="108" x2="98" y2="60" strokeWidth="3"/>
        <path className="primary" d="M98,63 L98,108 L124,108 Z"/>
      </g>
    </svg>
  ),
  "10": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="water" x="10" y="118" width="140" height="22"/>
        <path className="primary" d="M35,118 L95,118 L88,131 L42,131 Z"/>
        <rect className="primary" x="55" y="103" width="18" height="15"/>
        <line className="stroke-primary" x1="64" y1="103" x2="64" y2="85" strokeWidth="3"/>
        <rect className="primary" x="106" y="87" width="34" height="6"/>
        <rect className="primary" x="110" y="93" width="5" height="25"/>
        <rect className="primary" x="121" y="93" width="5" height="25"/>
        <rect className="primary" x="132" y="93" width="5" height="25"/>
      </g>
    </svg>
  ),
  "14": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <rect className="land" x="10" y="140" width="140" height="4"/>
        <rect className="primary" x="20" y="90" width="25" height="50"/>
        <rect className="primary" x="48" y="70" width="30" height="70"/>
        <rect className="primary" x="81" y="95" width="25" height="45"/>
        <rect className="primary" x="109" y="80" width="28" height="60"/>
      </g>
    </svg>
  ),
  "178": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <path className="land" d="M10,140 L55,68 L80,100 L105,58 L150,140 Z"/>
        <path className="stroke-primary" d="M28,120 L55,68 L80,100 L105,58 L132,120" strokeWidth="7"/>
        <rect className="primary" x="66" y="90" width="28" height="22"/>
        <path className="land" d="M74,112 L74,101 A6,6 0 0 1 86,101 L86,112 Z"/>
        <path className="primary" d="M58,90 C63,79 71,73 80,73 C89,73 97,79 102,90 L95,90 C90,81 85,79 80,79 C75,79 70,81 65,90 Z"/>
      </g>
    </svg>
  ),
  "1043": (
    <svg viewBox="0 0 160 160" width="100%" height="100%">
      {TOP10_SVG_DEFS}
      <g>
        <path className="land" d="M10,140 Q80,85 150,140 Z"/>
        <line className="stroke-primary" x1="68" y1="118" x2="68" y2="100" strokeWidth="3"/>
        <line className="stroke-primary" x1="92" y1="118" x2="92" y2="100" strokeWidth="3"/>
        <rect className="primary" x="64" y="97" width="32" height="6"/>
        <path className="primary" d="M58,97 L80,78 L102,97 Z"/>
      </g>
    </svg>
  )
};
export default TOP10_ICONS;

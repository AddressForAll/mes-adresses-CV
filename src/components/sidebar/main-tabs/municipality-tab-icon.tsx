interface MunicipalityTabIconProps {
  country: string;
  label: string;
  className?: string;
}

function CountryFlag({ country }: { country: string }) {
  switch (country.toLowerCase()) {
    case "br":
      return (
        <>
          <rect x="31" y="8" width="44" height="28" fill="#169B62" />
          <path d="m53 11 17 11-17 11-17-11Z" fill="#FFDF00" />
          <circle cx="53" cy="22" r="6" fill="#002776" />
          <path
            d="M47.5 21c3.3-.9 7.1-.4 10.2 1.4"
            fill="none"
            stroke="#fff"
            strokeWidth="1.2"
          />
        </>
      );
    case "fr":
      return (
        <>
          <rect x="31" y="8" width="15" height="28" fill="#0055A4" />
          <rect x="46" y="8" width="14" height="28" fill="#fff" />
          <rect x="60" y="8" width="15" height="28" fill="#EF4135" />
        </>
      );
    case "us":
      return (
        <>
          <rect x="31" y="8" width="44" height="28" fill="#fff" />
          {[0, 1, 2, 3, 4, 5, 6].map((stripe) => (
            <rect
              key={stripe}
              x="31"
              y={8 + stripe * 4}
              width="44"
              height="2"
              fill="#B22234"
            />
          ))}
          <rect x="31" y="8" width="20" height="15" fill="#3C3B6E" />
          {[0, 1, 2].flatMap((row) =>
            [0, 1, 2, 3].map((column) => (
              <circle
                key={`${row}-${column}`}
                cx={34 + column * 4.5}
                cy={11 + row * 4.2}
                r="0.7"
                fill="#fff"
              />
            ))
          )}
        </>
      );
    default:
      return <rect x="31" y="8" width="44" height="28" fill="#D8DEE9" />;
  }
}

/** A civic-building illustration whose facade carries the BAL's country flag. */
export default function MunicipalityTabIcon({
  country,
  label,
  className,
}: MunicipalityTabIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 88 88"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{label}</title>
      <defs>
        <clipPath id="municipality-country-flag">
          <path d="M31 9c14-2 29-1 44 2v24c-15-3-30-4-44-2Z" />
        </clipPath>
      </defs>
      <g stroke="#101828" strokeLinejoin="round">
        <path d="M30 9v61" fill="none" strokeWidth="2" />

        <path d="M12 64h64l8 7H4Z" fill="#D94B45" strokeWidth="1.5" />
        <path d="M12 70h64v14H12Z" fill="#E4D6C8" strokeWidth="1.5" />
        <path d="M24 65 44 49l20 16v19H24Z" fill="#F7F0E8" strokeWidth="1.5" />
        <path d="m22 65 22-18 22 18-4 3-18-14-18 14Z" fill="#EF6A5B" />
        <circle cx="44" cy="69" r="6" fill="#D8C5B4" stroke="none" />
        <path d="M40 84V73h8v11" fill="#D8C5B4" stroke="none" />
        <path d="M4 84h80v4H4Z" fill="#D94B45" strokeWidth="1.5" />

        <g clipPath="url(#municipality-country-flag)" stroke="none">
          <CountryFlag country={country} />
        </g>
        <path
          d="M31 9c14-2 29-1 44 2v24c-15-3-30-4-44-2Z"
          fill="none"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

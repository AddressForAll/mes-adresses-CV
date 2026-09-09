import { Pane, Badge } from "evergreen-ui";

export interface BadgeSelectOption {
  /** Stable value handed back to `onChange` — never translated. */
  value: string;
  /** What the user reads. */
  label: string;
}

interface BadgeSelectProps {
  options: readonly BadgeSelectOption[];
  onChange: (value: string) => void;
  value: string;
}

export function BadgeSelect({ options, onChange, value }: BadgeSelectProps) {
  return (
    <Pane display="flex" flexWrap="wrap">
      {options.map((option) => (
        <Badge
          key={option.value}
          marginRight={8}
          marginBottom={8}
          onClick={() => onChange(option.value)}
          isInteractive
          color={value === option.value ? "blue" : "neutral"}
          userSelect="none"
        >
          {option.label}
        </Badge>
      ))}
    </Pane>
  );
}

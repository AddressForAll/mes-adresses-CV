"use client";

import { useState } from "react";
import { Text, Strong, Icon, CaretUpIcon, CaretDownIcon } from "evergreen-ui";
import { useTranslations } from "next-intl";

interface TextWrapperProps {
  placeholder?: string;
  isOpenDefault?: boolean;
  children: React.ReactNode;
}

function TextWrapper({
  placeholder,
  isOpenDefault = false,
  children,
}: TextWrapperProps) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  // Resolved here rather than as a default argument: a default arg is evaluated
  // before the hook runs, so it could not be translated.
  const label = placeholder ?? t("learnMore");
  return (
    <>
      <Text
        display="flex"
        alignItems="center"
        textDecoration="underline"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Strong fontSize={12}>{label}</Strong>
        <Icon icon={isOpen ? CaretUpIcon : CaretDownIcon} />
      </Text>

      {isOpen && children}
    </>
  );
}

export default TextWrapper;

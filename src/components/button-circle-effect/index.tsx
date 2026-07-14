import React from "react";
import { Icon, IconComponent, Pane, Spinner, Text } from "evergreen-ui";
import styles from "./button-circle-effect.module.css";

interface ButtonCircleEffectProps {
  label: string;
  onClick: () => void;
  icon: IconComponent;
  isLoading?: boolean;
}

function ButtonCircleEffect({ label, onClick, icon, isLoading = false }: ButtonCircleEffectProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={styles["button-circle-effect"]}
    >
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="center"
        zIndex={0}
        position="relative"
      >
        <div className={styles.overlay} />
        <div className={styles["circle"]}>
          {!isLoading && <Icon icon={icon} size={40} color="white" />}
        </div>
        {isLoading && (
          <Pane
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            zIndex={20000}
          >
            <Spinner size={40} />
          </Pane>
        )}
      </Pane>
      <Pane marginTop={20} textAlign="center" zIndex={10} position="relative">
        <Text fontSize={18} fontWeight={500} className={styles["button-label"]}>
          {label}
        </Text>
      </Pane>
    </button>
  );
}

export default ButtonCircleEffect;

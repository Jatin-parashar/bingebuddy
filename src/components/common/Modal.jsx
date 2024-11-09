import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add(styles["modal-open"]);
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.body.classList.remove(styles["modal-open"]);
    }

    return () => {
      document.body.classList.remove(styles["modal-open"]);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]} ref={modalRef}>
        {children}
      </div>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;

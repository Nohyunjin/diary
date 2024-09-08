import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const SnackbarContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  background-color: ${({ type }) =>
    type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
`;

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  show,
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return <SnackbarContainer type={type}>{message}</SnackbarContainer>;
};

export default Snackbar;

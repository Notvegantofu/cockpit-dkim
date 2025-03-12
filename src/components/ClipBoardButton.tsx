import React from "react";
import { Button } from '@patternfly/react-core';

interface ButtonProps {
  handleCopying: (publicKey: string) => void;
  publicKey: string;
}

export const ClipBoardButton: React.FunctionComponent<ButtonProps> = ({ handleCopying, publicKey }) => {

  function copyToClipBoard() {
    handleCopying(publicKey)
  }

  return (
    <Button variant="primary" onClick={copyToClipBoard}>Copy to Clipboard</Button>
  )
}
import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export declare function Button(props: ButtonProps): JSX.Element;
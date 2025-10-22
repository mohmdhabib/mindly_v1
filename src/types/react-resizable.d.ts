declare module 'react-resizable' {
  import * as React from 'react';

  export interface ResizableBoxProps {
    width: number;
    height: number;
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    resizeHandles?: string[];
    className?: string;
    children?: React.ReactNode;
  }

  export class ResizableBox extends React.Component<ResizableBoxProps> {}
}
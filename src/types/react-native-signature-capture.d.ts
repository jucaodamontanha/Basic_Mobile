declare module 'react-native-signature-capture' {
    import React from 'react';
    import { ViewProps } from 'react-native';
  
    export interface SignatureCaptureProps extends ViewProps {
      onSaveEvent?: (result: { pathName: string; encoded: string }) => void;
      onDragEvent?: () => void;
      saveImageFileInExtStorage?: boolean;
      showNativeButtons?: boolean;
      showTitleLabel?: boolean;
      viewMode?: 'portrait' | 'landscape';
    }
  
    export default class SignatureCapture extends React.Component<SignatureCaptureProps> {}
  }
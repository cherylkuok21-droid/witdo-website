
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import SignaturePad from '@/lib/signature_pad';

interface SignaturePadProps {
  onEnd?: () => void;
  penColor?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface SignaturePadRef {
  clear: () => void;
  toDataURL: (type?: string, encoderOptions?: number) => string;
  isEmpty: () => boolean;
  fromDataURL: (dataUrl: string, options?: any) => Promise<void>;
}

const CustomSignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>((props, ref) => {
  const { onEnd, penColor = 'black', backgroundColor = 'rgba(0,0,0,0)', className, style } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<typeof SignaturePad | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const pad = new SignaturePad(canvasRef.current, {
        penColor,
        backgroundColor,
      });

      signaturePadRef.current = pad;

      if (onEnd) {
        pad.addEventListener('endStroke', onEnd);
      }

      // Handle resize
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const canvas = canvasRef.current;
        if (canvas) {
          const data = pad.toData();
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext('2d')?.scale(ratio, ratio);
          pad.clear(); // clear resets the internal state
          pad.fromData(data);
        }
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      return () => {
        pad.off();
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [penColor, backgroundColor, onEnd]);

  useImperativeHandle(ref, () => ({
    clear: () => signaturePadRef.current?.clear(),
    toDataURL: (type, encoderOptions) => signaturePadRef.current?.toDataURL(type, encoderOptions) || '',
    isEmpty: () => signaturePadRef.current?.isEmpty() || true,
    fromDataURL: (dataUrl, options) => signaturePadRef.current?.fromDataURL(dataUrl, options) || Promise.resolve(),
  }));

  return (
    <canvas 
      ref={canvasRef} 
      className={className} 
      style={{ ...style, touchAction: 'none' }} 
    />
  );
});

export default CustomSignaturePad;

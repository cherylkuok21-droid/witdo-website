
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import SignaturePad from '@/lib/signature_pad.js';

interface SignaturePadProps {
  initialDataUrl?: string;
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
  const { initialDataUrl, onEnd, penColor = 'black', backgroundColor = 'rgba(0,0,0,0)', className, style } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<any>(null);
  const lastDataUrlRef = useRef<string | null>(null);

  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    if (canvasRef.current) {
      const pad = new SignaturePad(canvasRef.current, {
        penColor,
        backgroundColor,
      });

      signaturePadRef.current = pad;

      const handleEndStroke = () => {
        if (onEndRef.current) {
          onEndRef.current();
        }
      };

      pad.addEventListener('endStroke', handleEndStroke as any, undefined);

      // Handle resize
      const resizeCanvas = () => {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const canvas = canvasRef.current;
        if (canvas) {
          const data = pad.toData();
          // Also save the visual state if it was loaded from a URL and not yet modified
          const currentDataUrl = pad.isEmpty() ? null : pad.toDataURL();
          
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
          pad.clear(); 
          
          if (data && data.length > 0) {
            pad.fromData(data);
          } else if (currentDataUrl) {
            pad.fromDataURL(currentDataUrl);
          } else if (initialDataUrl) {
            pad.fromDataURL(initialDataUrl);
          }
        }
      };

      window.addEventListener('resize', resizeCanvas);
      
      // Load initial data if provided
      if (initialDataUrl) {
        pad.fromDataURL(initialDataUrl).then(() => {
          resizeCanvas(); // Ensure it's sized correctly after loading
        });
      } else {
        resizeCanvas();
      }

      return () => {
        pad.off();
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, [penColor, backgroundColor, initialDataUrl]);

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

'use client';

import { useEffect, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import Image from 'next/image';
import BtnSpinner from '../btnSpinner';

export default function PdfThumbnail({ url }: { url: string }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Garante que o worker está correto
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

        const response = await fetch(url);
        const pdfData = await response.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: pdfData });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Configuração do canvas
        const viewport = page.getViewport({ scale: 0.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        // Converte o canvas para imagem base64
        setThumbnail(canvas.toDataURL());
      } catch (error) {
        console.error('Erro ao carregar PDF:', error);
        setThumbnail(null);
      }
    };

    loadPdf();
  }, [url]);

  return thumbnail ? (
    <Image
      src={thumbnail}
      alt="PDF Thumbnail"
      width={250}
      height={360}
      quality={100}
      style={{
        borderRadius: '20px'
      }}
    />
  ) : (
    <BtnSpinner/>
  );
}

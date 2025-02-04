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
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

        const response = await fetch(url);
        const pdfData = await response.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: pdfData });

        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // 🔹 Definimos um novo viewport com escala ajustada
        const scale = 0.39; // Aumentamos um pouco a escala para melhor qualidade
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;

        const targetHeight = 200; // 🔹 Altura visível desejada
        const offsetY = viewport.height * 0.0001// 🔹 Move a imagem para baixo

        canvas.width = viewport.width;
        canvas.height = targetHeight;

        // 🔹 Ajustamos a posição para capturar a área certa
        await page.render({
          canvasContext: context,
          viewport,
          transform: [1, 0, 0, 1, 0, -offsetY], // 🔹 Move a imagem para baixo
        }).promise;

        setThumbnail(canvas.toDataURL());
      } catch (error) {
        setThumbnail(null);
      }
    };

    loadPdf();
  }, [url]);

  return thumbnail ? (
    <div
      style={{
        height: '200px',  // Garante a altura fixa
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <Image
        src={thumbnail}
        alt="PDF Thumbnail"
        width={250}
        height={200}
        quality={100}
        style={{
          objectFit: 'cover'
        }}
      />
    </div>

  ) : (
    <BtnSpinner />
  );
}

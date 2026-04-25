"use client";

export default function PdfViewer({ url }: { url: string }) {
  return (
    <div className="w-full h-[700px] bg-gray-100">
      <iframe
        src={`${url}#toolbar=0`}
        className="w-full h-full border-none"
        title="PDF Viewer"
      ></iframe>
    </div>
  );
}

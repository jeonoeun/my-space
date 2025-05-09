"use client";

import { NotionRenderer } from "react-notion-x";
import dynamic from "next/dynamic";
import { ExtendedRecordMap } from "notion-types";
import Link from "next/link";

type RendererProps = {
  recordMap: ExtendedRecordMap;
  rootPageId: string;
};

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

export default function Renderer({ recordMap, rootPageId }: RendererProps) {
  return (
    <div>
      <NotionRenderer
        recordMap={recordMap}
        darkMode={false}
        rootPageId={rootPageId}
        previewImages
        components={{ nextLink: Link, Collection, Code, Equation, Modal, Pdf }}
      />
    </div>
  );
}

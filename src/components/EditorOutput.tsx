"use client";
import { FC } from "react";
import dynamic from "next/dynamic";

import Image from "next/image";
const Output = dynamic(async () => (await import("editorjs-react-renderer")).default, { ssr: false });

interface EditorOutputProps {
	content: any;
}

const renderers = {
	image: CustomImageRenderer,
	code: CustomCodeRenderer,
};

const style = {
	paragraph: {
		fontSize: "0.875rem",
		lineHeight: "1.25rem",
	},
};

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
	return <Output style={style} className="text-sm" renderers={renderers} data={content} />;
};

function CustomCodeRenderer({ data }: any) {
	data;

	return (
		<pre className="rounded-md bg-gray-800 p-4">
			<code className="text-sm text-gray-100">{data.code}</code>
		</pre>
	);
}

function CustomImageRenderer({ data }: any) {
	const src = data.file.url;

	return (
		<div className="relative min-h-[15rem] w-full">
			<Image alt="image" className="object-contain" fill src={src} />
		</div>
	);
}

export default EditorOutput;

import * as React from 'react';
import markdoc, { type RenderableTreeNodes } from '@markdoc/markdoc';

export function Markdown({ content }: { content: RenderableTreeNodes }) {
	return (
		<div className="prose prose-zinc mx-auto max-w-screen-sm">
			{markdoc.renderers.react(content, React)}
		</div>
	);
}

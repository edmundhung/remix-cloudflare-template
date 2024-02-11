import markdoc from '@markdoc/markdoc';

export function parse(markdown: string) {
	const ast = markdoc.parse(markdown);
	const node = markdoc.transform(ast);

	return node;
}

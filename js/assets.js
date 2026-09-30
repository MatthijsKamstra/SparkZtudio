const GOOGLE_FONTS_HOST = 'fonts.googleapis.com';
const GOOGLE_FONT_FILES_HOST = 'fonts.gstatic.com';
const PROJECT_FONT_STYLE_ID = 'spark-project-fonts';

function blobToDataUrl(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error || new Error('Could not read the font file.'));
		reader.readAsDataURL(blob);
	});
}

function googleFontsUrl(value) {
	let url;
	try {
		url = new URL(value);
	} catch (e) {
		throw new Error('Enter a valid Google Fonts stylesheet URL.');
	}
	if (url.protocol !== 'https:' || url.hostname !== GOOGLE_FONTS_HOST || !/^\/css2?$/.test(url.pathname)) {
		throw new Error('Only https://fonts.googleapis.com/css or /css2 URLs are supported.');
	}
	return url.href;
}

/** Browser implementation. A desktop build can replace this module with a local font provider. */
export async function fetchGoogleFont(value) {
	const source = googleFontsUrl(value);
	const response = await fetch(source);
	if (!response.ok) throw new Error(`Google Fonts returned ${response.status}.`);
	let css = await response.text();
	const fontUrls = [...new Set([...css.matchAll(/url\(\s*['"]?(https:\/\/fonts\.gstatic\.com\/[^)'"\s]+)['"]?\s*\)/g)].map((match) => match[1]))];
	if (fontUrls.length === 0) throw new Error('The stylesheet did not contain any downloadable font files.');

	const embedded = new Map();
	await Promise.all(fontUrls.map(async (fontUrl) => {
		const url = new URL(fontUrl);
		if (url.hostname !== GOOGLE_FONT_FILES_HOST) throw new Error('Unexpected font file host.');
		const fontResponse = await fetch(url.href);
		if (!fontResponse.ok) throw new Error(`Could not download a font file (${fontResponse.status}).`);
		embedded.set(fontUrl, await blobToDataUrl(await fontResponse.blob()));
	}));
	for (const [fontUrl, dataUrl] of embedded) css = css.split(fontUrl).join(dataUrl);

	const families = [...new Set([...css.matchAll(/font-family:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]))];
	if (families.length === 0) throw new Error('The stylesheet did not declare a font family.');
	return { source, families, css };
}

export function injectProjectFonts(fonts = []) {
	let style = document.getElementById(PROJECT_FONT_STYLE_ID);
	if (!style) {
		style = document.createElement('style');
		style.id = PROJECT_FONT_STYLE_ID;
		document.head.appendChild(style);
	}
	style.textContent = fonts.map((font) => font.css).join('\n');
	return document.fonts?.ready || Promise.resolve();
}

export function readImageFile(file) {
	if (!file?.type?.startsWith('image/') || file.type === 'image/svg+xml') {
		return Promise.reject(new Error('Choose a PNG, JPEG, WebP, GIF, or other raster image.'));
	}
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error || new Error('Could not read the image.'));
		reader.onload = async () => {
			const image = new Image();
			image.src = reader.result;
			try {
				await image.decode();
				resolve({ name: file.name, dataUrl: reader.result, width: image.naturalWidth, height: image.naturalHeight });
			} catch (e) {
				reject(new Error('The selected image could not be decoded.'));
			}
		};
		reader.readAsDataURL(file);
	});
}

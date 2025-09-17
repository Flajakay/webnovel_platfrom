const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const {
	JSDOM
} = require('jsdom');
const {
	ValidationError
} = require('../errors');
const logger = require('../logger');

// Utility class for extracting chapter content from EPUB files
class EpubProcessor {

	static async processEpub(fileBuffer) {
		try {
			// Parse the EPUB file using JSZip
			const zip = new JSZip();
			const contents = await zip.loadAsync(fileBuffer);

			// Get the content.opf file and its directory
			const {
				content: contentOpf,
				directory: opfDir = ''
			} = await this.findContentOpf(contents) || {};
			
			if (!contentOpf) {
				throw new ValidationError('Invalid EPUB: content.opf not found');
			}

			// Create DOM parser and parse content.opf
			const jsdom = new JSDOM();
			const parser = new jsdom.window.DOMParser();
			const contentOpfDoc = parser.parseFromString(contentOpf, 'text/xml');

			// Find spine and extract reading order
			const spine = contentOpfDoc.querySelector('spine');
			if (!spine) {
				throw new ValidationError('Invalid EPUB: spine not found in content.opf');
			}

			const manifest = this.parseManifest(contentOpfDoc);
			const readingOrder = this.parseSpine(spine, manifest);

			// Extract chapters
			return this.extractChapters(contents, readingOrder, jsdom, opfDir);
		} catch (error) {
			throw new ValidationError(`Failed to process EPUB file: ${error.message}`);
		}
	}

	static async findContentOpf(zipContents) {
		// Get container.xml which points to content.opf
		const containerFile = zipContents.file('META-INF/container.xml');
		if (!containerFile) {
			logger.error('META-INF/container.xml not found in EPUB');
			return null;
		}

		const containerXml = await containerFile.async('string');
		const jsdom = new JSDOM();
		const parser = new jsdom.window.DOMParser();
		const containerDoc = parser.parseFromString(containerXml, 'text/xml');

		const rootfileElement = containerDoc.querySelector('rootfile');
		
		if (!rootfileElement) {
			return null;
		}

		const rootfilePath = rootfileElement.getAttribute('full-path');
		if (!rootfilePath) {
			return null;
		}

		// Get content.opf directory for resolving relative paths
		const opfDir = path.dirname(rootfilePath);
		const normalizedOpfDir = opfDir === '.' ? '' : `${opfDir}/`;

		// Get content.opf content
		const contentOpfFile = zipContents.file(rootfilePath);
		if (!contentOpfFile) {
			return null;
		}

		const content = await contentOpfFile.async('string');
		return {
			content,
			directory: normalizedOpfDir
		};
	}


	static parseManifest(contentOpfDoc) {
		const allowedMediaTypes = [
			'application/xhtml+xml',
			'text/html',
			'application/x-dtbncx+xml',
			'text/xml'
		];

		return Array.from(contentOpfDoc.querySelectorAll('manifest item'))
			.reduce((manifest, item) => {
				const id = item.getAttribute('id');
				const href = item.getAttribute('href');
				const mediaType = item.getAttribute('media-type');

				if (id && href && allowedMediaTypes.includes(mediaType)) {
					manifest[id] = href;
				}

				return manifest;
			}, {});
	}

	// Parse the spine element to get the reading order
	static parseSpine(spine, manifest) {
		return Array.from(spine.querySelectorAll('itemref'))
			.map(itemref => {
				const idref = itemref.getAttribute('idref');
				return idref && manifest[idref] ? manifest[idref] : null;
			})
			.filter(Boolean);
	}

	// Resolve a path relative to the OPF directory
	static resolvePath(filePath, opfDir) {
		return filePath.startsWith('/') ? filePath.substring(1) : opfDir + filePath;
	}

	static async extractChapters(zipContents, readingOrder, jsdom, opfDir) {
		const parser = new jsdom.window.DOMParser();
		const chapters = [];

		for (let i = 0; i < readingOrder.length; i++) {
			const relativePath = readingOrder[i];
			const filePath = this.resolvePath(relativePath, opfDir);
			const chapterNumber = i + 1;

			// Try to get file at primary path
			let file = zipContents.file(filePath);
			let resolvedPath = filePath;

			// If not found, try alternative paths
			if (!file) {
				const altPaths = this.generateAlternativePaths(filePath, opfDir, relativePath);

				for (const altPath of altPaths) {
					file = zipContents.file(altPath);
					if (file) {
						resolvedPath = altPath;
						break;
					}
				}
			}

			try {
				if (!file) {
					logger.warn(`Chapter file not found: ${filePath}`);
					continue;
				}
				
				const htmlContent = await file.async('string');
				const chapter = this.processChapterContent(htmlContent, chapterNumber, resolvedPath, parser);

				if (chapter) {
					chapters.push(chapter);
				} 
			} catch (error) {
				logger.error(`Error processing chapter ${chapterNumber}: ${error.message}`);
			}
		}

		return chapters;
	}

	static generateAlternativePaths(originalPath, opfDir, relativePath) {
		const alternatives = [];

		// Try without the directory
		if (originalPath.includes('/')) {
			alternatives.push(path.basename(originalPath));
		}

		// Common EPUB directory prefixes
		const commonPrefixes = ['OEBPS/', 'content/', 'OPS/'];

		for (const prefix of commonPrefixes) {
			if (!originalPath.startsWith(prefix)) {
				alternatives.push(prefix + originalPath);
			}
		}

		// Try directly with the relative path
		if (originalPath !== relativePath) {
			alternatives.push(relativePath);
		}

		// Try removing leading directories
		const parts = originalPath.split('/');
		if (parts.length > 1) {
			alternatives.push(parts[parts.length - 1]);
		}

		return alternatives;
	}


	static processChapterContent(htmlContent, chapterNumber, filePath, parser) {
		if (!htmlContent || htmlContent.trim().length === 0) {
			return null;
		}

		// Parse the HTML
		const htmlDoc = parser.parseFromString(htmlContent, 'text/html');
		const body = htmlDoc.querySelector('body');

		if (!body) {
			return null;
		}

		// Extract title or use default
		const title = this.extractTitle(htmlDoc) || `Chapter ${chapterNumber}`;

		// Create a clone to avoid modifying the original during cleanup
		const bodyClone = body.cloneNode(true);
		
		// Clean and extract content
		this.cleanupHtml(bodyClone);
		const content = bodyClone.innerHTML.trim();

		// Skip chapters with very little content
		if (content.length < 100) {
			return null;
		}

		return {
			chapterNumber,
			title,
			content
		};
	}

	static extractTitle(htmlDoc) {
		// Try different elements that might contain the title
		const titleSelectors = [
			'h1', 'h2', 'h3', 'title',
			'.chapter-title', '.title',
			'[class*="title"]', '[class*="chapter"]',
			'header', '.header'
		];

		for (const selector of titleSelectors) {
			const element = htmlDoc.querySelector(selector);
			if (element?.textContent?.trim()) {
				return element.textContent.trim();
			}
		}

		return '';
	}

	static cleanupHtml(element) {
		try {
			const document = element.ownerDocument;
			const allowedTags = ['p', 'br', 'h2', 'h3', 'h4', 'h5'];
			
			// Simple utility function to create a new element with text content
			const createSimpleElement = (tagName, textContent) => {
				const el = document.createElement(tagName);
				el.textContent = textContent;
				return el;
			};
			
			// First pass: remove all script, style and non-content elements
			const removeElements = [
				'script', 'style', 'link', 'meta', 'noscript', 'iframe', 'object', 
				'embed', 'nav', 'aside', 'footer', 'svg', 'h1'
			];
			
			removeElements.forEach(selector => {
				const elements = element.querySelectorAll(selector);
				elements.forEach(el => {
					if (el.parentNode) {
						el.parentNode.removeChild(el);
					}
				});
			});
			
			// Second pass: process all elements in the tree
			const processNode = (node, newParent) => {
				// Skip processing if this node has been removed
				if (!node || !node.parentNode) return;
				
				// Handle text nodes - just append them to the new parent
				if (node.nodeType === 3) { // Text node
					if (node.textContent.trim()) {
						newParent.appendChild(document.createTextNode(node.textContent));
					}
					return;
				}
				
				// Handle element nodes
				if (node.nodeType === 1) { // Element node
					const tagName = node.tagName.toLowerCase();
					
					// For <br>, just add it directly
					if (tagName === 'br') {
						newParent.appendChild(document.createElement('br'));
						return;
					}
					
					// For heading tags, create a new heading with just the text
					if (['h2', 'h3', 'h4', 'h5'].includes(tagName)) {
						const heading = createSimpleElement(tagName, node.textContent.trim());
						if (heading.textContent) {
							newParent.appendChild(heading);
						}
						return;
					}
					
					// For paragraph tags, create a new paragraph and process its children
					if (tagName === 'p') {
						const paragraph = document.createElement('p');
						// Process children of the paragraph
						for (const child of node.childNodes) {
							if (child.nodeType === 3) { // Text node
								if (child.textContent.trim()) {
									paragraph.appendChild(document.createTextNode(child.textContent));
								}
							} else if (child.nodeType === 1) { // Element node
								// Only process <br> tags within paragraphs
								if (child.tagName.toLowerCase() === 'br') {
									paragraph.appendChild(document.createElement('br'));
								} else {
									// For other elements, just add their text content
									if (child.textContent.trim()) {
										paragraph.appendChild(document.createTextNode(child.textContent));
									}
								}
							}
						}
						
						if (paragraph.innerHTML.trim()) {
							newParent.appendChild(paragraph);
						}
						return;
					}
					
					// For block-level elements that aren't paragraphs, treat them like paragraphs
					if (['div', 'section', 'article', 'blockquote', 'li', 'td', 'th'].includes(tagName)) {
						// Check if it has any block-level children
						const hasBlockChildren = Array.from(node.children).some(child => {
							const childTag = child.tagName.toLowerCase();
							return ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'table', 'blockquote'].includes(childTag);
						});
						
						// If it has block-level children, process each child
						if (hasBlockChildren) {
							for (const child of node.childNodes) {
								processNode(child, newParent);
							}
						} else {
							// If it doesn't have block-level children, treat it as a paragraph
							const paragraph = document.createElement('p');
							paragraph.textContent = node.textContent.trim();
							
							if (paragraph.textContent) {
								newParent.appendChild(paragraph);
							}
						}
						return;
					}
					
					// For any other elements, process their children
					for (const child of node.childNodes) {
						processNode(child, newParent);
					}
				}
			};
			
			// Create a fresh container for the cleaned content
			const cleanContainer = document.createElement('div');
			
			// Process all top-level nodes in the body
			for (const child of element.childNodes) {
				processNode(child, cleanContainer);
			}
			
			// Replace the original content with the cleaned version
			element.innerHTML = cleanContainer.innerHTML;
			
			// Final cleanup
			// Remove empty paragraphs
			const emptyParagraphs = element.querySelectorAll('p:empty');
			emptyParagraphs.forEach(p => {
				if (p.parentNode) {
					p.parentNode.removeChild(p);
				}
			});
			
			// Replace consecutive <br> tags with just two
			let html = element.innerHTML;
			html = html.replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
			
			// Add empty paragraphs between content paragraphs for Quill editor
			const tempDiv = document.createElement('div');
			tempDiv.innerHTML = html;
			const contentParagraphs = Array.from(tempDiv.querySelectorAll('p'));
			
			// Build new HTML with empty paragraphs between content paragraphs
			let newHtml = '';
			for (let i = 0; i < contentParagraphs.length; i++) {
				newHtml += contentParagraphs[i].outerHTML;
				// Add empty paragraph after each paragraph except the last one
				if (i < contentParagraphs.length - 1) {
					newHtml += '<p>Nie wiem o co chodzi!</p>';
				}
			}
			html = newHtml;
			
			// Debug: log the final HTML to see if empty paragraphs are present
			logger.info('Final HTML after adding empty paragraphs:', html.substring(0, 500) + '...');
			
			// Update the element
			element.innerHTML = html;
			
		} catch (error) {
			logger.error('Error cleaning up HTML:', error);
			// If cleanup fails, at least try a simpler approach
			try {
				// Just extract text and add paragraph breaks
				const text = element.textContent.trim();
				const paragraphs = text.split(/\n\s*\n/);
				element.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
			} catch (e) {
				logger.error('Fallback cleanup also failed:', e);
			}
		}
	}
}

module.exports = EpubProcessor;
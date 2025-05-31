#!/usr/bin/env node
const fs = require("fs/promises");
const path = require("path");

// Configuration file path
const CONFIG_PATH = path.join(__dirname, "../scripts/conifg/config.json");

async function main() {
	try {
		// Read configuration
		const config = JSON.parse(await fs.readFile(CONFIG_PATH, "utf-8"));

		// Handle Windows paths properly
		const rootPath = path.resolve(config.scanPath);
		const outputPath = path.resolve(
			config.outputPath || "ts-file-report.txt"
		);

		// Async directory existence check
		try {
			await fs.access(rootPath);
		} catch {
			throw new Error(`Directory does not exist: ${rootPath}`);
		}

		console.log(`Scanning for TypeScript files in: ${rootPath}`);

		// Process a single TS file
		async function processTsFile(filePath, rootPath) {
			const stats = await fs.stat(filePath);
			const relativePath = path.relative(rootPath, filePath);

			const content = await fs.readFile(filePath, "utf-8");
			const lines = content.split(/\r?\n/).length;

			return {
				path: relativePath.replace(/\\/g, "/"),
				name: path.basename(filePath),
				size: stats.size,
				lines,
				content: content,
				lastModified: stats.mtime.toISOString(),
				fullPath: filePath.replace(/\\/g, "/"),
			};
		}

		// Recursively scan directory for .ts files
		async function scanForTsFiles(dirPath, rootPath) {
			let results = [];
			try {
				const items = await fs.readdir(dirPath, {
					withFileTypes: true,
				});

				for (const item of items) {
					const fullPath = path.join(dirPath, item.name);

					if (item.isDirectory()) {
						const subDirResults = await scanForTsFiles(
							fullPath,
							rootPath
						);
						results = results.concat(subDirResults);
					} else if (
						item.isFile() &&
						path.extname(fullPath).toLowerCase() === ".ts"
					) {
						try {
							const fileInfo = await processTsFile(
								fullPath,
								rootPath
							);
							results.push(fileInfo);
							console.log(`Processed: ${fileInfo.path}`);
						} catch (error) {
							console.warn(
								`Could not process ${fullPath}: ${error.message}`
							);
						}
					}
				}
			} catch (error) {
				console.error(`Error scanning ${dirPath}:`, error.message);
			}

			return results;
		}

		const tsFiles = await scanForTsFiles(rootPath, rootPath);

		// Generate text report
		let textReport = `TypeScript File Scan Report\n`;
		textReport += `=========================\n\n`;
		textReport += `Scan Path: ${rootPath}\n`;
		textReport += `Scan Date: ${new Date().toISOString()}\n`;
		textReport += `Total Files: ${tsFiles.length}\n\n`;
		textReport += `Files:\n`;
		textReport += `======\n\n`;

		tsFiles
			.sort((a, b) => a.path.localeCompare(b.path))
			.forEach((file) => {
				textReport += `File: ${file.path}\n`;
				textReport += `Name: ${file.name}\n`;
				textReport += `Size: ${file.size} bytes\n`;
				textReport += `Lines: ${file.lines}\n`;
				textReport += `Last Modified: ${file.lastModified}\n`;
				textReport += `Full Path: ${file.fullPath}\n`;
				textReport += `\nContent:\n`;
				textReport += `${file.content}\n`;
				textReport += `\n${"-".repeat(80)}\n\n`;
			});

		await fs.writeFile(outputPath, textReport);
		console.log(
			`\nScan complete. Found ${tsFiles.length} TypeScript files.`
		);
		console.log(`Text report saved to ${outputPath}`);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

main();

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ExtensionContext } from 'vscode';
import { Configs } from './types';
import { getExtensionsJson, isConfirm, showExtensionsInMarketplaceSearch } from './utils';
import semver = require('semver');

const logger = vscode.window.createOutputChannel("Unwanted recommendations");
logger.show();

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	logger.appendLine('Extension "extensions-unwanted-recommendations" is now active!');

	// Check for extensions
	checkingExtensions(context);

	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand('extensions-unwanted-recommendations.checkPackages', () => {
		checkingExtensions(context, true);
	});

	context.subscriptions.push(disposable);
}

async function checkingExtensions(context: ExtensionContext, verbose = false) {
	// Get the extensions.json content
	const configs: Configs = await getExtensionsJson(verbose);

	// Make sure, that the unwantedRecommendations is defined, otherwise we have nothing to do
	let amountOfUnwantedRecommendations = configs.unwantedRecommendations?.length ?? 0;
	if (amountOfUnwantedRecommendations === 0) {
		logger.appendLine("No unwanted recommendations found.");
		verbose && vscode.window.showWarningMessage("No unwanted recommendations found.");
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Notification,
		title: "Unwanted recommendations",
		cancellable: false
	}, async (progress, token) => {
		// In case "cancellable" is set to true and the user canceled the operation
		token.onCancellationRequested(() => {
			logger.appendLine("User canceled operation");
		});

		return new Promise<void>(async (resolve) => {
			// Start checking for extensions
			progress.report({ increment: 25, message: "checking... 🕵️" });

			// Collect all unwanted recommendations which are still enabled
			let enabledUnwantedRecommendations: string[] = [];
			const installedExtensions = vscode.extensions.all;
			// Progress is already on 25, define the rest for every extension
			let progressStep = 75 / amountOfUnwantedRecommendations;

			// Iterate over the unwanted recommendations
			configs.unwantedRecommendations.map(async unwantedExtensionString => {
				progress.report({ increment: progressStep, message: unwantedExtensionString + "..." });

				const [unwantedExtensionId, versionRange] = unwantedExtensionString.split("@");
				logger.appendLine(unwantedExtensionId + "@" + versionRange);

				// Check if the extension is installed
				const unwantedExtension = installedExtensions.find(extension => extension.id.toLowerCase() === unwantedExtensionId.toLowerCase());
				logger.appendLine(`${unwantedExtensionId} is ${unwantedExtension ? "enabled" : "disabled"}`);

				// Check if the versionRange matches the version string, if there is a versionRange
				let versionMatch = undefined;
				if (unwantedExtension && versionRange) {
					const extensionVersion = unwantedExtension.packageJSON.version;
					if (semver.satisfies(extensionVersion, versionRange)) {
						logger.appendLine(`Version range "${extensionVersion}" matches "${versionRange}"`);
						versionMatch = true;
					} else {
						logger.appendLine(`Version range "${extensionVersion}" does NOT match "${versionRange}"`);
						versionMatch = false;
					}
				}

				// Extension must be enabled and if versionMatch exists it must be true (or undefined)
				if (unwantedExtension && versionMatch !== false) {
					enabledUnwantedRecommendations.push(unwantedExtensionId);

					const messageUnwantedExtension = `Its recommended to disable "${unwantedExtension.packageJSON.displayName}" (${unwantedExtension.id}) for this workspace`;
					const messageUnwantedExtensionVersion = `Its recommended to install another version of "${unwantedExtension.packageJSON.displayName}" for this workspace. Not recommended: ${unwantedExtension.id}@${versionRange}`;
					const message = versionMatch ? messageUnwantedExtensionVersion : messageUnwantedExtension;
					logger.appendLine(message);

					// Allow the user to click a single extension to verify in the extension marketplace
					const data = await vscode.window.showWarningMessage(message, { title: 'Show', value: 'show' },);
					if (data?.value === "show") {
						showExtensionsInMarketplaceSearch([unwantedExtension.id]);
					}
				}
			});

			if (enabledUnwantedRecommendations.length > 0) {
				// Show a summary for the user about enabled unwanted recommendations
				progress.report({ increment: 100, message: `Found ${enabledUnwantedRecommendations.length} enabled unwanted extensions!` });
				const result = await isConfirm("Display unwanted recommendations (extensions)?", "Do you want to display the unwanted recommendations (extensions)?\nIt's recommended to disable them for this workspace.\nYou need to do this manually.");
				if (result) {
					showExtensionsInMarketplaceSearch(enabledUnwantedRecommendations);
				}
			} else {
				// Checked, all unwanted extensions are disabled
				progress.report({ increment: 100, message: `Done ✔️` });
			}

			// Wait a bit until we resolve the progress indicator Notification
			await new Promise(resolveWaiting => setTimeout(resolveWaiting, 5000));
			resolve();
		});

	});
}


// This method is called when your extension is deactivated
export function deactivate() { }

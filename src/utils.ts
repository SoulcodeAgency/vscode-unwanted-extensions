import * as vscode from 'vscode';
import { Configs } from './types';
import * as Hjson from 'hjson';
import { logger } from './extension';

export async function getJsonConfig(uri: vscode.Uri): Promise<Configs> {
    const buffer = await vscode.workspace.fs.readFile(uri);
    // Hjson can handle/ignore comments within the json file
    const config: Configs = Hjson.parse(buffer.toString());

    // If workspace settings, return only the extensions
    if (config.extensions) {
        return config.extensions;
    }
    return config;
}

export async function getExtensionsJson(verbose = false): Promise<Configs> {
    // Check for default extensions.json file as well as extended ones with version numbers
    const fileGlob = '**/.vscode/extensions*.{json,jsonc}';
    const excludePattern = '**/node_modules/**';
    const files = await vscode.workspace.findFiles(fileGlob, excludePattern);

    logger.appendLine(`Found ${files.length} extension configuration files`);
    files.forEach(file => logger.appendLine(`- ${file.fsPath}`));

    // Add Workspace file if one exists
    const workspaceFile = vscode.workspace.workspaceFile;
    if (workspaceFile) {
        files.push(workspaceFile);
        logger.appendLine('');
        logger.appendLine(`Workspace file found: ${workspaceFile.fsPath}`);
        logger.appendLine('');
    }

    if (files.length === 0) {
        verbose && vscode.window.showWarningMessage('No defined extensions found, please define "unwantedRecommendations" within the ".vscode/extensions.json" file. See [documentation](https://github.com/SoulcodeAgency/vscode-unwanted-extensions) for more details.');
        logger.appendLine('No ".vscode/extensions.json" file found and no workspace is open');
        throw new Error('No ".vscode/extensions.json" file found and no workspace is open');
    } else {
        let configs: Configs = {
            recommendations: [],
            unwantedRecommendations: [],
        };

        await Promise.all(files.map(async file => {
            const config = await getJsonConfig(file);

            const hasConfig = config.recommendations || config.unwantedRecommendations;
            if (hasConfig) {
                logger.appendLine(`Found configuration in file: ${file.fsPath}`);
            } else {
                logger.appendLine(`No configuration found in file: ${file.fsPath}`);
            }
            
            // Merge the configs
            if (config.recommendations) {
                configs.recommendations = [...configs.recommendations, ...config.recommendations];
            }
            if (config.unwantedRecommendations) {
                configs.unwantedRecommendations = [...configs.unwantedRecommendations, ...config.unwantedRecommendations];
            }
        }));

        logger.appendLine('');

        if (configs.recommendations.length > 0) {
            logger.appendLine(`Found ${configs.recommendations.length} recommended extensions defined in the configuration`);
        } else {
            logger.appendLine('No recommendation definitions found in the configs');
        }
        if (configs.unwantedRecommendations.length > 0) {
            logger.appendLine(`Found ${configs.unwantedRecommendations.length} unwanted extensions defined in the configuration`);
        } else {
            logger.appendLine('No unwanted extensions defined in the configs');
        }
        return configs;
    }
}

export async function isConfirm(message: string, detail?: string): Promise<boolean> {
    interface MsgItem extends vscode.MessageItem { value: 'confirm' | 'cancel' };

    const data = await vscode.window.showInformationMessage<MsgItem>(
        message,
        { modal: true, detail: detail },
        { title: 'Yes', value: 'confirm' },
        { title: 'Cancel', isCloseAffordance: true, value: 'cancel' },
    );
    return data?.value === 'confirm';
}


export function showExtensionsInMarketplaceSearch(extensions: string[]) {
    vscode.commands.executeCommand('workbench.extensions.search', '@id:' + extensions.join(", @id:"));
}
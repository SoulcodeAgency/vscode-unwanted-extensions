/* eslint-disable @typescript-eslint/naming-convention */
import { ExtensionContext, window, extensions } from 'vscode';
import { updateMessages } from './config/releaseMessages.conf';
import { logger } from './extension';

export function checkUpdateNotification(context: ExtensionContext) {
  logger.appendLine('');
  logger.appendLine('Checking for extension updates...');
  
  const previousVersion = context.globalState.get<string>('version');
  const currentVersion = extensions.getExtension('soulcode.vscode-unwanted-extensions')?.packageJSON.version;

  logger.appendLine(`Previous version: ${previousVersion}`);
  logger.appendLine(`Current version: ${currentVersion}`);
  logger.appendLine('');

  if (previousVersion !== currentVersion) {
    // The extension has been updated, check if the new version has a different message than the previous one
    if (currentVersion && updateMessages[currentVersion] && (previousVersion === undefined || updateMessages[currentVersion] !== updateMessages[previousVersion])) {
      // There is a new update message for this version
      window.showInformationMessage(`Updated to version ${currentVersion}: ${updateMessages[currentVersion]}`);
    }

    // Store the current version
    context.globalState.update('version', currentVersion);
  }
}
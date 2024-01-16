/* eslint-disable @typescript-eslint/naming-convention */
import { ExtensionContext, window, extensions } from 'vscode';

// Define update messages
const updateMessages: { [version: string]: string } = {
  // Add more versions and messages as needed
  '1.2.0': 'This release allows to define semver versions per extension. See extension description for more details.',
  '1.1.2': 'This release allows to define semver versions per extension. See extension description for more details.',
};

export function checkUpdateNotification(context: ExtensionContext) {
  const previousVersion = context.globalState.get<string>('version');
  const currentVersion = extensions.getExtension('soulcode.vscode-unwanted-extensions')?.packageJSON.version;

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
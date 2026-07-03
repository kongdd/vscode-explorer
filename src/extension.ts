import * as vscode from 'vscode';
import { execFile } from 'child_process';
import { convertRemotePath, normalizeSlashes } from './pathMapping';

const CONFIG_SECTION = 'remoteZ';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('remoteZ.openInExplorer', (uri?: vscode.Uri) => openInExplorer(resolveUri(uri))),
    vscode.commands.registerCommand('remoteZ.openFile', (uri?: vscode.Uri) => openFile(resolveUri(uri))),
    vscode.commands.registerCommand('remoteZ.copyLocalPath', (uri?: vscode.Uri) => copyLocalPath(resolveUri(uri))),
  );
}

export function deactivate(): void {
  // No resources to dispose.
}

function resolveUri(uri?: vscode.Uri): vscode.Uri | undefined {
  if (uri) {
    return uri;
  }

  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    return activeEditor.document.uri;
  }

  return vscode.workspace.workspaceFolders?.[0]?.uri;
}

async function openInExplorer(uri?: vscode.Uri): Promise<void> {
  const localPath = toLocalPathOrNotify(uri);
  if (!localPath) {
    return;
  }

  await revealInLocalFileManager(localPath);
}

async function openFile(uri?: vscode.Uri): Promise<void> {
  const localPath = toLocalPathOrNotify(uri);
  if (!localPath) {
    return;
  }

  await openWithLocalDefaultApp(localPath);
}

async function copyLocalPath(uri?: vscode.Uri): Promise<void> {
  const localPath = toLocalPathOrNotify(uri);
  if (!localPath) {
    return;
  }

  await vscode.env.clipboard.writeText(localPath);
  void vscode.window.showInformationMessage(`Copied local path: ${localPath}`);
}

function toLocalUriOrNotify(uri?: vscode.Uri): vscode.Uri | undefined {
  const localPath = toLocalPathOrNotify(uri);
  return localPath ? vscode.Uri.file(localPath) : undefined;
}

async function revealInLocalFileManager(localPath: string): Promise<void> {
  if (process.platform === 'win32') {
    await execFileAsync('explorer.exe', ['/select,', toWindowsPath(localPath)]);
    return;
  }

  await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(localPath));
}

async function openWithLocalDefaultApp(localPath: string): Promise<void> {
  if (process.platform === 'win32') {
    await execFileAsync('cmd.exe', ['/c', 'start', '', toWindowsPath(localPath)]);
    return;
  }

  await vscode.env.openExternal(vscode.Uri.file(localPath));
}

function execFileAsync(file: string, args: readonly string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(file, [...args], (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

function toWindowsPath(path: string): string {
  return path.replace(/\//g, '\\');
}

function toLocalPathOrNotify(uri?: vscode.Uri): string | undefined {
  if (!uri) {
    void vscode.window.showWarningMessage('No file or folder is selected.');
    return undefined;
  }

  const localPath = convertSelectedRemotePath(uri.path);
  if (!localPath) {
    const remotePrefix = getNormalizedConfig('remotePrefix');
    void vscode.window.showWarningMessage(`Path is not under ${remotePrefix}: ${uri.path}`);
    return undefined;
  }

  return localPath;
}

function convertSelectedRemotePath(remotePath: string): string | undefined {
  return convertRemotePath(remotePath, getNormalizedConfig('remotePrefix'), getNormalizedConfig('localPrefix'));
}

function getNormalizedConfig(key: 'remotePrefix' | 'localPrefix'): string {
  const value = vscode.workspace.getConfiguration(CONFIG_SECTION).get<string>(key);
  return normalizeSlashes(value?.trim() || defaultConfigValue(key));
}

function defaultConfigValue(key: 'remotePrefix' | 'localPrefix'): string {
  return key === 'remotePrefix' ? '/mnt/z' : 'Z:/';
}

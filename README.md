# Remote Z Drive Explorer

> 仅供个人NAS服务器使用。vscode远程时，在本地打开NAS的文件夹或文件

VS Code extension for SSH remote sessions where `/mnt/z` on the remote machine
and `Z:/` on the local Windows machine point to the same network drive.

The extension runs in the local UI extension host, so local open operations use
the Windows path instead of the SSH remote path.

Install this extension on the local VS Code side. In an SSH Remote window it
must run as a UI extension, not as a remote workspace extension.

## Commands

- `Remote Z: Open in Local File Explorer`
- `Remote Z: Open in External App`
- `Remote Z: Copy Local Path`

These commands are available from the Explorer context menu, editor context menu,
and the command palette.

## Shortcuts

- `Ctrl+Alt+O` (`Cmd+Alt+O` on macOS): open the active editor file with the
  local default application.

VS Code extension keybindings do not support binding mouse gestures such as
`Ctrl+Click`. Use the shortcut above, the context menu, or the command palette.

## Local Windows Workspaces

When VS Code is opened directly on Windows, local files such as `D:/project/a.txt`
are opened as-is. Path conversion is only applied to remote paths under
`remoteZ.remotePrefix`.

Commands run only when the resolved local file or folder exists.

## Configuration

```json
{
  "remoteZ.remotePrefix": "/mnt/z",
  "remoteZ.localPrefix": "Z:/"
}
```

Example conversion:

```text
/mnt/z/project/data.csv -> Z:/project/data.csv
```

On Windows, `Open in Local File Explorer` calls `explorer.exe` locally and
`Open in External App` calls the local default application through
`cmd.exe /c start`.

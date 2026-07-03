# Remote Z Drive Explorer

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

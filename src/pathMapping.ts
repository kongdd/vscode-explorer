export function convertRemotePath(remotePath: string, remotePrefix: string, localPrefix: string): string | undefined {
  const normalizedRemotePrefix = stripTrailingSlashes(normalizeSlashes(remotePrefix));
  const normalizedLocalPrefix = stripTrailingSlashes(normalizeSlashes(localPrefix));
  const normalizedRemotePath = normalizeSlashes(remotePath);

  if (
    normalizedRemotePath !== normalizedRemotePrefix &&
    !normalizedRemotePath.startsWith(`${normalizedRemotePrefix}/`)
  ) {
    return undefined;
  }

  const suffix = normalizedRemotePath.slice(normalizedRemotePrefix.length).replace(/^\/+/, '');
  if (suffix) {
    return `${normalizedLocalPrefix}/${suffix}`;
  }

  return /^[A-Za-z]:$/.test(normalizedLocalPrefix) ? `${normalizedLocalPrefix}/` : normalizedLocalPrefix;
}

export function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/g, '');
}

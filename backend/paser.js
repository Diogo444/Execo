function listParseToJson(stdout) {
  return stdout
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .filter(line => !line.startsWith('total'))
    .map(line => {
      const match = line.match(/^([\-dl])([rwx-]{9})\s+(\d+)\s+(\S+)\s+(\d+)\s+([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{2}:\d{2}|\d{4})\s+(.+)$/);

      if (!match) {
        return {
          raw: line,
          parseError: true
        };
      }

      const [, fileType, permissionFlags, links, owner, sizeValue, month, day, timeOrYear, name] = match;
      const permissions = `${fileType}${permissionFlags}`;

      return {
        name,
        type: getFileType(fileType),
        permissions,
        permissionFlags,
        links: Number(links),
        owner,
        size: Number(sizeValue),
        date: {
          month,
          day: Number(day),
          timeOrYear
        },
        modifiedAtLabel: `${month} ${day} ${timeOrYear}`,
        isDirectory: fileType === 'd',
      };
    });
}

function getFileType(fileType) {
  const types = {
    '-': 'file',
    d: 'directory',
    l: 'symbolic-link'
  };

  return types[fileType] ?? 'unknown';
}

export { listParseToJson };

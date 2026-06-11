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

function listDockerParseToJson(stdout) {
  const lines = stdout
    .split('\n')
    .map(line => line.trimEnd())
    .filter(line => line.trim() !== '');

  const [header, ...rows] = lines;

  if (!header) {
    return [];
  }

  return rows.map(row => {
    const parsedRow = splitDockerColumns(header, row);

    if (!parsedRow) {
      return {
        raw: row,
        parseError: true
      };
    }

    return {
      containerId: parsedRow['CONTAINER ID'],
      image: parsedRow.IMAGE,
      command: cleanDockerCommand(parsedRow.COMMAND),
      created: parsedRow.CREATED,
      status: parseDockerStatus(parsedRow.STATUS),
      ports: parseDockerPorts(parsedRow.PORTS),
      names: parsedRow.NAMES
    };
  });
}

function splitDockerColumns(header, row) {
  const columns = getColumnPositions(header);
  const result = {};

  for (let index = 0; index < columns.length; index++) {
    const current = columns[index];
    const next = columns[index + 1];
    const value = row
      .slice(current.start, next ? next.start : undefined)
      .trim();

    result[current.name] = value;
  }

  return result.NAMES ? result : null;
}

function getColumnPositions(header) {
  const columnNames = ['CONTAINER ID', 'IMAGE', 'COMMAND', 'CREATED', 'STATUS', 'PORTS', 'NAMES'];

  return columnNames
    .map(name => ({
      name,
      start: header.indexOf(name)
    }))
    .filter(column => column.start !== -1)
    .sort((a, b) => a.start - b.start);
}

function cleanDockerCommand(command) {
  return command.replace(/^"|"$/g, '');
}

function parseDockerStatus(status) {
  const healthMatch = status.match(/\(([^)]+)\)/);

  return {
    raw: status,
    state: status.split(/\s+/)[0] ?? '',
    uptime: status.replace(/\s*\([^)]+\)/, '').replace(/^Up\s+/, ''),
    health: healthMatch?.[1] ?? null
  };
}

function parseDockerPorts(ports) {
  if (!ports) {
    return [];
  }

  return ports.split(',').map(port => port.trim()).filter(Boolean);
}

function getFileType(fileType) {
  const types = {
    '-': 'file',
    d: 'directory',
    l: 'symbolic-link'
  };

  return types[fileType] ?? 'unknown';
}

export { listDockerParseToJson, listParseToJson };

import * as os from 'os';

export function getHomedir(): string {
  if (process.env.MOCK_HOME_DIR) return process.env.MOCK_HOME_DIR;

  if (typeof os.userInfo === 'function') {
    try {
      const homedir = os.userInfo().homedir;
      if (homedir) return homedir;
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  if (typeof os.homedir === 'function') {
    return os.homedir();
  }

  return process.env.HOME;
}

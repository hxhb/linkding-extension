import { getStorageItem, setStorageItem } from "./browser";

const CONFIG_KEY = "ld_ext_config";
const DEFAULTS = {
  baseUrl: "",
  token: "",
  default_tags: "",
  useBrowserMetadata: false,
  preselectBackupToSinglefile: false,
  precacheEnabled: false,
  closeAddBookmarkWindowOnSave: false,
  closeAddBookmarkWindowOnSaveMs: 500,
};

export async function getConfiguration() {
  const configJson = await getStorageItem(CONFIG_KEY);
  const config = configJson ? JSON.parse(configJson) : {};
  const normalizedConfig = {
    ...DEFAULTS,
    ...config,
  };

  if (
    config.preselectBackupToSinglefile === undefined &&
    config.runSinglefile !== undefined
  ) {
    normalizedConfig.preselectBackupToSinglefile = config.runSinglefile;
  }

  return normalizedConfig;
}

export async function saveConfiguration(config) {
  const configJson = JSON.stringify(config);
  await setStorageItem(CONFIG_KEY, configJson);
}

export function isConfigurationComplete(config) {
  return config.baseUrl && config.token;
}

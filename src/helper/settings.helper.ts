import { NotionAPI, DatabaseID, SettingsDatabaseID } from '../settings.json';

class ModuleSettings {
  public NotionAPI: string = "";
  public DatabaseID: string = "";
  public SettingsDatabaseID: string = "";
}

export function getSettings(): ModuleSettings {
  const settings = new ModuleSettings();
  settings.NotionAPI = NotionAPI;
  settings.DatabaseID = DatabaseID;
  settings.SettingsDatabaseID = SettingsDatabaseID;

  return settings;
}
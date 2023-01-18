import { NotionAPI, DatabaseID, SettingsDatabaseID } from './settings.json';

export class ModuleSettings {
  public NotionAPI: string = "";
  public DatabaseID: string = "";
  public SettingsDatabaseID: string = "";

  isEmpty(): boolean {
    return NotionAPI=="" || DatabaseID=="" || SettingsDatabaseID=="";
  }
}

export function getSettings(): ModuleSettings {
  const settings = new ModuleSettings();
  settings.NotionAPI = NotionAPI;
  settings.DatabaseID = DatabaseID;
  settings.SettingsDatabaseID = SettingsDatabaseID;

  return settings;
}
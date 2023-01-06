import { getSettings } from "../src/helper/settings.helper";

 
describe('testing settings file', () => {
  const settings = getSettings();
  test('Settings can be read', () => {
    expect(settings).toBeDefined();
  });  
  test('Settings are not empty', () => {
    expect(settings.DatabaseID.length).toBeGreaterThan(0);
    expect(settings.NotionAPI.length).toBeGreaterThan(0);
    expect(settings.SettingsDatabaseID.length).toBeGreaterThan(0);
  });
});
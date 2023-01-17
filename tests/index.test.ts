import { Client } from "@notionhq/client";
import { SyncCalendarModule } from '../src/index' 
import { getSettings } from "../src/helper/settings.helper";

 
describe('testing index file', () => {  
  const settings = getSettings();
  const notion = new Client({
    auth: settings.NotionAPI,
  });
  const calendarModule = new SyncCalendarModule(settings);
  test('Class can be create', () => {
    expect(calendarModule).toBeDefined();
  });

  describe('testing module method file', () => { 
    test('Can retrieve notion database for settings', async () => {        
      const notionSettings = await calendarModule.getNotionCalendarSettings(notion);
      expect(notionSettings).toBeDefined();
      expect(notionSettings.length).toBeGreaterThan(0);
    });

    test('Can update a calendar', async () => {
      const notionSettings = await calendarModule.getNotionCalendarSettings(notion);
      await calendarModule.updateACalendar(notion, notionSettings[0].properties, notionSettings[0].id);
    });
  });
});
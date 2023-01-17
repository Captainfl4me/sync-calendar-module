import { getSettings } from "../src/helper/settings.helper";

 
describe('testing settings file', () => {
  const settings = getSettings();
  test('Settings can be read', () => {
    expect(settings).toBeDefined();
  });  
  test('Settings are not empty', () => {
    expect(settings.isEmpty()).toBeFalsy();
  });
});
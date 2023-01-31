import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

//import { async, DateWithTimeZone, VEvent } from 'node-ical';
const ical = require('node-ical');

export class ModuleSettings {
  public DatabaseID: string = "";
  public SettingsDatabaseID: string = "";
}

export class SyncCalendarModule {
  private _settings: ModuleSettings;

  constructor(settings: ModuleSettings = new ModuleSettings()){
    this._settings = settings;
  }

  async getNotionCalendarSettings(notion: Client): Promise<PageObjectResponse[]>{
    const dbSettings = await notion.databases.query({database_id: this._settings.SettingsDatabaseID});
    return dbSettings.results as Array<PageObjectResponse>;
  }

  async updateACalendar(notion: Client, settings: any, notionSettingsRawId: string){
    if (settings.URL.type !== 'url') return;
    const url = settings.URL.url as string;
    console.log(url);

    console.time('calendar')
    const webEvents = Object.values(await ical.async.fromURL(url));
    let promises = [];
    for(let j = 0; j < webEvents.length; j++){
      const event = webEvents[j] as any;

      if(event.type !== 'VEVENT') continue;

      promises.push(this.UpdateEvent(notion, this._settings.DatabaseID, notionSettingsRawId, event));
    }
    console.log("Requests build waiting to complete...");
    await Promise.all(promises);
    console.timeEnd('calendar');
  }

  async UpdateEvent(notion: Client, notionDatabaseId: string, notionSettingsRawId: string, event: any){  
    const resultFromNotion = await notion.databases.query({
      database_id: notionDatabaseId,
      filter: {
        and: [{
          property: "UID",
          rich_text: {
            contains: event.uid,
          }}],
      }
    });
    //Event already in databse -> update : create
    if(resultFromNotion.results.length > 0){
      const eventFromNotion = resultFromNotion.results[0] as PageObjectResponse;
      if(eventFromNotion.object !== 'page') return;

      //console.log(eventFromNotion);
      await notion.pages.update({
        page_id: eventFromNotion.id,
        properties: {
          "Titre": {
            "title": [{
              "type": "text",
              "text": {
                "content": event.summary
          }}]},
          "UID": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": event.uid
          }}]},
          "Lieu": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": event.location
          }}]},
          "Date": {
            "date": {
              "start": toIsoString(event.start),
              "end": toIsoString(event.end)
          }}
        }
      });
    }else{ 
      await notion.pages.create({
        parent: {
          database_id: notionDatabaseId,
          type: 'database_id'
        },
        properties: {
          "Titre": {
            "title": [{
              "type": "text",
              "text": {
                "content": event.summary
          }}]},
          "UID": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": event.uid
          }}]},
          "Lieu": {
            "rich_text": [{
              "type": "text",
              "text": {
                "content": event.location
          }}]},
          "Date": {
            "date": {
              "start": toIsoString(event.start),
              "end": toIsoString(event.end)
          }},
          "Calendar": {
            "relation": [
              {
                "id": notionSettingsRawId
          }]}
        },
        children: [
          {
            "object": "block",
            "paragraph": {
              "rich_text": [
                {
                  type: "text",
                  text: {
                    content: event.description
          }}]}
        }]
      });
    }
  }
}

function toIsoString(date: any) {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = (num: number) => {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}
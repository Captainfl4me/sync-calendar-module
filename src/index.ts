import { Client } from "@notionhq/client";
import { getSettings } from "./helper/settings.helper";

const settings = getSettings();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

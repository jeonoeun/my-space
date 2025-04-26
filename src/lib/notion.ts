import { NotionPage } from "@/types/notion";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionAPI } from "notion-client";
import { cache } from "react";

export const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
});

const notion = new NotionAPI();

export const projectDatabaseId = process.env.PROJECT_DATABASE_ID;
export const dictDatabaseId = process.env.DICT_DATABASE_ID;

export const queryNotionDatabase = async (
  databaseId: string
): Promise<NotionPage[]> => {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      method: "POST",
      next: { revalidate: 60 },
      body: JSON.stringify({
        sorts: [{ property: "Date", direction: "descending" }],
      }),
    }
  );

  const data = await res.json();
  return data.results;
};

export const getProjectList = async (): Promise<NotionPage[]> => {
  return queryNotionDatabase(projectDatabaseId!);
};

export const getDictList = async (): Promise<NotionPage[]> => {
  return queryNotionDatabase(dictDatabaseId!);
};

export const getPageBySlug = cache(
  async (slug: string, type: "project" | "dict") => {
    const databaseIdMap = {
      project: projectDatabaseId!,
      dict: dictDatabaseId!,
    };

    const res = await notionClient.databases.query({
      database_id: databaseIdMap[type],
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (res.results.length === 0) {
      throw new Error(`No page found for slug: ${slug}`);
    }

    return res.results[0] as PageObjectResponse | null;
  }
);

export const getPageData = async (pageId: string) => {
  return await notion.getPage(pageId);
};

import { Action, ActionPanel, Color, getPreferenceValues, Icon, List } from "@raycast/api";
import { useState } from "react";
import { useFetch } from "@raycast/utils";

export const preferences = getPreferenceValues();

interface JoplinResponse {
  items: JoplinResponseItem[]
}

interface JoplinResponseItem {
  title: string;
  id: string
}

export default function JoplinSearch() {
  const [searchText, setSearchText] = useState("");
  const encodedQuery = encodeURIComponent(searchText);
  const url = `http://127.0.0.1:41184/search?query=${ encodedQuery }&token=${ preferences.token }`;
  const { data, isLoading } = useFetch<JoplinResponse>(url, { keepPreviousData: true, execute: searchText.length !== 0 });
  const items = data?.items ?? [];

  return (
    <List
      isLoading={ isLoading }
      enableFiltering={false}
      onSearchTextChange={ setSearchText }
      searchBarPlaceholder="Search Joplin..."
      throttle
    >
      <List.Section title="Results" subtitle={ items.length + "" }>
        { items.map((searchResult) => (
          <SearchListItem key={ searchResult.id } item={ searchResult }/>
        )) }
      </List.Section>
    </List>
  );
}

function SearchListItem({ item }: { item: JoplinResponseItem }) {
  return (
    <List.Item
      title={ item.title }
      icon={ {
        source: Icon.Bookmark,
        tintColor: Color.Blue,
      } }
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser title="Open" url={ `joplin://x-callback-url/openNote?id=${ item.id }` }/>
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

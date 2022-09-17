import { Action, ActionPanel, Color, getPreferenceValues, Icon, List } from "@raycast/api";
import { useState } from "react";
import { useFetch } from "@raycast/utils";

export const preferences = getPreferenceValues();

interface JoplinResponse {
  items: JoplinResponseItem[]
}

interface JoplinResponseItem {
  title: string;
  id: string;
  is_todo: 0 | 1;
  body: string;
}

const urlFor = (searchText: string | undefined) => {
  const query = searchText === undefined || searchText.trim().length === 0
    ? "type:todo iscompleted:0"
    : encodeURIComponent(searchText);

  return `http://127.0.0.1:41184/search?query=${ query }&fields=id,is_todo,title,body&token=${ preferences.token }`;
}
export default function JoplinSearch() {
  const [searchText, setSearchText] = useState<undefined | string>("");
  const url = urlFor(searchText);
  console.log(url);
  const { data, isLoading } = useFetch<JoplinResponse>(url, { keepPreviousData: false });
  const items = data?.items ?? [];

  return (
    <List
      isLoading={ isLoading }
      enableFiltering={false}
      onSearchTextChange={ setSearchText }
      searchBarPlaceholder="Search Joplin..."
      throttle
      isShowingDetail={true}
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
  const iconSource = item.is_todo === 0 ? Icon.QuoteBlock : Icon.Circle;
  return (
    <List.Item
      title={ item.title }
      icon={ {
        source: iconSource,
        tintColor: Color.Blue,
      } }
      detail={<List.Item.Detail markdown={item.body}/>}
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

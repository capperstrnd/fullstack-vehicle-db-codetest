import * as React from "react";
import { SearchBox } from "@fluentui/react-search-preview";
import type { SearchBoxProps } from "@fluentui/react-search-preview";

import './SearchBar.css'

type SearchProps = {
    searchInput: string,
    setSearchInput: Function,
    resetSelectedItems: Function
}

export const SearchBar: React.FC<SearchProps> = (props: SearchProps) => {

    function editSearchInput(ev: any, data: { value: any; }) {
        props.setSearchInput(data.value);
        props.resetSelectedItems(); // Just so we don't get weird behaviour with hidden from search but still selected
    }

    return (
        <div className="searchContainer">
            <SearchBox role="search" className="searchField" onChange={editSearchInput} value={props.searchInput}  />
        </div>
    )
}
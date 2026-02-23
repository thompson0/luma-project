import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"

function SearchBar() {
    return (
        <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
                <SearchIcon />
            </InputGroupAddon>
        </InputGroup>
    );
}

export default SearchBar;
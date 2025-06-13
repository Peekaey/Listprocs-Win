import {ModeToggle} from "@/components/ui-components/mode-toggle.tsx";

function Header() {
    return (
        <div id="header" className="text-right mt-4 mr-4">
            <ModeToggle/>
        </div>
    )
}

export default Header;
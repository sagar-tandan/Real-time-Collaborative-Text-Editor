import { Link } from "react-router-dom";
import SearchItem from "./SearchItem";
import UserProfile from "./UserProfile";
import OrganizationFeature from "./OrganizationFeature";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-full w-full">
      <div className="flex gap-2 items-center">
        <Link to="/">
          <img src="/logo.svg" alt="logo" width={36} height={36} />
        </Link>
        <h3 className="text-xl font-medium">Docs</h3>
      </div>
      <SearchItem />

      <div className="flex gap-2 relative">
        <OrganizationFeature />
        <UserProfile />
      </div>
    </header>
  );
}

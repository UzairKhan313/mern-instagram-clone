import { Link } from "react-router-dom";
import { exploreOutline, likeOutline } from "../Icons";

import SearchBar from "./Search-bar";

const Header = () => {
  return (
    <nav className="fixed top-0 w-full border-b bg-white z-10">
      {/* <!-- navbar container --> */}
      <div className="flex flex-row justify-between items-center py-2 px-3.5 sm:w-full sm:py-2 sm:px-4 md:w-full md:py-2 md:px-6 xl:w-4/6 xl:py-3 xl:px-8 mx-auto">
        {/* <!-- logo --> */}
        <Link to="/">
          <img
            draggable="false"
            className="mt-1.5 w-full h-full object-contain"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""
          />
        </Link>

        <SearchBar />

        {/* <!-- icons container  --> */}
        <div className="flex items-center space-x-6 sm:mr-5">
          <span className="hidden sm:block">{exploreOutline}</span>
          <span className="hidden sm:block">{likeOutline}</span>

          <div className={`rounded-full cursor-pointer h-7 w-7 p-[0.5px]`}>
            <img
              draggable="false"
              loading="lazy"
              className="w-full h-full rounded-full object-cover"
              src="https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?w=996&t=st=1728661268~exp=1728661868~hmac=4f27d179f34d5b5d27c405c33943f417d1f19589c36b3fb61d0b05f0fdc4b8aa"
              alt=""
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMe } from "../hooks/useMe";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className='bg-red-500 py-3 px-3 text-center text-base text-white'>
          <span>Please verify your email.</span>
        </div>
      )}
      <header className='py-4'>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center'>
          <Link to='/'>
            <img
              src='https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg'
              className='w-36'
            />
          </Link>
          <span className='text-xs'>
            <Link to='/edit-profile/'>
              <FontAwesomeIcon icon={faUser} className='text-xl' />
            </Link>
          </span>
        </div>
      </header>
    </>
  );
};

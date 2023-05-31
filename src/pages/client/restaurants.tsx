import { gql, useQuery } from "@apollo/client";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
import { Restaurant } from "../../components/restaurant";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restarauntCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

interface IFromProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, handleSubmit, getValues } = useForm<IFromProps>();
  const history = useHistory();
  const onSearchSumbit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSearchSumbit)}
        className='bg-gray-800 w-full py-40 flex items-center justify-center'
      >
        <input
          {...register("searchTerm", {
            required: true,
            min: 3,
          })}
          type='Search'
          className='input rounded-md border-0 w-3/4 md:w-3/12'
          placeholder='Search Restaurants...'
        />
      </form>
      {!loading && (
        <div className='max-w-screen-2xl pb-20 mx-auto mt-8'>
          <div className='flex justify-around max-w-sm mx-auto'>
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className='flex flex-col group items-center cursor-pointer'
              >
                <div
                  className='w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full'
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className='mt-1 text-sm text-center font-medium'>
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className='grid mt-10 lg:grid-cols-3 gap-x-5 gap-y-10'>
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className='focus:outline-none font-medium text-2xl'
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <>
                <button
                  onClick={onNextPageClick}
                  className='focus:outline-none font-medium text-2xl'
                >
                  &rarr;
                </button>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

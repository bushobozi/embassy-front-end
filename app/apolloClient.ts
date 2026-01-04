import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { getAccessToken, clearAuthData } from "./utils/cookies";

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }: any) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        clearAuthData();
        window.location.href = "/login";
      }
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const URL = import.meta.env.VITE_BASE_URL;

const httpLink = new HttpLink({
  uri: `${URL}/graphql/`,
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
});     



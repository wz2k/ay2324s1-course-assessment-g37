import { useCallback, useMemo } from "react";
import { MatchRequest, MatchResponse } from "../components/types";
import useSocket from "./useSocket";
import { isMatchRequest } from "../components/matchingService/utility/isMatchRequest";

const EVENT_FIND_MATCH = 'match';
const EVENT_MATCH_FOUND = 'match found';

/**
 * Handles sending and responding to match requests.
 */
const useMatchingService = (onMatch: (match: MatchResponse) => void) => {
  const eventHandlers = useMemo(() => {
    const wrappedOnMatch = (match?: MatchResponse) => {
      if (isMatchRequest(match)) {
        onMatch(match);
      } else {
        console.log('Invalid match response from server:', match);
      }
    }

    return {
      [EVENT_MATCH_FOUND]: wrappedOnMatch
    };
  }, [onMatch])

  const matchSocket = useSocket('127.0.0.1:8080', eventHandlers);

  const findMatch = useCallback((matchRequest: MatchRequest) => {
    matchSocket.emit(EVENT_FIND_MATCH, matchRequest);
  }, [matchSocket])

  return findMatch;
}

export default useMatchingService;

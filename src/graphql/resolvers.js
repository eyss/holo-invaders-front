import { timer } from 'rxjs'
export function parseResponse(response) {
  const result = JSON.parse(response);
  return result.Ok ? result.Ok : result;
}

export const HAPP_NAME = "invaders";

export const resolvers = {
  Query: {
    async myUser(_, __, { callZome }) {
      const response = await callZome(
        HAPP_NAME,
        "scores",
        "get_my_profile"
      )({});
      return parseResponse(response).address;
    },
    async allScores(_, __, { callZome }) {
      const response = await callZome(
        HAPP_NAME,
        "scores",
        "get_all_scores"
      )({});
      return parseResponse(response);
    }
  },
  User: {
    id: parent => parent,
    async username(agentId, __, { callZome }) {
      const username = await callZome(
        HAPP_NAME,
        "scores",
        "get_username"
      )({ addr: agentId });
      return parseResponse(username);
    },
    async scores(agentId, __, { callZome }) {
      const scores = await callZome(
        HAPP_NAME,
        "scores",
        "get_user_scores"
      )({ addr: agentId });
      return parseResponse(scores);
    }
  },
  Score: {
    user: score => score.author_address
  },
  Mutation: {
    async createUser(_, { name }, { callZome }) {
      const response = await callZome(HAPP_NAME, "scores", "profile")({ name });

      return new Promise((resolve, reject) => {
        timer(500).subscribe(() => resolve(parseResponse(response)))

      });

    },
    async publishScore(_, { score, message }, { callZome }) {
      const response = await callZome(
        HAPP_NAME,
        "scores",
        "publish_score"
      )({ score, message });
      return parseResponse(response);
    }
  }
};
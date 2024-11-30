import axios from "axios";

//GET USER DATA BASED ON ID
export const getLeetCodeInfo = async (req, res, next) => {
  const username = req.body.username;
  const query = `
      {
        matchedUser(username: "${username}") {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
};

export const getRecentProblems = async (req, res, next) => {
  const username = req.body.username;
  const query = `
    query recentSubmissions($username: String!) {
      recentSubmissionList(username: $username) {
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
  `;
  const variables = { username };

  try {
    const response = await axios.post("https://leetcode.com/graphql", {
      query,
      variables,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
};

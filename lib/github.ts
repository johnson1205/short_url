import { Octokit } from "octokit";

const OWNER = "johnson1205";
const REPO = "database";
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

// Base62 Encoding
export function encode(num: number): string {
  if (num === 0) return ALPHABET[0];
  let s = "";
  while (num > 0) {
    s = ALPHABET[num % BASE] + s;
    num = Math.floor(num / BASE);
  }
  return s.padStart(6, ALPHABET[0]);
}

export function decode(str: string): number {
  let num = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid character: ${char}`);
    }
    num = num * BASE + index;
  }
  return num;
}

export async function createIssue(token: string, url: string): Promise<number> {
  const octokit = new Octokit({ auth: token });
  const { data } = await octokit.rest.issues.create({
    owner: OWNER,
    repo: REPO,
    title: "URL Shortener Entry",
    body: url, 
  });
  return data.number;
}

export async function getURL(token: string, issueNumber: number): Promise<string> {
  const octokit = new Octokit({ auth: token });
  try {
    const { data } = await octokit.rest.issues.get({
      owner: OWNER,
      repo: REPO,
      issue_number: issueNumber,
    });
    return data.body || ""; 
  } catch (error) {
    console.error("Error fetching issue:", error);
    return "";
  }
}

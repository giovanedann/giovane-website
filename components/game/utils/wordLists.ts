export const easyWords = [
  "go", "js", "py", "do", "if", "or", "no", "on", "up", "ok",
  "code", "bug", "api", "git", "css", "dom", "app", "dev", "log", "sql",
  "npm", "cli", "url", "jsx", "tsx", "vue", "src", "lib", "env", "key",
  "map", "set", "arr", "obj", "int", "str", "num", "var", "let", "for",
  "new", "try", "get", "put", "run", "fix", "add", "use", "end",
];

export const mediumWords = [
  "react", "hooks", "state", "props", "redux", "async", "await", "fetch",
  "query", "route", "parse", "cache", "debug", "build", "deploy", "merge",
  "clone", "branch", "commit", "rebase", "docker", "nginx", "redis", "mongo",
  "mysql", "graph", "stack", "queue", "array", "class", "super", "yield",
  "throw", "catch", "break", "while", "const", "return", "import", "export",
  "lambda", "stream", "buffer", "socket", "thread", "kernel", "cursor",
];

export const hardWords = [
  "typescript", "javascript", "component", "interface", "algorithm",
  "recursive", "iteration", "container", "kubernetes", "microservice",
  "serverless", "framework", "middleware", "websocket", "encryption",
  "authentication", "authorization", "serialization", "deserialization",
  "optimization", "refactoring", "dependency", "abstraction", "polymorphism",
  "inheritance", "composition", "aggregation", "encapsulation", "singleton",
  "prototype", "decorator", "observer", "strategy", "callback", "promise",
];

export const techWords = [
  "nextjs", "tailwind", "vercel", "prisma", "supabase", "graphql", "apollo",
  "webpack", "babel", "eslint", "prettier", "vitest", "cypress", "playwright",
  "storybook", "chromatic", "figma", "postman", "swagger", "openapi",
  "terraform", "ansible", "jenkins", "gitlab", "bitbucket", "jira", "slack",
];

const allWords = [...easyWords, ...mediumWords, ...hardWords, ...techWords];

const alphabet = "abcdefghijklmnopqrstuvwxyz";

export function getGibberishWord(minLength: number = 5, maxLength: number = 10): string {
  const length = minLength + Math.floor(Math.random() * (maxLength - minLength + 1));
  let word = "";

  for (let i = 0; i < length; i++) {
    word += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return word;
}

function getWordsInLengthRange(minLength: number, maxLength: number): string[] {
  return allWords.filter((word) => word.length >= minLength && word.length <= maxLength);
}

export function getWordByDifficulty(
  elapsedTime: number,
  minLength?: number,
  maxLength?: number
): string {
  if (minLength !== undefined && maxLength !== undefined) {
    const pool = getWordsInLengthRange(minLength, maxLength);
    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  const minutes = elapsedTime / 60000;

  if (minutes < 1) {
    return easyWords[Math.floor(Math.random() * easyWords.length)];
  } else if (minutes < 3) {
    const pool = [...easyWords, ...mediumWords];
    return pool[Math.floor(Math.random() * pool.length)];
  } else if (minutes < 5) {
    const pool = [...mediumWords, ...techWords];
    return pool[Math.floor(Math.random() * pool.length)];
  } else {
    const pool = [...mediumWords, ...hardWords, ...techWords];
    return pool[Math.floor(Math.random() * pool.length)];
  }
}

export function getMaxLayers(elapsedTime: number, configMaxLayers?: number): number {
  const maxAllowed = configMaxLayers ?? 3;
  const minutes = elapsedTime / 60000;

  if (minutes < 2 || maxAllowed === 1) return 1;

  if (minutes < 4) {
    if (maxAllowed >= 2 && Math.random() > 0.7) return 2;
    return 1;
  }

  if (maxAllowed >= 3 && Math.random() > 0.6) {
    return Math.random() > 0.5 ? 3 : 2;
  }
  if (maxAllowed >= 2 && Math.random() > 0.5) return 2;
  return 1;
}

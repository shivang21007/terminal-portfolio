"use client";

export const asciiName: string[] = [
  "    _____ __    _                            ",
  "   / ___// /_  (_)   ______ _____  ____ _    ",
  "   \\__ \\/ __ \\/ / | / / __ `/ __ \\/ __ `/    ",
  "  ___/ / / / / /| |/ / /_/ / / / / /_/ /     ",
  " /____/_/ /_/_/ |___/\\__,_/_/ /_/\\__, /      ",
  "                                /____/       ",
];

export const faceArt: string[] = [
  "                       ,##,,eew,",
  "                     ,##############C",
  "                  a###############@##",
  '                 7####^`^"7W7^"@####',
  "                 @#@b`         ^@#@^",
  "                  ##^,,,,   ,,,,^#^",
  '                 ,,@######"#######=',
  "                  .''555\"` '5555b|",
  '                  T"@  ,,,^,mg,@,*',
  "                     %p||`~~'.#`",
  "                      ^Wp  ,#T",
  "                     :b''@@b^}",
  "                  ,^     ` 'b 3-",
  "              .<` 'p   ^v   #   b   *.",
  '            {      }   #"GpGb   [',
  "            C      3 * @#######Nl      `",
  "           '            ^@##b     ($    !",
];

export function AsciiArt() {
  return (
    <div className="flex flex-col md:flex-row md:gap-4 items-start">
      <div className="text-green-400 leading-[1.2] select-none overflow-hidden">
        {asciiName.map((line, i) => (
          <div key={i} className="whitespace-pre">{line}</div>
        ))}
      </div>
      <div className="hidden md:block text-gray-500 leading-[1.2] select-none shrink-0">
        {faceArt.map((line, i) => (
          <div key={i} className="whitespace-pre">{line}</div>
        ))}
      </div>
    </div>
  );
}

export default function WelcomeMessage() {
  return (
    <div className="mb-4">
      <AsciiArt />
      <div className="mt-5 space-y-1">
        <p>Welcome to my terminal portfolio. (Version 1.0.0)</p>
        <p className="text-gray-600">----</p>
        {/* <p>
          This project&apos;s source code can be found in this project&apos;s{" "}
          <a
            href="https://github.com/shivanggupta/terminal-portfolio"
            target="_blank"
            rel="noreferrer"
            className="text-yellow-400 underline decoration-dashed hover:text-yellow-300"
          >
            GitHub repo
          </a>
          .
        </p> */}
        <p className="text-gray-600">----</p>
        <p>
          For a list of available commands, type{" "}
          <span className="text-green-400">&apos;help&apos;</span>.
        </p>
      </div>
    </div>
  );
}

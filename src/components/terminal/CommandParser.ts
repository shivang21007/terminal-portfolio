import { USER, HOSTNAME } from "@/lib/constants";
import { generateProcesses } from "./ProcessSimulator";
import { files, ifconfig } from "@/lib/constants";

export function executeCommand(input: string): string {
  const args = input.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  switch (cmd) {
    case "help":
      return `Available commands:
  help       → Show this help menu
  about      → Who I am
  skills     → Technical stack
  projects   → What I've built
  contact    → How to reach me
  ls         → List files
  cat <file> → Read a file
  whoami     → Current user
  hostname   → Machine hostname
  ps         → Running processes
  df         → Disk usage
  ifconfig   → Network info
  clear      → Clear terminal`;

    case "about":
      return files["about.txt"];

    case "skills":
      return files["skills.txt"];

    case "projects":
      return files["projects.txt"];

    case "contact":
      return files["contact.txt"];

    case "cat": {
      const filename = args[1];
      if (!filename) {
        return "Usage: cat <filename>";
      }
      const content = files[filename];
      if (!content) {
        return `cat: ${filename}: No such file or directory`;
      }
      return content;
    }

    case "ls":
      return Object.keys(files).join("\n");

    case "whoami":
    case "who":
      return USER;

    case "hostname":
      return HOSTNAME;

    case "ifconfig":
      return ifconfig;

    case "df":
      return `Filesystem      Size  Used Avail Use%
/dev/sda1       50G   18G   30G  38%
/dev/sda2      200G  120G   80G  60%`;

    case "ps":
      const processes = generateProcesses();
      return processes
        .map(p => `${p.user} ${p.pid} ${p.command}`)
        .join("\n");

    case "top":
    case "htop":
      return "Launching system monitor...";

    case "":
      return "";

    default:
      return `Command not found: ${cmd}. Type 'help' to see available commands.`;
  }
}

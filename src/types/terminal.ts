export type FileNode = {
    type: "file" | "dir";
    content?: string;
    children?: Record<string, FileNode>;
    protected?: boolean;
  };
  
  export type Process = {
    pid: number;
    user: string;
    command: string;
    cpu: number;
    mem: number;
  };
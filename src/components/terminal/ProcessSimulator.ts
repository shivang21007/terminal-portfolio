import { Process } from "@/types/terminal";

export function generateProcesses(): Process[] {
  return [
    { pid: 1, user: "root", command: "init", cpu: 0.1, mem: 0.5 },
    { pid: 102, user: "root", command: "containerd", cpu: 1.2, mem: 3.2 },
    { pid: 221, user: "shivang", command: "node portfolio", cpu: 2.5, mem: 4.1 },
    { pid: 322, user: "shivang", command: "kubelet", cpu: 1.8, mem: 2.8 }
  ];
}
export const USER = "shivang";
export const HOSTNAME = "shivanggupta.in";
export const LinkedIn = "https://linkedin.com/in/shivang21007";
export const GitHub = "https://github.com/shivang21007";
export const Email = "shivanggupta26@gmail.com";

export const files: Record<string, string> = {
    "about.txt": `Backend & DevOps Engineer.
  Deep into Linux internals, system design, process isolation,
  namespaces, networking, and distributed systems.
  Believes in first principles. No abstraction without understanding.`,
  
    "skills.txt": `Core Expertise:
  - Linux Internals (process, memory, namespaces)
  - Docker / Container Runtime
  - Kubernetes (CKA path)
  - AWS Architecture
  - CI/CD Pipelines
  - Database Optimization
  - Shell Scripting & Automation`,
  
    "projects.txt": `Highlighted Work:
  - Built custom CI/CD pipelines
  - Designed containerized microservices
  - Automated infrastructure provisioning
  - Deep dive tooling for TLS & network audits`,
  
    "contact.txt": `Let's connect:
  LinkedIn: ${LinkedIn}
  GitHub: ${GitHub}
  Email: ${Email}`,
  };
  
export const ifconfig: string = `
    lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 30145  bytes 6044639 (6.0 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 30145  bytes 6044639 (6.0 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
    eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe89::20c:19ff:fe01:2  prefixlen 64  scopeid 0x20<link>
        ether 02:0c:29:01:02:03  txqueuelen 1000  (Ethernet)
        RX packets 1234567  bytes 1024000000 (1.0 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1234567  bytes 1024000000 (1.0 GB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
`;